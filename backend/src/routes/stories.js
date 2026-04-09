import express from 'express';
import Story from '../models/Story.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stories - Lấy danh sách tất cả truyện (Public)
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ isPublished: true })
      .select('id title author cover reactions comments createdAt');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stories/:id - Lấy chi tiết một truyện (Public)
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Truyện không tìm thấy!' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/stories - Tạo truyện mới (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, author, cover, content, audioLink, pdfLink, category, description } = req.body;

    if (!title || !author || !cover) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
    }

    const newStory = new Story({
      title,
      author,
      cover,
      content: content || '',
      audioLink: audioLink || '',
      pdfLink: pdfLink || '',
      category: category || 'khác',
      description: description || '',
    });

    const savedStory = await newStory.save();
    res.status(201).json({ message: 'Tạo truyện thành công!', story: savedStory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/stories/:id - Cập nhật truyện (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ message: 'Truyện không tìm thấy!' });
    }
    res.json({ message: 'Cập nhật truyện thành công!', story: updatedStory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/stories/:id - Xóa truyện (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa truyện thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/stories/:id/react - Thêm reaction
router.put('/:id/react', authenticateToken, async (req, res) => {
  try {
    const { type } = req.body;
    if (!['like', 'heart', 'smile'].includes(type)) {
      return res.status(400).json({ message: 'Loại reaction không hợp lệ!' });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ message: 'Truyện không tìm thấy!' });
    }

    res.json({ message: 'Thêm cảm xúc thành công!', reactions: story.reactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/stories/:id/unreact - Hủy reaction
router.put('/:id/unreact', authenticateToken, async (req, res) => {
  try {
    const { type } = req.body;
    if (!['like', 'heart', 'smile'].includes(type)) {
      return res.status(400).json({ message: 'Loại reaction không hợp lệ!' });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`reactions.${type}`]: -1 } },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ message: 'Truyện không tìm thấy!' });
    }

    res.json({ message: 'Hủy cảm xúc thành công!', reactions: story.reactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
