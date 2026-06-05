import { api } from './api'
import type { IApiResponse } from '@/types'

export interface IKycSubmission {
  _id: string
  user: string
  status: 'pending' | 'approved' | 'rejected' | 'incomplete'
  documentType: string
  documentNumber?: string
  frontImage?: string
  backImage?: string
  selfieImage?: string
  rejectionReason?: string
  submittedAt: string
  verifiedAt?: string
  verifiedBy?: string
  createdAt: string
  updatedAt: string
}

export interface IKycStatus {
  status: 'pending' | 'approved' | 'rejected' | 'incomplete' | 'not_submitted'
  submission?: IKycSubmission
}

export const kycApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitKyc: builder.mutation<IApiResponse<IKycSubmission>, FormData>({
      query: (body) => ({
        url: '/kyc',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['KYC'],
    }),

    uploadKycDocument: builder.mutation<IApiResponse<IKycSubmission>, { documentType: string; file: File }>({
      query: ({ documentType, file }) => {
        const formData = new FormData()
        formData.append('documentType', documentType)
        formData.append('file', file)
        return {
          url: '/kyc/upload',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['KYC'],
    }),

    getKycStatus: builder.query<IApiResponse<IKycStatus>, void>({
      query: () => '/kyc/status',
      providesTags: ['KYC'],
    }),

    listKycSubmissions: builder.query<IApiResponse<IKycSubmission[]>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/kyc',
        params,
      }),
      providesTags: ['KYC'],
    }),

    verifyKyc: builder.mutation<IApiResponse<IKycSubmission>, { id: string; status: 'approved' | 'rejected'; rejectionReason?: string }>({
      query: ({ id, status, rejectionReason }) => ({
        url: `/kyc/${id}/verify`,
        method: 'PATCH',
        body: { status, rejectionReason },
      }),
      invalidatesTags: ['KYC'],
    }),
  }),
})

export const {
  useSubmitKycMutation,
  useUploadKycDocumentMutation,
  useGetKycStatusQuery,
  useListKycSubmissionsQuery,
  useVerifyKycMutation,
} = kycApi
