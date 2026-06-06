import { api } from './api'
import type { IApiResponse, IUser } from '@/types'

interface IUpdateProfileInput {
  name?: string
  phone?: string
}

interface IChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<IApiResponse<{ user: IUser }>, IUpdateProfileInput>({
      query: (body) => ({
        url: '/user/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<IApiResponse<null>, IChangePasswordInput>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi
