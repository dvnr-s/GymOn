import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type ChatMessageModel = Model<IChatMessage>;

const chatMessageSchema = new Schema<IChatMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient chat queries
chatMessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
chatMessageSchema.index({ receiverId: 1, isRead: 1 });

// Prevent model recompilation in development
const ChatMessage: ChatMessageModel =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessage;
