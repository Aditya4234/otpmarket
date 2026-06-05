import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IInsight {
  id: string
  type: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  metric?: string
  value?: number
  change?: number
  recommendation?: string
  timestamp: string
}

export interface IDashboardInsights {
  summary: string
  insights: IInsight[]
  recommendations: string[]
  anomalies: IInsight[]
}

export interface IUserInsights {
  userId: string
  userName: string
  behaviorScore: number
  churnRisk: 'low' | 'medium' | 'high'
  predictedLifetimeValue: number
  nextPurchaseProbability: number
  recommendedActions: string[]
  insights: IInsight[]
}

export interface IAgentInsights {
  agentId: string
  agentName: string
  performanceScore: number
  efficiency: number
  customerSatisfaction: number
  predictedEarnings: number
  areasForImprovement: string[]
  insights: IInsight[]
}

export const aiInsightsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardInsights: builder.query<IApiResponse<IDashboardInsights>, void>({
      query: () => '/insights/dashboard',
      providesTags: ['Insights'],
    }),

    getUserInsights: builder.query<IApiResponse<IUserInsights>, string>({
      query: (userId) => `/insights/users/${userId}`,
      providesTags: ['Insights'],
    }),

    getAgentInsights: builder.query<IApiResponse<IAgentInsights>, string>({
      query: (agentId) => `/insights/agents/${agentId}`,
      providesTags: ['Insights'],
    }),
  }),
})

export const {
  useGetDashboardInsightsQuery,
  useGetUserInsightsQuery,
  useGetAgentInsightsQuery,
} = aiInsightsApi
