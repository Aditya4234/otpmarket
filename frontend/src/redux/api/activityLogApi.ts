import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IActivityLog {
  _id: string
  user: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details?: string
  ip?: string
  userAgent?: string
  createdAt: string
}

export interface IUserActivitySummary {
  userId: string
  totalActions: number
  lastActive: string
  actionsByType: { action: string; count: number }[]
}

export const activityLogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<IApiResponse<IActivityLog[]>, { page?: number; limit?: number; userId?: string; action?: string; resource?: string; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/activity-logs',
        params,
      }),
      providesTags: ['ActivityLogs'],
    }),

    getMyActivityLogs: builder.query<IApiResponse<IActivityLog[]>, void>({
      query: () => '/activity-logs/me',
      providesTags: ['ActivityLogs'],
    }),

    getUserActivitySummary: builder.query<IApiResponse<IUserActivitySummary>, string>({
      query: (userId) => `/activity-logs/users/${userId}/summary`,
      providesTags: ['ActivityLogs'],
    }),

    getAuditTrail: builder.query<IApiResponse<IActivityLog[]>, { resource: string; resourceId: string }>({
      query: ({ resource, resourceId }) => ({
        url: `/activity-logs/audit/${resource}/${resourceId}`,
      }),
      providesTags: ['ActivityLogs'],
    }),
  }),
})

export const {
  useGetActivityLogsQuery,
  useGetMyActivityLogsQuery,
  useGetUserActivitySummaryQuery,
  useGetAuditTrailQuery,
} = activityLogApi
