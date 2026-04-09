import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send, LogOut, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storiesAPI, commentsAPI } from '../utils/apiClient';

export default function ReaderPage({ story, currentUser, isAuthenticated, userRole, onBack, onLogout, onOpenLogin, onDelete }) {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  // Chuyển đổi URL Google Drive sang dạng embed
  const convertGoogleDriveUrl = (url) => {
    if (!url) return null;
    
    // Nếu đã là dạng /uc?id=... thì trả về luôn
    if (url.includes('/uc?id=')) {
      return url;
    }
    
    // Extract FILE_ID từ các định dạng khác
    let fileId = null;
    
    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match1) {
      fileId = match1[1];
    }
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/id=([a-zA-Z0-9-_]+)/);
    if (!fileId && match2) {
      fileId = match2[1];
    }
    
    // Format: Nếu chỉ paste FILE_ID trực tiếp
    if (!fileId && url.match(/^[a-zA-Z0-9-_]{25,}$/)) {
      fileId = url;
    }
    
    if (fileId) {
      return `https://drive.google.com/uc?id=${fileId}`;
    }
    
    return url;
  };

  useEffect(() => {
    loadComments();
  }, [story._id]);

  const loadComments = async () => {
    try {
      const response = await commentsAPI.getByStoryId(story._id);
      setComments(response.data);
    } catch (error) {
      console.error('Lỗi tải bình luận:', error);
    }
  };

  const handleReact = async (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Nếu user chưa tim, thì tim
      if (!hasLiked) {
        await storiesAPI.react(story._id, type);
        story.reactions[type] += 1;
        setHasLiked(true);
      } else {
        // Nếu đã tim rồi, thì hủy tim
        await storiesAPI.unreact(story._id, type);
        story.reactions[type] -= 1;
        setHasLiked(false);
      }
      // Trigger re-render
      window.dispatchEvent(new Event('storyUpdated'));
    } catch (error) {
      console.error('Lỗi thêm cảm xúc:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentInput.trim()) return;

    setLoading(true);
    try {
      await commentsAPI.create({
        storyId: story._id,
        text: commentInput,
      });
      setCommentInput('');
      await loadComments();
    } catch (error) {
      console.error('Lỗi gửi bình luận:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      await loadComments();
    } catch (error) {
      console.error('Lỗi xóa bình luận:', error);
    }
  };

  const handleDeleteStory = async () => {
    if (!window.confirm(`Bạn chắc muốn xóa truyện "${story.title}"?`)) {
      return;
    }

    try {
      await storiesAPI.delete(story._id);
      // Chờ 1 giây rồi navigate về trang chủ để tránh lỗi
      setTimeout(() => {
        onDelete();
      }, 500);
    } catch (error) {
      console.error('Lỗi xóa truyện:', error);
      alert('Lỗi xóa truyện!');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Toolbar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-bold px-3 py-2 rounded-lg hover:bg-orange-50 transition"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h2 className="font-bold text-gray-800 truncate px-4 flex-1 text-center">{story.title}</h2>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
                  <User size={16} /> {currentUser}
                </div>
                {userRole === 'admin' && (
                  <button
                    onClick={handleDeleteStory}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold px-3 py-2 rounded-lg transition"
                    title="Xóa truyện này"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-red-600 font-bold px-3 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-bold px-3 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {/* Story Header */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">{story.title}</h1>
          <p className="text-center text-gray-500 font-medium mb-8">Tác giả: {story.author}</p>

          <img
            src={story.cover}
            alt="Bìa truyện"
            className="w-full h-64 md:h-96 object-cover rounded-2xl border-4 border-stone-100"
          />
        </div>

        {/* PDF Viewer */}
        {story.pdfLink ? (
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Đọc truyện</h2>
            <iframe
              src={`${convertGoogleDriveUrl(story.pdfLink)}#toolbar=1&navpanes=0`}
              className="w-full h-screen rounded-2xl border-2 border-gray-200"
              title="PDF Viewer"
              frameBorder="0"
            />
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8 mb-8 text-center">
            <p className="text-yellow-800 font-bold text-lg">📄 Chưa có file PDF để đọc</p>
          </div>
        )}

        {/* Reactions */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-8 flex flex-col items-center">
          <h3 className="font-bold text-gray-700 mb-4">Yêu thích</h3>
          <button
            onClick={() => handleReact('heart')}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition transform group-hover:scale-110">
              <Heart size={32} fill="currentColor" />
            </div>
            <span className="font-bold text-gray-600 text-lg">{story.reactions?.heart || 0}</span>
          </button>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MessageCircle className="text-orange-500" />
            Góc thảo luận ({comments.length})
          </h3>

          <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-orange-800 uppercase">
              {currentUser.charAt(0)}
            </div>
            <div className="flex-grow flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 transition">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Gõ bình luận của cháu vào đây..."
                className="w-full px-4 py-3 outline-none"
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || loading}
                className="bg-orange-50 px-4 text-orange-600 hover:bg-orange-500 hover:text-white transition disabled:opacity-50 disabled:hover:bg-orange-50 disabled:hover:text-orange-600"
              >
                <Send size={20} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-5">
            {comments.length === 0 ? (
              <p className="text-center text-gray-400 italic py-4">
                Chưa có ai bình luận, cháu hãy là người đầu tiên nhé!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600 uppercase">
                    {comment.userName.charAt(0)}
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-gray-800">{comment.userName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                    {comment.userName === currentUser && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-2"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
