import React, { useState } from 'react';
import { ArrowLeft, LogOut, Plus } from 'lucide-react';

export default function AdminPanel({ onBack, onAddStory, currentUser, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    content: '',
    audioLink: '',
    pdfLink: '',
    category: 'khác',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onAddStory(formData);
      setFormData({
        title: '',
        author: '',
        cover: '',
        content: '',
        audioLink: '',
        pdfLink: '',
        category: 'khác',
        description: '',
      });
      setSuccess('Thêm truyện thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Lỗi thêm truyện!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm pt-6 pb-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-bold px-3 py-2 rounded-lg hover:bg-orange-50 transition"
            >
              <ArrowLeft size={20} /> Quay lại
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus size={24} className="text-purple-600" /> Thêm Truyện Mới
          </h2>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-2 border-green-500 text-green-700 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Tên Truyện *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Nhập tên truyện..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">Tác Giả *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Nhập tên tác giả..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">URL Ảnh Bìa *</label>
              <input
                type="url"
                name="cover"
                value={formData.cover}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Nhập URL ảnh từ Google Drive hoặc Unsplash..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">Nội Dung Truyện</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Nhập nội dung truyện..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">URL File Audio (MP3)</label>
              <input
                type="url"
                name="audioLink"
                value={formData.audioLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Nhập URL file audio từ Google Drive..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">URL File PDF</label>
              <input
                type="url"
                name="pdfLink"
                value={formData.pdfLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Nhập URL file PDF từ Google Drive..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">Thể Loại</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
              >
                <option value="khác">Khác</option>
                <option value="truyện cổ tích">Truyện Cổ Tích</option>
                <option value="truyện nước ngoài">Truyện Nước Ngoài</option>
                <option value="truyện hiện đại">Truyện Hiện Đại</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">Mô Tả Ngắn</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Mô tả ngắn về truyện..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl shadow-md transform transition hover:-translate-y-1"
            >
              {loading ? 'Đang thêm...' : 'Thêm Truyện'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
