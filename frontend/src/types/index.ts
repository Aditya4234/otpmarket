export interface NavLink {
  name: string;
  href: string;
}

export interface Platform {
  name: string;
  color: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  quote: string;
  author: string;
  metric?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  gradient: string;
  borderColor: string;
  icon: React.ReactNode;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'agent' | 'admin';
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IService {
  _id: string;
  name: string;
  description: string;
  category: ICategory | string;
  price: number;
  discountedPrice?: number;
  provider: 'agent' | 'system';
  minQuantity?: number;
  maxQuantity?: number;
  deliveryTime?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  user: IUser | string;
  service: IService | string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  payment?: IPayment | string;
  otpDetails?: {
    number?: string;
    otp?: string;
    status: 'pending' | 'sent' | 'verified' | 'failed';
  };
  agent?: IUser | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  _id: string;
  user: IUser | string;
  order?: IOrder | string;
  amount: number;
  currency: string;
  method: 'razorpay' | 'wallet' | 'cod';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWallet {
  _id: string;
  user: IUser | string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  _id: string;
  wallet: IWallet | string;
  user: IUser | string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'commission' | 'earnings';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWithdrawal {
  _id: string;
  agent: IUser | string;
  amount: number;
  fee: number;
  netAmount: number;
  accountDetails: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    ifscCode: string;
    upiId?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin?: IUser | string;
  adminNote?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITicket {
  _id: string;
  user: IUser | string;
  subject: string;
  description: string;
  category: 'order' | 'payment' | 'account' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: ITicketMessage[];
  assignedTo?: IUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface ITicketMessage {
  _id: string;
  sender: IUser | string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface INotification {
  _id: string;
  user: IUser | string;
  type: 'order' | 'payment' | 'ticket' | 'withdrawal' | 'system' | 'promo';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAgentEarning {
  _id: string;
  agent: IUser | string;
  order: IOrder | string;
  amount: number;
  commission: number;
  netEarning: number;
  status: 'pending' | 'credited';
  createdAt: string;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'agent';
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
}
