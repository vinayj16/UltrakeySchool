import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Parent', 'Teacher', 'Student', 'Admin'],
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
testimonialSchema.index({ author: 1 });
testimonialSchema.index({ role: 1 });
testimonialSchema.index({ isActive: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
