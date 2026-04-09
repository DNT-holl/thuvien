import './index.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { authAPI, storiesAPI, commentsAPI } from './utils/apiClient';
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';
import AdminPanel from './pages/AdminPanel';

// Context để chia sẻ auth state
export const AuthContext = React.createContext();

function AppContent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [userRole, setUserRole] = useState('viewer');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
  const loadStories = async (search = '') => {
    setLoading(true);
    try {
      const response = await storiesAPI.getAll(null, search);
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
    setError('');
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
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập!');
      return false;
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
    navigate('/');
  };

  // Thêm truyện (Admin only)
  const handleAddStory = async (storyData) => {
    try {
      await storiesAPI.create(storyData);
      await loadStories();
      navigate('/');
      setError('');
    } catch (err) {
      setError('Lỗi thêm truyện!');
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    loadStories(null, query);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        userRole,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={async (username, password) => {
                const success = await handleLogin(username, password);
                if (success) {
                  navigate('/');
                }
              }}
              error={error}
              loading={loading}
            />
          }
        />

        <Route
          path="/"
          element={
            <LibraryPage
              stories={stories}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              loading={loading}
              error={error}
              onSelectStory={(storyId) => navigate(`/story/${storyId}`)}
              onLogout={handleLogout}
              onOpenAdmin={() => navigate('/admin')}
              onOpenLogin={() => setShowLoginModal(true)}
              showLoginModal={showLoginModal}
              onLogin={handleLogin}
              loginError={error}
              loginLoading={loading}
              onCloseLogin={() => setShowLoginModal(false)}
            />
          }
        />

        <Route
          path="/story/:id"
          element={
            <ReaderPageRoute
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              userRole={userRole}
              onLogout={handleLogout}
              onOpenLogin={() => setShowLoginModal(true)}
            />
          }
        />

        <Route
          path="/admin"
          element={
            userRole === 'admin' ? (
              <AdminPanel
                onBack={() => navigate('/')}
                onAddStory={handleAddStory}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <p className="text-2xl font-bold text-red-600">Không có quyền truy cập!</p>
              </div>
            )
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

// Component để lấy story từ URL param
function ReaderPageRoute({ isAuthenticated, currentUser, userRole, onLogout, onOpenLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true);
        const response = await storiesAPI.getById(id);
        setStory(response.data);
        setError('');
      } catch (err) {
        setError('Không thể tải truyện!');
        console.error('Lỗi tải truyện:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!story || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold text-gray-600">Truyện không tìm thấy!</p>
      </div>
    );
  }

  return (
    <ReaderPage
      story={story}
      currentUser={currentUser}
      isAuthenticated={isAuthenticated}
      userRole={userRole}
      onBack={() => navigate(-1)}
      onLogout={onLogout}
      onOpenLogin={onOpenLogin}
      onDelete={() => navigate('/')}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
