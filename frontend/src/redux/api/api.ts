import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User', 'Services', 'Orders', 'Payments', 'Wallet',
    'Transactions', 'Tickets', 'Notifications', 'Categories',
    'Agents', 'Withdrawals', 'Earnings', 'Reports',
    'Tenants', 'Subscription', 'Invoices', 'KYC', 'TwoFactor',
    'Referrals', 'ApiKeys', 'Webhooks', 'ActivityLogs',
    'FraudAlerts', 'Analytics', 'Exports', 'Templates',
    'Chat', 'Insights',
  ],
  endpoints: () => ({}),
})
