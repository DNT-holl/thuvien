import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/login - Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { password, username } = req.body;

    if (!password || !username) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng nhập!' });
    }

    // Kiểm tra mật khẩu gia đình trong .env
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Mật khẩu sai! Hỏi lại bố/mẹ nhé.' });
    }

    // Tìm hoặc tạo người dùng
    let user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      user = new User({
        username: username.toLowerCase(),
        password: password,
        role: 'viewer',
      });
      await user.save();
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/verify - Xác thực token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ valid: false, message: 'Không có token' });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, message: 'Token hợp lệ' });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token không hợp lệ hoặc hết hạn' });
  }
});

export default router;
