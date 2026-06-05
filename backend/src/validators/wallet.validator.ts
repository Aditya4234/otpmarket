import { z } from 'zod';

export const addMoneySchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .min(1, 'Minimum deposit is 1')
    .max(100000, 'Maximum deposit is 100,000'),
});

const bankAccountSchema = z.object({
  accountHolderName: z.string().trim().min(1, 'Account holder name is required'),
  accountNumber: z.string().trim().min(1, 'Account number is required'),
  ifscCode: z.string().trim().min(1, 'IFSC code is required'),
  bankName: z.string().trim().min(1, 'Bank name is required'),
});

const upiDetailsSchema = z.object({
  upiId: z.string().trim().min(1, 'UPI ID is required'),
  holderName: z.string().trim().optional(),
});

const usdtDetailsSchema = z.object({
  walletAddress: z.string().trim().min(1, 'Wallet address is required'),
  network: z.string().trim().min(1, 'Network is required'),
});

const accountDetailsSchema = z.object({
  type: z.enum(['bank', 'upi', 'usdt'], {
    message: 'Account type must be bank, upi, or usdt',
  }),
  bank: bankAccountSchema.optional(),
  upi: upiDetailsSchema.optional(),
  usdt: usdtDetailsSchema.optional(),
}).refine(
  (data) => {
    if (data.type === 'bank' && !data.bank) return false;
    if (data.type === 'upi' && !data.upi) return false;
    if (data.type === 'usdt' && !data.usdt) return false;
    return true;
  },
  { message: 'Account details must match the selected account type', path: ['bank'] }
);

export const withdrawalSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .min(100, 'Minimum withdrawal amount is 100'),
  paymentMethod: z.enum(['bank', 'upi', 'usdt'], {
    message: 'Payment method must be bank, upi, or usdt',
  }),
  accountDetails: accountDetailsSchema,
});

export type AddMoneyInput = z.infer<typeof addMoneySchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
