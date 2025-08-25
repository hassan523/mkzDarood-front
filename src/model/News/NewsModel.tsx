import ResToast from '../../components/ResToast/ResToast';
import { useGetNewsQuery } from '../../redux/News/newsState';

export const useGetNews = () => {
     try {
          const { data, isLoading, isError, error, refetch } = useGetNewsQuery();

          if (isError) {
               ResToast({ type: 'danger', title: 'Failed to fetch News Update' });
          }
          return { data, isLoading, isError, error, refetch };
     } catch (error) {
          ResToast({ type: 'danger', title: 'Something went wrong while fetching News Update!' });
          return {
               data: undefined,
               isLoading: false,
               isError: true,
               error,
          };
     }
};
