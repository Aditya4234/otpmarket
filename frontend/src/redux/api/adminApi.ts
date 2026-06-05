import { api } from './api'
import type { IApiResponse, IUser, INotification, IWithdrawal, IOrder } from '@/types'

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IApiResponse<IUser[]>, { page?: number; limit?: number; role?: string; search?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),

    updateUserStatus: builder.mutation<IApiResponse<IUser>, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['User'],
    }),

    getAgents: builder.query<IApiResponse<IUser[]>, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/admin/agents',
        params,
      }),
      providesTags: ['Agents'],
    }),

    verifyAgent: builder.mutation<IApiResponse<IUser>, { id: string; isVerified: boolean }>({
      query: ({ id, isVerified }) => ({
        url: `/admin/agents/${id}/verify`,
        method: 'PATCH',
        body: { isVerified },
      }),
      invalidatesTags: ['Agents'],
    }),

    getWithdrawals: builder.query<IApiResponse<IWithdrawal[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/admin/withdrawals',
        params,
      }),
      providesTags: ['Withdrawals'],
    }),

    processWithdrawal: builder.mutation<IApiResponse<IWithdrawal>, { id: string; status: string; adminNote?: string }>({
      query: ({ id, status, adminNote }) => ({
        url: `/admin/withdrawals/${id}/process`,
        method: 'PATCH',
        body: { status, adminNote },
      }),
      invalidatesTags: ['Withdrawals', 'Wallet', 'Transactions'],
    }),

    getOrders: builder.query<IApiResponse<IOrder[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),

    getNotifications: builder.query<IApiResponse<INotification[]>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/admin/notifications',
        params,
      }),
      providesTags: ['Notifications'],
    }),

    sendNotification: builder.mutation<IApiResponse<null>, { userId?: string; type: string; title: string; message: string }>({
      query: (body) => ({
        url: '/admin/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    getDashboardStats: builder.query<IApiResponse<{
      totalUsers: number;
      totalAgents: number;
      totalOrders: number;
      totalRevenue: number;
      pendingWithdrawals: number;
      recentOrders: IOrder[];
    }>, void>({
      query: () => '/admin/dashboard',
    }),

    getReports: builder.query<IApiResponse<{
      revenueByMonth: { month: string; revenue: number }[];
      ordersByStatus: { status: string; count: number }[];
      topServices: { service: string; count: number; revenue: number }[];
      userGrowth: { month: string; count: number }[];
    }>, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/reports',
        params,
      }),
      providesTags: ['Reports'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useGetAgentsQuery,
  useVerifyAgentMutation,
  useGetWithdrawalsQuery,
  useProcessWithdrawalMutation,
  useGetOrdersQuery,
  useGetNotificationsQuery,
  useSendNotificationMutation,
  useGetDashboardStatsQuery,
  useGetReportsQuery,
} = adminApi
