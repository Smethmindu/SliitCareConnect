import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: { type: String, required: true },
        role: { type: String, enum: ['student', 'counselor'], required: true },
        name: { type: String, required: true },
        avatar: { type: String, default: '' },
      },
    ],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageSenderId: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index for fast lookups
conversationSchema.index({ 'participants.userId': 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
