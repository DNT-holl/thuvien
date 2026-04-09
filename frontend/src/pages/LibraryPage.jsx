import React, { useState } from 'react';
import { BookOpen, User, LogOut, Lock, X } from 'lucide-react';

export default function LibraryPage({
  stories,
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
}) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await onLogin(loginUsername, loginPassword);
    setLoginUsername('');
    setLoginPassword('');
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm pt-6 pb-4 px-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-800">Tủ Sách Gia Đình</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && userRole === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
              >
                <Lock size={18} /> Admin
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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story._id}
                onClick={() => onSelectStory(story._id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-300 transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
                  {story.audioLink && (
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-sm font-bold text-orange-600">
                      🔊 Có audio
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{story.title}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-3">Tác giả: {story.author}</p>

                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span>❤️ {story.reactions?.heart || 0}</span>
                    <span>👍 {story.reactions?.like || 0}</span>
                    <span>😊 {story.reactions?.smile || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
