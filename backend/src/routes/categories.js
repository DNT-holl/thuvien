import express from 'express';
import Category from '../models/Category.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - Lấy tất cả categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:id - Lấy chi tiết category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tìm thấy!' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories - Tạo category mới (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tên danh mục bắt buộc!' });
    }

    const newCategory = new Category({
      name,
      description: description || '',
      icon: icon || '📚',
      order: order || 0,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại!' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/categories/:id - Cập nhật category (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tìm thấy!' });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (order !== undefined) category.order = order;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/categories/:id - Xóa category (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tìm thấy!' });
    }
    res.json({ message: 'Danh mục đã xóa!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories/:id/stories - Thêm truyện vào category (Admin only)
router.post('/:id/stories', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { storyIds } = req.body; // Mảng story IDs
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tìm thấy!' });
    }

    if (!Array.isArray(storyIds)) {
      return res.status(400).json({ message: 'storyIds phải là mảng!' });
    }

    // Thêm những story chưa có trong category
    const existingIds = category.stories.map((s) => s.storyId.toString());
    for (const storyId of storyIds) {
      if (!existingIds.includes(storyId.toString())) {
        category.stories.push({ storyId, storyTitle: '' });
      }
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/categories/:id/stories/:storyId - Xóa truyện từ category (Admin only)
router.delete('/:id/stories/:storyId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tìm thấy!' });
    }

    category.stories = category.stories.filter(
      (s) => s.storyId.toString() !== req.params.storyId
    );

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
