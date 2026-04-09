import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { initGoogleDrive } from './config/googleDrive.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import commentsRoutes from './routes/comments.js';
import categoriesRoutes from './routes/categories.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/categories', categoriesRoutes);

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date() });
});

// --- ERROR HANDLING ---
app.use(errorHandler);

// --- START SERVER ---
const startServer = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();

    // Kết nối Google Drive (tùy chọn)
    initGoogleDrive();

    // Khởi động server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   📚 Thư Viện Gia Đình Backend         ║
║   ✅ Server started on port ${PORT}      ║
║   🌐 CORS enabled for ${process.env.CLIENT_URL || 'http://localhost:3000'} ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
