import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IDashboardAnalytics {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalOrders: number
  totalRevenue: number
  revenueToday: number
  averageOrderValue: number
  conversionRate: number
  userGrowth: { date: string; count: number }[]
  revenueOverTime: { date: string; amount: number }[]
  ordersByStatus: { status: string; count: number }[]
  topServices: { service: string; orders: number; revenue: number }[]
}

export interface IUserAnalytics {
  userId: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  ordersByStatus: { status: string; count: number }[]
  spendingOverTime: { date: string; amount: number }[]
  lastLogin: string
  totalLogins: number
}

export interface IAgentAnalytics {
  agentId: string
  totalOrders: number
  completedOrders: number
  completionRate: number
  totalEarnings: number
  averageRating: number
  totalReviews: number
  earningsOverTime: { date: string; amount: number }[]
  performanceByDay: { day: string; orders: number }[]
}

export interface ISystemAnalytics {
  uptime: number
  totalRequests: number
  averageResponseTime: number
  errorRate: number
  activeUsers: number
  concurrentSessions: number
  requestsByEndpoint: { endpoint: string; count: number }[]
  errorsByType: { type: string; count: number }[]
  systemLoad: { time: string; cpu: number; memory: number }[]
}

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<IApiResponse<IDashboardAnalytics>, void>({
      query: () => '/analytics/dashboard',
      providesTags: ['Analytics'],
    }),

    getUserAnalytics: builder.query<IApiResponse<IUserAnalytics>, string>({
      query: (userId) => `/analytics/users/${userId}`,
      providesTags: ['Analytics'],
    }),

    getAgentAnalytics: builder.query<IApiResponse<IAgentAnalytics>, string>({
      query: (agentId) => `/analytics/agents/${agentId}`,
      providesTags: ['Analytics'],
    }),

    getSystemAnalytics: builder.query<IApiResponse<ISystemAnalytics>, void>({
      query: () => '/analytics/system',
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetDashboardAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useGetAgentAnalyticsQuery,
  useGetSystemAnalyticsQuery,
} = analyticsApi
