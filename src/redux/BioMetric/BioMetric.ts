import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { RegisterBioMetricRequest } from './BioMetricTypes';
import { LoginResponse } from '../Auth/AuthType';

const BioMetric = createApi({
     reducerPath: 'BioMetric',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['registerBioMetric', 'createnonce'],
     endpoints: builder => ({
          registerBioMetric: builder.mutation<{ message: string; enabled: boolean }, Pick<RegisterBioMetricRequest, 'publicKey' | 'deviceId' | 'Token' | 'userId'>>({
               query: ({ publicKey, deviceId, Token, userId }) => ({
                    url: `/api/biometric/register-biometric/${userId}`,
                    method: 'POST',
                    body: { publicKey, deviceId },
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
               invalidatesTags: ['registerBioMetric'],
          }),

          deleteBioMetric: builder.mutation<{ message: string; enabled: boolean }, Pick<RegisterBioMetricRequest, 'Token' | 'userId'>>({
               query: ({ Token, userId }) => ({
                    url: `/api/biometric/delete-biometric/${userId}`,
                    method: 'DELETE',
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
               invalidatesTags: ['registerBioMetric'],
          }),

          createNonce: builder.mutation<{ message: string; nonce: string; expiresIn: string | number }, Pick<RegisterBioMetricRequest, 'deviceId'>>({
               query: ({ deviceId }) => ({
                    url: `/api/biometric/create-nonce`,
                    method: 'POST',
                    body: { deviceId },
               }),
               invalidatesTags: ['createnonce'],
          }),

          verifyUser: builder.mutation<LoginResponse, Pick<RegisterBioMetricRequest, 'deviceId' | 'storedDeviceID' | 'signature' | 'nonce'>>({
               query: ({ deviceId, signature, storedDeviceID, nonce }) => ({
                    url: `/api/biometric/verify-user`,
                    method: 'POST',
                    body: { deviceId, signature, storedDeviceID, nonce },
               }),
               invalidatesTags: ['createnonce'],
          }),
     }),
});

export const { useRegisterBioMetricMutation, useDeleteBioMetricMutation, useCreateNonceMutation, useVerifyUserMutation } = BioMetric;

export default BioMetric;
