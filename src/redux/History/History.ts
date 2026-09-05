import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetHistoryResponse } from './HistoryTypes';
import { URLParams } from '../../utils/URL/URLParams';

const History = createApi({
     reducerPath: 'History',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['getHistory'],
     endpoints: builder => ({
          getHistory: builder.query<GetHistoryResponse, { userId: string; page: number; limit: number; from?: string; to?: string }>({
               query: ({ userId, page, limit, from, to }) => {
                    const base = `/api/history/get-history/${userId}`;
                    const params: Record<string, any> = {
                         page,
                         limit,
                         from: from,
                         to: to,
                    };
                    const url = URLParams(base, params);
                    console.log(url);
                    return {
                         url: url,
                         method: 'GET',
                    };
               },
               providesTags: ['getHistory'],
          }),
          deleteHistory: builder.mutation<GetHistoryResponse, { userId: string; historyId: string }>({
               query: ({ userId, historyId }) => ({
                    url: `/api/history/delete-history/${userId}/${historyId}`,
                    method: 'DELETE',
               }),
               invalidatesTags: ['getHistory'],
          }),
     }),
});

export const { useGetHistoryQuery, useDeleteHistoryMutation } = History;

export default History;
