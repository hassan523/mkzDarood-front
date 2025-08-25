import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetNewsResponse } from './NewsType';

const News = createApi({
     reducerPath: 'News',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     endpoints: builder => ({
          GetNews: builder.query<GetNewsResponse[], void>({
               query: () => ({
                    url: `/api/news/get-news`,
                    method: 'GET',
               }),
          }),
     }),
});

export const { useGetNewsQuery } = News;

export default News;
