import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  cover: {
    type: String, // URL từ Google Drive hoặc Unsplash
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  audioLink: {
    type: String, // URL của file MP3 từ Google Drive
    default: '',
  },
  pdfLink: {
    type: String, // URL của file PDF từ Google Drive
    default: '',
  },
  category: {
    type: String,
    enum: ['truyện cổ tích', 'truyện nước ngoài', 'truyện hiện đại', 'khác'],
    default: 'khác',
  },
  description: String,
  reactions: {
    like: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    smile: { type: Number, default: 0 },
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Story', storySchema);
