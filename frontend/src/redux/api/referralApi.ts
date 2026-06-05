import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IReferral {
  _id: string
  referrer: string
  referredUser: string
  referredUserName: string
  referredUserEmail: string
  status: 'pending' | 'completed' | 'expired'
  reward: number
  rewardPaid: boolean
  createdAt: string
  updatedAt: string
}

export interface IReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarned: number
  pendingRewards: number
  referralCode: string
}

export const referralApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generateReferralCode: builder.mutation<IApiResponse<{ code: string }>, void>({
      query: () => ({
        url: '/referrals/code',
        method: 'POST',
      }),
      invalidatesTags: ['Referrals'],
    }),

    getReferralCode: builder.query<IApiResponse<{ code: string }>, void>({
      query: () => '/referrals/code',
      providesTags: ['Referrals'],
    }),

    getReferralStats: builder.query<IApiResponse<IReferralStats>, void>({
      query: () => '/referrals/stats',
      providesTags: ['Referrals'],
    }),

    listReferrals: builder.query<IApiResponse<IReferral[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/referrals',
        params,
      }),
      providesTags: ['Referrals'],
    }),
  }),
})

export const {
  useGenerateReferralCodeMutation,
  useGetReferralCodeQuery,
  useGetReferralStatsQuery,
  useListReferralsQuery,
} = referralApi
