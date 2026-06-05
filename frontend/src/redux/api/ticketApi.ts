import { api } from './api'
import type { IApiResponse, ITicket } from '@/types'

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<IApiResponse<ITicket[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/tickets',
        params,
      }),
      providesTags: ['Tickets'],
    }),

    getTicket: builder.query<IApiResponse<ITicket>, string>({
      query: (id) => `/tickets/${id}`,
      providesTags: ['Tickets'],
    }),

    createTicket: builder.mutation<IApiResponse<ITicket>, {
      subject: string;
      description: string;
      category: string;
      priority: string;
    }>({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tickets'],
    }),

    sendMessage: builder.mutation<IApiResponse<ITicket>, { ticketId: string; message: string }>({
      query: ({ ticketId, message }) => ({
        url: `/tickets/${ticketId}/messages`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Tickets'],
    }),

    updateTicketStatus: builder.mutation<IApiResponse<ITicket>, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Tickets'],
    }),

    assignTicket: builder.mutation<IApiResponse<ITicket>, { id: string; agentId: string }>({
      query: ({ id, agentId }) => ({
        url: `/tickets/${id}/assign`,
        method: 'PATCH',
        body: { agentId },
      }),
      invalidatesTags: ['Tickets'],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useSendMessageMutation,
  useUpdateTicketStatusMutation,
  useAssignTicketMutation,
} = ticketApi
