import { api } from './api'
import type { IApiResponse } from '@/types'

export interface ITwoFactorSecret {
  secret: string
  qrCode: string
}

export interface ITwoFactorStatus {
  enabled: boolean
  verified: boolean
  backupCodesRemaining: number
}

export const twoFactorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generateTwoFactorSecret: builder.mutation<IApiResponse<ITwoFactorSecret>, void>({
      query: () => ({
        url: '/2fa/generate',
        method: 'POST',
      }),
      invalidatesTags: ['TwoFactor'],
    }),

    verifyAndEnable2FA: builder.mutation<IApiResponse<null>, { token: string }>({
      query: ({ token }) => ({
        url: '/2fa/enable',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['TwoFactor'],
    }),

    disable2FA: builder.mutation<IApiResponse<null>, { token: string }>({
      query: ({ token }) => ({
        url: '/2fa/disable',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['TwoFactor'],
    }),

    getTwoFactorStatus: builder.query<IApiResponse<ITwoFactorStatus>, void>({
      query: () => '/2fa/status',
      providesTags: ['TwoFactor'],
    }),

    generateBackupCodes: builder.mutation<IApiResponse<{ codes: string[] }>, void>({
      query: () => ({
        url: '/2fa/backup-codes',
        method: 'POST',
      }),
      invalidatesTags: ['TwoFactor'],
    }),

    verifyTwoFactorToken: builder.mutation<IApiResponse<{ valid: boolean }>, { token: string }>({
      query: ({ token }) => ({
        url: '/2fa/verify',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
})

export const {
  useGenerateTwoFactorSecretMutation,
  useVerifyAndEnable2FAMutation,
  useDisable2FAMutation,
  useGetTwoFactorStatusQuery,
  useGenerateBackupCodesMutation,
  useVerifyTwoFactorTokenMutation,
} = twoFactorApi
