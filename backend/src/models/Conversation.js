import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: String,
    name: String,
    joinedAt: { type: Date, default: Date.now }
  }],
  title: String,
  isGroup: { type: Boolean, default: false },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: {
    message: String,
    senderId: mongoose.Schema.Types.ObjectId,
    sentAt: Date
  },
  unreadCount: { type: Map, of: Number, default: {} },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

conversationSchema.index({ schoolId: 1, participants: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model('Conversation', conversationSchema);
