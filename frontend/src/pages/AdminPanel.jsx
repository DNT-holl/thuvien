import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Plus, Trash2 } from 'lucide-react';
import { storiesAPI } from '../utils/apiClient';

export default function AdminPanel({ onBack, onAddStory, currentUser, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    pdfLink: '',
    videoLink: '',
    category: 'khác',
    description: '',
  });
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load stories khi component mount
  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await storiesAPI.getAll();
      setStories(response.data);
    } catch (err) {
      console.error('Lỗi tải danh sách truyện:', err);
    }
  };

  const handleDeleteStory = async (storyId, storyTitle) => {
    if (!window.confirm(`Bạn chắc muốn xóa truyện "${storyTitle}"?`)) {
      return;
    }

    setDeleting(storyId);
    try {
      await storiesAPI.delete(storyId);
      setStories(stories.filter((s) => s._id !== storyId));
      setSuccess('Xóa truyện thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Lỗi xóa truyện!');
    } finally {
      setDeleting(null);
    }
  };

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
        pdfLink: '',
        videoLink: '',
        category: 'khác',
        description: '',
      });
      setSuccess('Thêm truyện thành công!');
      await loadStories(); // Reload stories list
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
              <label className="block font-bold text-gray-700 mb-2">URL File PDF *</label>
              <input
                type="text"
                name="pdfLink"
                value={formData.pdfLink}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Paste link PDF từ Google Drive (tự động chuyển đổi)"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Hỗ trợ tất cả định dạng link Google Drive:
                <br />• https://drive.google.com/file/d/FILE_ID/view?usp=sharing
                <br />• https://drive.google.com/file/d/FILE_ID/preview
                <br />• https://drive.google.com/open?id=FILE_ID
                <br />• FILE_ID (chỉ ID)
              </p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">URL Video (YouTube hoặc Google Drive)</label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Link YouTube hoặc Google Drive (tự động chuyển đổi)"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Hỗ trợ:
                <br />• YouTube: https://youtu.be/xxx hoặc https://www.youtube.com/watch?v=xxx
                <br />• Google Drive: https://drive.google.com/file/d/FILE_ID/view
              </p>
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

        {/* Stories List */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Quản Lý Truyện ({stories.length})</h2>

          {stories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có truyện nào. Hãy thêm truyện mới!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition"
                >
                  <img
                    src={story.cover}
                    alt={story.title}
                    className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{story.title}</h3>
                    <p className="text-sm text-gray-600 truncate">Tác giả: {story.author}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      ❤️ {story.reactions?.heart || 0} | 💬{' '}
                      {story.comments?.length || 0}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteStory(story._id, story.title)
                    }
                    disabled={deleting === story._id}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
