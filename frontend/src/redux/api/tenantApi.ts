import { api } from './api'
import type { IApiResponse } from '@/types'

export interface ITenant {
  _id: string
  name: string
  domain: string
  email: string
  phone: string
  plan: string
  status: 'active' | 'suspended' | 'inactive'
  createdAt: string
  updatedAt: string
}

export const tenantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<IApiResponse<ITenant[]>, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: '/tenants',
        params,
      }),
      providesTags: ['Tenants'],
    }),

    getTenant: builder.query<IApiResponse<ITenant>, string>({
      query: (id) => `/tenants/${id}`,
      providesTags: ['Tenants'],
    }),

    createTenant: builder.mutation<IApiResponse<ITenant>, Partial<ITenant>>({
      query: (body) => ({
        url: '/tenants',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tenants'],
    }),

    updateTenant: builder.mutation<IApiResponse<ITenant>, { id: string; data: Partial<ITenant> }>({
      query: ({ id, data }) => ({
        url: `/tenants/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Tenants'],
    }),

    suspendTenant: builder.mutation<IApiResponse<ITenant>, string>({
      query: (id) => ({
        url: `/tenants/${id}/suspend`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Tenants'],
    }),

    activateTenant: builder.mutation<IApiResponse<ITenant>, string>({
      query: (id) => ({
        url: `/tenants/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Tenants'],
    }),
  }),
})

export const {
  useGetTenantsQuery,
  useGetTenantQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useSuspendTenantMutation,
  useActivateTenantMutation,
} = tenantApi
