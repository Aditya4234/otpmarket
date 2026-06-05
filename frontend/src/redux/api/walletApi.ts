import { api } from './api'
import type {
  IApiResponse, IWallet, ITransaction, IWithdrawal,
} from '@/types'

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<IApiResponse<IWallet>, void>({
      query: () => '/wallet',
      providesTags: ['Wallet'],
    }),

    getTransactions: builder.query<IApiResponse<ITransaction[]>, { page?: number; limit?: number; type?: string }>({
      query: (params) => ({
        url: '/wallet/transactions',
        params,
      }),
      providesTags: ['Transactions'],
    }),

    depositFunds: builder.mutation<IApiResponse<{ orderId: string }>, { amount: number }>({
      query: (body) => ({
        url: '/wallet/deposit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet', 'Transactions'],
    }),

    verifyDeposit: builder.mutation<IApiResponse<IWallet>, { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }>({
      query: (body) => ({
        url: '/wallet/verify-deposit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet', 'Transactions'],
    }),

    requestWithdrawal: builder.mutation<IApiResponse<IWithdrawal>, {
      amount: number;
      accountDetails: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        ifscCode: string;
        upiId?: string;
      };
    }>({
      query: (body) => ({
        url: '/wallet/withdrawals',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Withdrawals', 'Wallet'],
    }),

    getWithdrawals: builder.query<IApiResponse<IWithdrawal[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/wallet/withdrawals',
        params,
      }),
      providesTags: ['Withdrawals'],
    }),

    getEarnings: builder.query<IApiResponse<{ totalEarnings: number; pendingEarnings: number; creditedEarnings: number }>, void>({
      query: () => '/wallet/earnings',
      providesTags: ['Earnings'],
    }),
  }),
})

export const {
  useGetWalletQuery,
  useGetTransactionsQuery,
  useDepositFundsMutation,
  useVerifyDepositMutation,
  useRequestWithdrawalMutation,
  useGetWithdrawalsQuery,
  useGetEarningsQuery,
} = walletApi
