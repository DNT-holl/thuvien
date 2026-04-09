import './index.css';
import React, { useState, useEffect } from 'react';
import { authAPI, storiesAPI, commentsAPI } from './utils/apiClient';
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [userRole, setUserRole] = useState('viewer');
  const [currentScreen, setCurrentScreen] = useState('library');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kiểm tra token khi ứng dụng load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('userRole');

    if (token && savedUser) {
      authAPI
        .verify(token)
        .then(() => {
          setIsAuthenticated(true);
          setCurrentUser(savedUser);
          setUserRole(savedRole || 'viewer');
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          setIsAuthenticated(false);
        });
    }
    
    // Luôn load stories (public)
    loadStories();
  }, []);

  // Tải danh sách truyện
  const loadStories = async () => {
    setLoading(true);
    try {
      const response = await storiesAPI.getAll();
      setStories(response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách truyện!');
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập
  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', user.username);
      localStorage.setItem('userRole', user.role);

      setIsAuthenticated(true);
      setCurrentUser(user.username);
      setUserRole(user.role);
      setShowLoginModal(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setCurrentUser('');
    setUserRole('viewer');
    setShowLoginModal(false);
    setSelectedStory(null);
  };

  // Mở truyện để đọc
  const openStory = async (storyId) => {
    try {
      const response = await storiesAPI.getById(storyId);
      setSelectedStory(response.data);
      setCurrentScreen('reader');
    } catch (err) {
      setError('Không thể tải truyện!');
    }
  };

  // Quay lại tủ sách
  const goBack = () => {
    setSelectedStory(null);
    setCurrentScreen('library');
  };

  const goToAdmin = () => {
    setCurrentScreen('admin');
  };

  // Thêm truyện (Admin only)
  const handleAddStory = async (storyData) => {
    try {
      await storiesAPI.create(storyData);
      await loadStories();
      setCurrentScreen('library');
      setError('');
    } catch (err) {
      setError('Lỗi thêm truyện!');
    }
  };

  // Render screens
  if (currentScreen === 'admin' && userRole === 'admin') {
    return (
      <AdminPanel
        onBack={() => setCurrentScreen('library')}
        onAddStory={handleAddStory}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'reader' && selectedStory) {
    return (
      <ReaderPage
        story={selectedStory}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onBack={goBack}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
      />
    );
  }

  if (currentScreen === 'library') {
    return (
      <LibraryPage
        stories={stories}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        loading={loading}
        error={error}
        onSelectStory={openStory}
        onLogout={handleLogout}
        onOpenAdmin={goToAdmin}
        onOpenLogin={() => setShowLoginModal(true)}
        showLoginModal={showLoginModal}
        onLogin={handleLogin}
        loginError={error}
        loginLoading={loading}
        onCloseLogin={() => setShowLoginModal(false)}
      />
    );
  }

  return null;
}
