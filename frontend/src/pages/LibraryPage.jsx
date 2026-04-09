import React, { useState } from 'react';
import { BookOpen, User, LogOut, X, Plus, Search } from 'lucide-react';
import { categoriesAPI, storiesAPI } from '../utils/apiClient';

export default function LibraryPage({
  stories,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentUser,
  isAuthenticated,
  userRole,
  loading,
  error,
  onSelectStory,
  onLogout,
  onOpenAdmin,
  onOpenLogin,
  showLoginModal,
  onLogin,
  loginError,
  loginLoading,
  onCloseLogin,
  onRefreshCategories,
}) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Story selection modal state
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedCategoryForStories, setSelectedCategoryForStories] = useState(null);
  const [selectedStories, setSelectedStories] = useState(new Set());
  const [storySearchQuery, setStorySearchQuery] = useState('');
  const [addingStories, setAddingStories] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await onLogin(loginUsername, loginPassword);
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setCreatingCategory(true);
    try {
      await categoriesAPI.create({
        name: newCategoryName,
        icon: '📚',
      });
      setNewCategoryName('');
      setShowNewCategory(false);
      await onRefreshCategories();
    } catch (err) {
      console.error('Lỗi tạo danh mục:', err);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Bạn chắc muốn xóa danh mục này?')) {
      try {
        await categoriesAPI.delete(catId);
        await onRefreshCategories();
        if (selectedCategory === catId) {
          onSelectCategory(null);
        }
      } catch (err) {
        console.error('Lỗi xóa danh mục:', err);
      }
    }
  };

  const handleOpenStoryModal = (categoryId) => {
    setSelectedCategoryForStories(categoryId);
    setSelectedStories(new Set());
    setStorySearchQuery('');
    setShowStoryModal(true);
  };

  const handleToggleStory = (storyId) => {
    const newSelected = new Set(selectedStories);
    if (newSelected.has(storyId)) {
      newSelected.delete(storyId);
    } else {
      newSelected.add(storyId);
    }
    setSelectedStories(newSelected);
  };

  const handleAddAllStories = async () => {
    if (selectedStories.size === 0) return;
    
    setAddingStories(true);
    try {
      const storyIdsArray = Array.from(selectedStories);
      await categoriesAPI.addStories(selectedCategoryForStories, storyIdsArray);
      
      // Close modal and refresh
      setShowStoryModal(false);
      setSelectedStories(new Set());
      await onRefreshCategories();
    } catch (err) {
      console.error('Lỗi thêm truyện vào danh mục:', err);
    } finally {
      setAddingStories(false);
    }
  };

  // Get category object
  const currentCategory = selectedCategoryForStories 
    ? categories.find(c => c._id === selectedCategoryForStories)
    : null;

  // Get already assigned story IDs in this category
  const assignedStoryIds = currentCategory?.stories?.map(s => s.storyId) || [];

  // Filter stories not in this category and matching search
  const availableStories = stories.filter(story => {
    if (assignedStoryIds.includes(story._id)) return false;
    if (storySearchQuery.trim()) {
      const query = storySearchQuery.toLowerCase();
      return story.title.toLowerCase().includes(query) || 
             story.author.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-orange-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm pt-6 pb-4 px-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-800">Tủ Sách Gia Đình</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && userRole === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
              >
                <Plus size={18} /> Thêm truyện
              </button>
            )}
            {isAuthenticated ? (
              <>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <User size={18} /> {currentUser}
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
              >
                <User size={18} /> Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc tác giả..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </header>

      <div className="flex gap-4 px-4 mt-4 max-w-7xl mx-auto">
        {/* Sidebar - Categories */}
        <aside className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-3 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-sm font-bold text-gray-800 mb-2 px-2">📚 DANH MỤC</h2>

            {/* All Button */}
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-1.5 rounded-lg mb-0.5 font-medium text-xs transition ${
                selectedCategory === null
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              📖 Tất cả
            </button>

            {/* Categories List */}
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-0.5 mb-0.5 group">
                <button
                  onClick={() => onSelectCategory(cat._id)}
                  className={`flex-1 text-left px-3 py-1.5 rounded-lg font-medium text-xs transition ${
                    selectedCategory === cat._id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
                {isAuthenticated && userRole === 'admin' && (
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleOpenStoryModal(cat._id)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                      title="Thêm truyện"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Category Button (Admin only) */}
            {isAuthenticated && userRole === 'admin' && (
              <>
                {!showNewCategory ? (
                  <button
                    onClick={() => setShowNewCategory(true)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition mt-2"
                  >
                    <Plus size={12} /> Mục mới
                  </button>
                ) : (
                  <div className="mt-2 pt-2 border-t">
                    <input
                      type="text"
                      placeholder="Tên danh mục..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs mb-1 focus:outline-none focus:border-purple-500"
                      disabled={creatingCategory}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategoryName.trim()}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 rounded text-xs font-bold transition"
                      >
                        Tạo
                      </button>
                      <button
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName('');
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded text-xs font-bold transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Đang tải truyện...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Chưa có truyện nào cả!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story._id}
                  onClick={() => onSelectStory(story._id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{story.title}</h3>
                    <p className="text-gray-500 text-sm font-medium mb-3">Tác giả: {story.author}</p>

                    <div className="flex items-center gap-4 text-gray-700 font-bold">
                      <span className="flex items-center gap-1">
                        ❤️ {story.reactions?.heart || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {story.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Story Selection Modal */}
      {showStoryModal && currentCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl mx-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Thêm truyện vào "{currentCategory.name}"</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedStories.size} truyện được chọn ({availableStories.length} truyện có sẵn)
                </p>
              </div>
              <button
                onClick={() => setShowStoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4 flex-shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm truyện..."
                  value={storySearchQuery}
                  onChange={(e) => setStorySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Stories Grid */}
            <div className="flex-1 overflow-y-auto mb-4">
              {availableStories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có truyện nào để thêm
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableStories.map((story) => (
                    <div
                      key={story._id}
                      onClick={() => handleToggleStory(story._id)}
                      className={`p-3 rounded-xl cursor-pointer transition border-4 ${
                        selectedStories.has(story._id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="h-32 overflow-hidden rounded-lg mb-2">
                        <img
                          src={story.cover}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {story.author}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setShowStoryModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddAllStories}
                disabled={selectedStories.size === 0 || addingStories}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2"
              >
                {addingStories ? (
                  <>
                    <span>Đang thêm...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Thêm {selectedStories.size} truyện
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-800">Đăng Nhập Admin</h2>
              <button onClick={onCloseLogin} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {loginError && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg mb-4">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Tên người dùng"
                  disabled={loginLoading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Mật khẩu gia đình"
                  disabled={loginLoading}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
              >
                {loginLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await onLogin(loginUsername, loginPassword);
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setCreatingCategory(true);
    try {
      await categoriesAPI.create({
        name: newCategoryName,
        icon: '📚',
      });
      setNewCategoryName('');
      setShowNewCategory(false);
      await onRefreshCategories();
    } catch (err) {
      console.error('Lỗi tạo danh mục:', err);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Bạn chắc muốn xóa danh mục này?')) {
      try {
        await categoriesAPI.delete(catId);
        await onRefreshCategories();
        if (selectedCategory === catId) {
          onSelectCategory(null);
        }
      } catch (err) {
        console.error('Lỗi xóa danh mục:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm pt-6 pb-4 px-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-800">Tủ Sách Gia Đình</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && userRole === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
              >
                <Plus size={18} /> Thêm truyện
              </button>
            )}
            {isAuthenticated ? (
              <>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <User size={18} /> {currentUser}
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
              >
                <User size={18} /> Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc tác giả..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </header>

      <div className="flex gap-4 px-4 mt-4 max-w-7xl mx-auto">
        {/* Sidebar - Categories */}
        <aside className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-3 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-sm font-bold text-gray-800 mb-2 px-2">📚 DANH MỤC</h2>

            {/* All Button */}
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-1.5 rounded-lg mb-0.5 font-medium text-xs transition ${
                selectedCategory === null
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              📖 Tất cả
            </button>

            {/* Categories List */}
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-0.5 mb-0.5 group">
                <button
                  onClick={() => onSelectCategory(cat._id)}
                  className={`flex-1 text-left px-3 py-1.5 rounded-lg font-medium text-xs transition ${
                    selectedCategory === cat._id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
                {isAuthenticated && userRole === 'admin' && (
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Add Category Button (Admin only) */}
            {isAuthenticated && userRole === 'admin' && (
              <>
                {!showNewCategory ? (
                  <button
                    onClick={() => setShowNewCategory(true)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition mt-2"
                  >
                    <Plus size={12} /> Mục mới
                  </button>
                ) : (
                  <div className="mt-2 pt-2 border-t">
                    <input
                      type="text"
                      placeholder="Tên danh mục..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs mb-1 focus:outline-none focus:border-purple-500"
                      disabled={creatingCategory}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategoryName.trim()}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 rounded text-xs font-bold transition"
                      >
                        Tạo
                      </button>
                      <button
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName('');
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded text-xs font-bold transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Đang tải truyện...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Chưa có truyện nào cả!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story._id}
                  onClick={() => onSelectStory(story._id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{story.title}</h3>
                    <p className="text-gray-500 text-sm font-medium mb-3">Tác giả: {story.author}</p>

                    <div className="flex items-center gap-4 text-gray-700 font-bold">
                      <span className="flex items-center gap-1">
                        ❤️ {story.reactions?.heart || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {story.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-800">Đăng Nhập Admin</h2>
              <button onClick={onCloseLogin} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {loginError && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg mb-4">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Tên người dùng"
                  disabled={loginLoading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Mật khẩu gia đình"
                  disabled={loginLoading}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
              >
                {loginLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
