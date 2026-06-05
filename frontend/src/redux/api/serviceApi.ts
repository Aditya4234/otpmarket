import { api } from './api'
import type { IApiResponse, IService, ICategory, IOrder } from '@/types'

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<IApiResponse<IService[]>, { category?: string; search?: string }>({
      query: (params) => ({
        url: '/services',
        params,
      }),
      providesTags: ['Services'],
    }),

    getService: builder.query<IApiResponse<IService>, string>({
      query: (id) => `/services/${id}`,
      providesTags: ['Services'],
    }),

    createService: builder.mutation<IApiResponse<IService>, FormData>({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Services'],
    }),

    updateService: builder.mutation<IApiResponse<IService>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Services'],
    }),

    deleteService: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),

    getCategories: builder.query<IApiResponse<ICategory[]>, void>({
      query: () => '/services/categories',
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<IApiResponse<ICategory>, FormData>({
      query: (body) => ({
        url: '/services/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<IApiResponse<ICategory>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/services/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),

    deleteCategory: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/services/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

    createOrder: builder.mutation<IApiResponse<IOrder>, { serviceId: string; quantity: number }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),

    getOrders: builder.query<IApiResponse<IOrder[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),

    getOrder: builder.query<IApiResponse<IOrder>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),

    cancelOrder: builder.mutation<IApiResponse<IOrder>, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
} = serviceApi
