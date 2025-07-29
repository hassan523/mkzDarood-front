import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import {  User } from '../Auth/AuthType';

const Profile = createApi({
     reducerPath: 'Profile',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['auth'],
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
          }),
     }),
});

export const { useUpdateProfileMutation } = Profile;

export default Profile;
