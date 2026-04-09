import express from 'express';
import Comment from '../models/Comment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments/:storyId - Lấy bình luận của truyện
router.get('/:storyId', async (req, res) => {
  try {
    const comments = await Comment.find({ storyId: req.params.storyId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/comments - Tạo bình luận
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { storyId, text } = req.body;

    if (!storyId || !text) {
      return res.status(400).json({ message: 'Thiếu thông tin bình luận!' });
    }

    const newComment = new Comment({
      storyId,
      userName: req.user?.username || 'Ẩn danh',
      text,
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: 'Bình luận thành công!', comment: savedComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/comments/:id - Xóa bình luận (Admin or Owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tìm thấy!' });
    }

    if (comment.userName !== req.user?.username && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này!' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa bình luận thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
