import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetNewsResponse } from './NewsType';

const News = createApi({
     reducerPath: 'News',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     endpoints: builder => ({
          GetNews: builder.query<GetNewsResponse[], { Token: string | undefined }>({
               query: ({ Token }) => ({
                    url: `/api/news/get-news`,
                    method: 'GET',
                    headers: {
                         Authorization: `Bearer ${Token}`,
                    },
               }),
          }),
     }),
});

export const { useGetNewsQuery } = News;

export default News;
