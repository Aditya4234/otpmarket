export const ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const TICKET_CATEGORIES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  ACCOUNT: 'account',
  TECHNICAL: 'technical',
  OTHER: 'other',
} as const

export const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const

export const WITHDRAWAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
} as const

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  PAYMENT: 'payment',
  REFUND: 'refund',
  COMMISSION: 'commission',
  EARNINGS: 'earnings',
} as const

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  TICKET: 'ticket',
  WITHDRAWAL: 'withdrawal',
  SYSTEM: 'system',
  PROMO: 'promo',
} as const
