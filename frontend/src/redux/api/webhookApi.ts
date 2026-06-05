import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IWebhook {
  _id: string
  name: string
  url: string
  events: string[]
  secret: string
  status: 'active' | 'disabled'
  lastTriggeredAt?: string
  lastStatusCode?: number
  createdAt: string
  updatedAt: string
}

export const webhookApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createWebhook: builder.mutation<IApiResponse<IWebhook>, { name: string; url: string; events: string[] }>({
      query: (body) => ({
        url: '/webhooks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Webhooks'],
    }),

    listWebhooks: builder.query<IApiResponse<IWebhook[]>, void>({
      query: () => '/webhooks',
      providesTags: ['Webhooks'],
    }),

    updateWebhook: builder.mutation<IApiResponse<IWebhook>, { id: string; data: Partial<IWebhook> }>({
      query: ({ id, data }) => ({
        url: `/webhooks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Webhooks'],
    }),

    deleteWebhook: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/webhooks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Webhooks'],
    }),

    regenerateWebhookSecret: builder.mutation<IApiResponse<{ secret: string }>, string>({
      query: (id) => ({
        url: `/webhooks/${id}/regenerate-secret`,
        method: 'POST',
      }),
      invalidatesTags: ['Webhooks'],
    }),
  }),
})

export const {
  useCreateWebhookMutation,
  useListWebhooksQuery,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
  useRegenerateWebhookSecretMutation,
} = webhookApi
