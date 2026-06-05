import { api } from './api'
import type { IApiResponse } from '@/types'

export const exportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    exportOrders: builder.mutation<IApiResponse<{ url: string }>, { format: 'pdf' | 'xlsx'; startDate?: string; endDate?: string; status?: string }>({
      query: (body) => ({
        url: '/exports/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exports'],
    }),

    exportUsers: builder.mutation<IApiResponse<{ url: string }>, { format: 'pdf' | 'xlsx'; role?: string; startDate?: string; endDate?: string }>({
      query: (body) => ({
        url: '/exports/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exports'],
    }),

    exportTransactions: builder.mutation<IApiResponse<{ url: string }>, { format: 'pdf' | 'xlsx'; type?: string; status?: string; startDate?: string; endDate?: string }>({
      query: (body) => ({
        url: '/exports/transactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exports'],
    }),
  }),
})

export const {
  useExportOrdersMutation,
  useExportUsersMutation,
  useExportTransactionsMutation,
} = exportApi
