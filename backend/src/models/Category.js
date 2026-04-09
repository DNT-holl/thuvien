import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '📚',
    },
    order: {
      type: Number,
      default: 0,
    },
    stories: [
      {
        storyId: mongoose.Schema.Types.ObjectId,
        storyTitle: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
