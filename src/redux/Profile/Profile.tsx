import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { user, User } from '../Auth/AuthType';

const Profile = createApi({
     reducerPath: 'Profile',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['updateProfile'],
     endpoints: builder => ({
          updateProfile: builder.mutation<{ user: User; message: string }, { id: string | undefined; Token: string | undefined; formData: FormData | { oldPassword: string; newPassword: string } }>({
               query: ({ id, Token, formData }) => ({
                    url: `/api/update-profile/${id}`,
                    method: 'PATCH',
                    body: formData,
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
               invalidatesTags: ['updateProfile'],
          }),

          GetProfile: builder.query<{ profile: user; message: string }, { id: string; Token: string }>({
               query: ({ id, Token }) => ({
                    url: `/api/profile/${id}`,
                    method: 'GET',
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
               providesTags: ['updateProfile'],
          }),

          VerifyDeleteProfile: builder.mutation<{ message: string }, { userId: string; Token: string }>({
               query: ({ userId, Token }) => ({
                    url: `/api/${userId}/verify-delete-account`,
                    method: 'POST',
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
          }),

          DeleteProfile: builder.mutation<{ message: string }, { userId: string; Token: string; otp: string }>({
               query: ({ userId, Token, otp }) => ({
                    url: `/api/${userId}/delete-account`,
                    method: 'DELETE',
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
                    body: { otp },
               }),
          }),
     }),
});

export const { useUpdateProfileMutation, useGetProfileQuery, useVerifyDeleteProfileMutation, useDeleteProfileMutation } = Profile;

export default Profile;
