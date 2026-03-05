import mongoose from 'mongoose';

const approvalWorkflowSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
}, { _id: false });

const metadataSchema = new mongoose.Schema({
  academicYear: String,
  department: String,
  grade: String,
  subject: String
}, { _id: false });

const academicReasonSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['teacher', 'student', 'staff', 'parent', 'admin'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['academic', 'personal', 'medical', 'administrative', 'disciplinary', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvalWorkflow: [approvalWorkflowSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'deprecated'],
    default: 'active'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  tags: [{
    type: String
  }],
  metadata: metadataSchema,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
academicReasonSchema.index({ schoolId: 1, role: 1 });
academicReasonSchema.index({ schoolId: 1, category: 1 });
academicReasonSchema.index({ schoolId: 1, status: 1 });
academicReasonSchema.index({ reason: 'text', description: 'text' });

// Virtual for incrementing usage
academicReasonSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  await this.save();
};

academicReasonSchema.set('toJSON', { virtuals: true });
academicReasonSchema.set('toObject', { virtuals: true });

export default mongoose.model('AcademicReason', academicReasonSchema);
