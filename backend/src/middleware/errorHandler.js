export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Lỗi xác thực', errors: messages });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} đã tồn tại!` });
  }

  // Default Error
  res.status(err.status || 500).json({
    message: err.message || 'Đã xảy ra lỗi trên máy chủ!',
  });
};
