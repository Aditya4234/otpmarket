import { Request } from 'express';

export enum UserRole {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  walletId?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet {
  _id: string;
  userId: string | IUser;
  balance: number;
  lockedBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  _id: string;
  walletId: string | IWallet;
  userId: string | IUser;
  type: TransactionType;
  amount: number;
  fee?: number;
  netAmount: number;
  referenceId?: string;
  referenceType?: string;
  description: string;
  status: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  _id: string;
  sellerId: string | IUser;
  categoryId: string | ICategory;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  images: string[];
  requirements?: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  totalReviews: number;
  totalSales: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string | ICategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;
  orderId: string;
  buyerId: string | IUser;
  sellerId: string | IUser;
  serviceId: string | IService;
  amount: number;
  fee: number;
  totalAmount: number;
  status: OrderStatus;
  requirements?: string;
  deliveryFiles?: string[];
  deliveryMessage?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  _id: string;
  paymentId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderId: string | IOrder;
  buyerId: string | IUser;
  sellerId: string | IUser;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  refundId?: string;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicket {
  _id: string;
  ticketId: string;
  userId: string | IUser;
  orderId?: string | IOrder;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  attachments?: string[];
  assignedTo?: string | IUser;
  messages: ITicketMessage[];
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketMessage {
  _id: string;
  senderId: string | IUser;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface INotification {
  _id: string;
  userId: string | IUser;
  title: string;
  message: string;
  type: string;
  referenceId?: string;
  referenceType?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface IWithdrawal {
  _id: string;
  withdrawalId: string;
  userId: string | IUser;
  walletId: string | IWallet;
  amount: number;
  fee: number;
  netAmount: number;
  status: WithdrawalStatus;
  bankAccount?: string;
  upiId?: string;
  processedAt?: Date;
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: 'user' | 'agent' | 'admin';
  };
}
