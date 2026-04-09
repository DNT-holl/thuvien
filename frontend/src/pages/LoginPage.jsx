import React, { useState } from 'react';
import { BookOpen, Lock, User } from 'lucide-react';

export default function LoginPage({ onLogin, error, loading }) {
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border-4 border-orange-200">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <BookOpen size={48} className="text-orange-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-orange-800 mb-2">Thư Viện Gia Đình</h1>
        <p className="text-center text-orange-600 mb-8 font-medium">Nơi cất giữ những câu chuyện hay</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Cháu tên là gì nhỉ?</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                placeholder="Ví dụ: Bé Na, Bé Bin..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:outline-none transition placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Mật khẩu vào cửa:</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="(Hỏi bố/cậu nhé)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:outline-none transition placeholder-gray-400"
              />
            </div>
          </div>

          {(error || localError) && (
            <p className="text-red-500 font-medium text-center">{error || localError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl shadow-md transform transition hover:-translate-y-1 disabled:transform-none"
          >
            {loading ? 'Đang mở cửa...' : 'Mở cửa tủ sách'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          🔐 Đây là khu vực riêng của gia đình
        </p>
      </div>
    </div>
  );
}
