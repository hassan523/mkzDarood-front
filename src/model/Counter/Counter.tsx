import { useGetCounterQuery } from '../../redux/Counter/Counter';

export const useGetCounterHandler = () => {
     const getCounter = useGetCounterQuery();
     const counterData = getCounter?.data;
     const isLoading = getCounter?.isLoading;
     const refech = getCounter?.refetch;
     const isError = getCounter?.refetch;
     const error = getCounter?.error;

     return { counterData, isLoading, refech, isError, error };
};
