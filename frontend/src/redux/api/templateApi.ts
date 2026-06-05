import { api } from './api'
import type { IApiResponse } from '@/types'

export interface ITemplate {
  _id: string
  name: string
  subject: string
  body: string
  category: 'email' | 'sms'
  type: string
  variables: string[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export const templateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query<IApiResponse<ITemplate[]>, { category?: 'email' | 'sms' } | void>({
      query: (params) => ({
        url: '/templates',
        ...(params ? { params } : {}),
      }),
      providesTags: ['Templates'],
    }),

    getTemplate: builder.query<IApiResponse<ITemplate>, string>({
      query: (id) => `/templates/${id}`,
      providesTags: ['Templates'],
    }),

    createTemplate: builder.mutation<IApiResponse<ITemplate>, Partial<ITemplate>>({
      query: (body) => ({
        url: '/templates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Templates'],
    }),

    updateTemplate: builder.mutation<IApiResponse<ITemplate>, { id: string; data: Partial<ITemplate> }>({
      query: ({ id, data }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Templates'],
    }),

    deleteTemplate: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),

    sendTestEmail: builder.mutation<IApiResponse<null>, { id: string; recipientEmail: string }>({
      query: ({ id, recipientEmail }) => ({
        url: `/templates/${id}/test`,
        method: 'POST',
        body: { recipientEmail },
      }),
    }),

    seedDefaultTemplates: builder.mutation<IApiResponse<ITemplate[]>, void>({
      query: () => ({
        url: '/templates/seed',
        method: 'POST',
      }),
      invalidatesTags: ['Templates'],
    }),
  }),
})

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useSendTestEmailMutation,
  useSeedDefaultTemplatesMutation,
} = templateApi
