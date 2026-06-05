import { api } from './api'
import type { IApiResponse } from '@/types'

export interface ISubscription {
  _id: string
  tenant: string
  plan: string
  billingCycle: 'monthly' | 'yearly'
  status: 'active' | 'canceled' | 'expired' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt?: string
  createdAt: string
  updatedAt: string
}

export interface IInvoice {
  _id: string
  subscription: string
  tenant: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  dueDate: string
  paidAt?: string
  lineItems: { description: string; amount: number }[]
  createdAt: string
  updatedAt: string
}

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<IApiResponse<ISubscription>, void>({
      query: () => '/subscription',
      providesTags: ['Subscription'],
    }),

    createSubscription: builder.mutation<IApiResponse<ISubscription>, { plan: string; billingCycle: 'monthly' | 'yearly' }>({
      query: (body) => ({
        url: '/subscription',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    cancelSubscription: builder.mutation<IApiResponse<ISubscription>, void>({
      query: () => ({
        url: '/subscription/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    getInvoices: builder.query<IApiResponse<IInvoice[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      providesTags: ['Invoices'],
    }),

    generateInvoice: builder.mutation<IApiResponse<IInvoice>, void>({
      query: () => ({
        url: '/invoices/generate',
        method: 'POST',
      }),
      invalidatesTags: ['Invoices'],
    }),
  }),
})

export const {
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useGetInvoicesQuery,
  useGenerateInvoiceMutation,
} = subscriptionApi
