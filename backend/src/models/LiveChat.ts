import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveChat extends Document {
  tenant?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  department: 'support' | 'sales' | 'billing' | 'technical';
  status: 'waiting' | 'active' | 'resolved' | 'closed' | 'transferred';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  messages: ILiveChatMessage[];
  rating?: number;
  ratingComment?: string;
  tags: string[];
  customFields: Record<string, any>;
  browserInfo?: {
    userAgent: string;
    page: string;
    referrer: string;
  };
  waitTime: number;
  duration: number;
  closedBy?: mongoose.Types.ObjectId;
  closedAt?: Date;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILiveChatMessage {
  sender: mongoose.Types.ObjectId;
  senderType: 'user' | 'agent' | 'admin' | 'system' | 'bot';
  message: string;
  messageType: 'text' | 'image' | 'file' | 'system' | 'typing';
  fileUrl?: string;
  fileType?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const liveChatSchema = new Schema<ILiveChat>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    department: {
      type: String,
      enum: ['support', 'sales', 'billing', 'technical'],
      default: 'support',
    },
    status: {
      type: String,
      enum: ['waiting', 'active', 'resolved', 'closed', 'transferred'],
      default: 'waiting',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    subject: { type: String, default: '' },
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        senderType: {
          type: String,
          enum: ['user', 'agent', 'admin', 'system', 'bot'],
          required: true,
        },
        message: { type: String, required: true },
        messageType: {
          type: String,
          enum: ['text', 'image', 'file', 'system', 'typing'],
          default: 'text',
        },
        fileUrl: { type: String },
        fileType: { type: String },
        isRead: { type: Boolean, default: false },
        readAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rating: { type: Number, min: 1, max: 5 },
    ratingComment: { type: String },
    tags: [{ type: String }],
    customFields: { type: Schema.Types.Mixed, default: {} },
    browserInfo: {
      userAgent: { type: String },
      page: { type: String },
      referrer: { type: String },
    },
    waitTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    closedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    closedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILiveChat>('LiveChat', liveChatSchema);
