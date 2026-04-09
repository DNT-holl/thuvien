import React, { useState } from 'react';
import { Lock, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin, error, loading }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser.trim()) {
      setLocalError('Cháu nhớ điền tên mình nhé!');
      return;
    }
    if (!passwordInput.trim()) {
      setLocalError('Nhập mật khẩu đi!');
      return;
    }
    setLocalError('');
    onLogin(currentUser, passwordInput);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-red-700">Đăng Nhập Admin</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg font-medium text-center mb-6">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                placeholder="Tên người dùng"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition placeholder-gray-400"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
