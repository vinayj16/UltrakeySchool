import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory'
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogTag'
  }],
  featuredImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  }
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ schoolId: 1 });

export default mongoose.model('Blog', blogSchema);
