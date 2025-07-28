import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { LoginResponse, LoginResquest } from './AuthType';

const Auth = createApi({
     reducerPath: 'Auth',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['auth'],
     endpoints: builder => ({
          login: builder.mutation<LoginResponse, LoginResquest>({
               query: data => {
                    console.log(data, 'data in login query');
                    return {
                         url: `/api/login`,
                         method: 'POST',
                         body: data,
                    };
               },
          }),

          signup: builder.mutation({
               query: data => ({
                    url: `/api/signup`,
                    method: 'POST',
                    body: data,
               }),
          }),
     }),
});

export const { useLoginMutation, useSignupMutation } = Auth;

export default Auth;
