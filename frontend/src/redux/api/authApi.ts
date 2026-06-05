import { api } from './api'
import type {
  IApiResponse,
  IAuthResponse,
  ILoginInput,
  IRegisterInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IUser,
} from '@/types'

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IApiResponse<IAuthResponse>, ILoginInput>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    register: builder.mutation<IApiResponse<IAuthResponse>, IRegisterInput>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    forgotPassword: builder.mutation<IApiResponse<null>, IForgotPasswordInput>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<IApiResponse<null>, IResetPasswordInput>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<IApiResponse<{ user: IUser }>, void>({
      query: () => '/auth/me',
    }),

    refreshToken: builder.mutation<IApiResponse<{ accessToken: string }>, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi
