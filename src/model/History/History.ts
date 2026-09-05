import { useSelector } from 'react-redux';
import ResToast from '../../components/ResToast/ResToast';
import { useDeleteHistoryMutation, useGetHistoryQuery } from '../../redux/History/History';
import { RootState } from '../../redux/store';

export const useGetHistoryHandler = ({ userId, page, limit, from, to }: { userId: string; page: number; limit: number; from: string; to: string }) => {
     try {
          const { data, isLoading, refetch, isError, error, isFetching, status } = useGetHistoryQuery({ userId, page, limit, from, to });

          return { data, isLoading, refetch, isError, error, isFetching, status };
     } catch (error) {
          ResToast({
               title: 'Something Went Wrong!',
               type: 'danger',
          });
     }
};

export const useDeleteHistoryHandler = () => {
     const [deleteHistoryApi, { isLoading, isSuccess, status, error }] = useDeleteHistoryMutation();
     const selector = useSelector((state: RootState) => state?.userData);
     const userId = selector?.data?.user?._id ?? '';

     const handleDeleteHistory = async ({ historyId }: { historyId: string }) => {
          console.log({ userId, historyId });
          try {
               if (historyId == '') {
                    ResToast({ title: 'Invalid History', type: 'warning' });
                    return;
               }

               const res = await deleteHistoryApi({ historyId: historyId, userId: userId });
               console.log(res);
               if (res?.error) {
                    ResToast({ title: 'Something Went Wrong!', type: 'danger' });
                    return;
               }

               ResToast({ title: 'History Deleted successfully', type: 'success' });
          } catch (error) {
               ResToast({ title: 'Something Went Wrong!', type: 'danger' });
          }
     };

     return { handleDeleteHistory, isLoading, isSuccess, status, error };
};
