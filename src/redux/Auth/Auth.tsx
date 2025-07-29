import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { LoginResponse, LoginResquest, RegisterResponse, RegisterResquest, User } from './AuthType';

const Auth = createApi({
     reducerPath: 'Auth',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['auth'],
     endpoints: builder => ({
          login: builder.mutation<LoginResponse, LoginResquest>({
               query: data => ({
                    url: `/api/login`,
                    method: 'POST',
                    body: data,
               }),
          }),

          signup: builder.mutation<RegisterResponse, RegisterResquest>({
               query: data => ({
                    url: `/api/register`,
                    method: 'POST',
                    body: data,
               }),
          }),

          forgotPassword: builder.mutation<{ message: string; identifier: string }, { identifier: string }>({
               query: data => ({
                    url: `/api/forget-password`,
                    method: 'PATCH',
                    body: data,
               }),
          }),

          verifyOtp: builder.mutation<
               { message: string; identifier: string },
               { identifier: string; otp: string; type: string; username?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; deviceId?: string }
          >({
               query: data => ({
                    url: `/api/verify-otp`,
                    method: 'PATCH',
                    body: data,
               }),
          }),

          newpassword: builder.mutation<{ message: string; identifier: string }, { identifier: string; otp: string; newPassword: string }>({
               query: data => ({
                    url: `/api/change-password`,
                    method: 'PATCH',
                    body: data,
               }),
          }),

          updateProfile: builder.mutation<{ user: User; message: string }, { id: string | undefined; Token: string | undefined; formData: FormData | { oldPassword: string; newPassword: string } }>({
               query: ({ id, Token, formData }) => ({
                    url: `/api/update-profile/${id}`,
                    method: 'PATCH',
                    body: formData,
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
          }),
     }),
});

export const { useLoginMutation, useSignupMutation, useForgotPasswordMutation, useVerifyOtpMutation, useNewpasswordMutation, useUpdateProfileMutation } = Auth;

export default Auth;
