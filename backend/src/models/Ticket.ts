import mongoose, { Document, Schema } from 'mongoose';
import { generateTicketId } from '@/utils/helpers';

export interface ITicketMessage {
  sender: mongoose.Types.ObjectId;
  message: string;
  attachments?: { url: string; name: string }[];
  createdAt: Date;
}

export interface ITicketDocument extends Document {
  ticketId: string;
  user: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'service' | 'general' | 'refund';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments: { url: string; name: string }[];
  assignedTo?: mongoose.Types.ObjectId;
  messages: ITicketMessage[];
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketMessageSchema = new Schema<ITicketMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    attachments: [
      {
        url: { type: String },
        name: { type: String },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ticketSchema = new Schema<ITicketDocument>(
  {
    ticketId: {
      type: String,
      unique: true,
      default: generateTicketId,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'billing', 'service', 'general', 'refund'],
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    attachments: [
      {
        url: { type: String },
        name: { type: String },
      },
    ],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    messages: [ticketMessageSchema],
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model<ITicketDocument>('Ticket', ticketSchema);
export default Ticket;
