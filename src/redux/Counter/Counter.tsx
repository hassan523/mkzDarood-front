import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetCounterResponse, UpdateCounterRequest } from './CounterType';

const Counter = createApi({
     reducerPath: 'Counter',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['counter'],
     endpoints: builder => ({
          getCounter: builder.query<GetCounterResponse, void>({
               query: () => ({
                    url: `/api/counter/get-seq`,
                    method: 'GET',
               }),
               providesTags: ['counter'],
          }),

          updateCounter: builder.mutation<GetCounterResponse, UpdateCounterRequest>({
               query: ({ seq, Token }) => ({
                    url: `/api/counter/update-seq`,
                    method: 'PATCH',
                    body: { seq },
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
               invalidatesTags: ['counter'],
          }),
     }),
});

export const { useGetCounterQuery, useUpdateCounterMutation } = Counter;

export default Counter;
