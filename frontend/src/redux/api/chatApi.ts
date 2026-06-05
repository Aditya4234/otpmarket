import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IChatMessage {
  _id: string
  chat: string
  sender: string
  senderName: string
  senderRole: string
  message: string
  attachments?: string[]
  createdAt: string
}

export interface IChatSession {
  _id: string
  user: string
  userName: string
  userEmail: string
  agent?: string
  agentName?: string
  status: 'active' | 'waiting' | 'closed'
  rating?: number
  ratingComment?: string
  messages: IChatMessage[]
  createdAt: string
  updatedAt: string
}

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createChatSession: builder.mutation<IApiResponse<IChatSession>, { subject?: string; message?: string }>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),

    sendChatMessage: builder.mutation<IApiResponse<IChatMessage>, { chatId: string; message: string; attachments?: string[] }>({
      query: ({ chatId, message, attachments }) => ({
        url: `/chat/${chatId}/messages`,
        method: 'POST',
        body: { message, attachments },
      }),
      invalidatesTags: ['Chat'],
    }),

    assignChat: builder.mutation<IApiResponse<IChatSession>, { chatId: string; agentId: string }>({
      query: ({ chatId, agentId }) => ({
        url: `/chat/${chatId}/assign`,
        method: 'PATCH',
        body: { agentId },
      }),
      invalidatesTags: ['Chat'],
    }),

    closeChat: builder.mutation<IApiResponse<IChatSession>, string>({
      query: (chatId) => ({
        url: `/chat/${chatId}/close`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Chat'],
    }),

    rateChat: builder.mutation<IApiResponse<IChatSession>, { chatId: string; rating: number; comment?: string }>({
      query: ({ chatId, rating, comment }) => ({
        url: `/chat/${chatId}/rate`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: ['Chat'],
    }),

    getActiveChats: builder.query<IApiResponse<IChatSession[]>, void>({
      query: () => '/chat/active',
      providesTags: ['Chat'],
    }),

    getChatHistory: builder.query<IApiResponse<IChatMessage[]>, void>({
      query: () => '/chat/history',
      providesTags: ['Chat'],
    }),

    listAllChats: builder.query<IApiResponse<IChatSession[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/chat',
        params,
      }),
      providesTags: ['Chat'],
    }),

    getChatById: builder.query<IApiResponse<IChatSession>, string>({
      query: (chatId) => `/chat/${chatId}`,
      providesTags: ['Chat'],
    }),
  }),
})

export const {
  useCreateChatSessionMutation,
  useSendChatMessageMutation,
  useAssignChatMutation,
  useCloseChatMutation,
  useRateChatMutation,
  useGetActiveChatsQuery,
  useGetChatHistoryQuery,
  useListAllChatsQuery,
  useGetChatByIdQuery,
} = chatApi
