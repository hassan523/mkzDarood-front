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
     }),
});

export const { useUpdateProfileMutation, useGetProfileQuery } = Profile;

export default Profile;
