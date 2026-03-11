import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String
  },
  department: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['core', 'elective', 'language', 'sports', 'arts', 'science', 'commerce'],
    default: 'core'
  },
  credits: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

subjectSchema.index({ schoolId: 1, name: 1 }, { unique: true });
subjectSchema.index({ schoolId: 1, code: 1 }, { unique: true });
subjectSchema.index({ department: 1 });

export default mongoose.model('Subject', subjectSchema);
