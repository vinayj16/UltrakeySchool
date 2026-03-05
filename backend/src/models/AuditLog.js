import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'data_export_request',
      'data_export_completed',
      'data_export_failed',
      'data_erasure_request',
      'data_erasure_approved',
      'data_erasure_rejected',
      'data_erasure_completed',
      'data_rectification',
      'privacy_policy_viewed',
      'gdpr_settings_updated',
      'consent_given',
      'consent_withdrawn'
    ]
  },
  entityType: {
    type: String,
    enum: ['user', 'student', 'teacher', 'staff', 'parent', 'admin']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance and compliance
auditLogSchema.index({ institutionId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }); // 1 year retention

export default mongoose.model('AuditLog', auditLogSchema);