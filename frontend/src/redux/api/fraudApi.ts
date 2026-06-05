import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IFraudAlert {
  _id: string
  user: string
  userName: string
  userEmail: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
  resolvedBy?: string
  resolution?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface IFraudStats {
  totalAlerts: number
  openAlerts: number
  criticalAlerts: number
  resolvedAlerts: number
  alertsByType: { type: string; count: number }[]
  alertsBySeverity: { severity: string; count: number }[]
}

export const fraudApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFraudAlerts: builder.query<IApiResponse<IFraudAlert[]>, { page?: number; limit?: number; status?: string; severity?: string; type?: string }>({
      query: (params) => ({
        url: '/fraud/alerts',
        params,
      }),
      providesTags: ['FraudAlerts'],
    }),

    resolveFraudAlert: builder.mutation<IApiResponse<IFraudAlert>, { id: string; status: 'resolved' | 'dismissed' | 'investigating'; resolution?: string }>({
      query: ({ id, status, resolution }) => ({
        url: `/fraud/alerts/${id}/resolve`,
        method: 'PATCH',
        body: { status, resolution },
      }),
      invalidatesTags: ['FraudAlerts'],
    }),

    getFraudStats: builder.query<IApiResponse<IFraudStats>, void>({
      query: () => '/fraud/stats',
      providesTags: ['FraudAlerts'],
    }),
  }),
})

export const {
  useGetFraudAlertsQuery,
  useResolveFraudAlertMutation,
  useGetFraudStatsQuery,
} = fraudApi
