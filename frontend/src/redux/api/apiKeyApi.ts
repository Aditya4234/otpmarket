import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IApiKey {
  _id: string
  name: string
  key: string
  prefix: string
  scopes: string[]
  status: 'active' | 'revoked'
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export const apiKeyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createApiKey: builder.mutation<IApiResponse<IApiKey>, { name: string; scopes: string[]; expiresAt?: string }>({
      query: (body) => ({
        url: '/api-keys',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ApiKeys'],
    }),

    listApiKeys: builder.query<IApiResponse<IApiKey[]>, void>({
      query: () => '/api-keys',
      providesTags: ['ApiKeys'],
    }),

    updateApiKey: builder.mutation<IApiResponse<IApiKey>, { id: string; data: { name?: string; scopes?: string[] } }>({
      query: ({ id, data }) => ({
        url: `/api-keys/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ApiKeys'],
    }),

    revokeApiKey: builder.mutation<IApiResponse<IApiKey>, string>({
      query: (id) => ({
        url: `/api-keys/${id}/revoke`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ApiKeys'],
    }),
  }),
})

export const {
  useCreateApiKeyMutation,
  useListApiKeysQuery,
  useUpdateApiKeyMutation,
  useRevokeApiKeyMutation,
} = apiKeyApi
