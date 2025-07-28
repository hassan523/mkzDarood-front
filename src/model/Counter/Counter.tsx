import { useGetCounterQuery } from '../../redux/Counter/Counter';
import ResToast from '../../components/ResToast/ResToast';

export const useGetCounterHandler = () => {
     try {
          const { data, isLoading, refetch, isError, error } = useGetCounterQuery();

          return { data, isLoading, refetch, isError, error };
     } catch (error) {
          ResToast({
               title: 'Something Went Wrong!',
               type: 'danger',
          });
     }
};
