import { useGetCounterQuery, useUpdateCounterMutation } from '../../redux/Counter/Counter';
import ResToast from '../../components/ResToast/ResToast';

export const useGetCounterHandler = () => {
     try {
          const { data, isLoading, refetch, isError, error, isFetching } = useGetCounterQuery();

          return { data, isLoading, refetch, isError, error, isFetching };
     } catch (error) {
          ResToast({
               title: 'Something Went Wrong!',
               type: 'danger',
          });
     }
};

export const useUpdateCounterHandler = () => {
     const [updateCounterApi, { isLoading, isSuccess, status, error }] = useUpdateCounterMutation();

     const handleUpdate = async ({
          seq,
          Token,
          setIsOpen,
          setSeq,
          setIsSubmitted,
     }: {
          seq: string | number;
          Token: string | undefined;
          setIsOpen: (arg0: boolean) => void;
          setSeq: (arg0: string | number) => void;
          setIsSubmitted: (arg0: boolean) => void;
     }) => {
          try {
               if (seq == '') {
                    ResToast({
                         title: 'Please Enter Number',
                         type: 'warning',
                    });
                    return;
               }

               const num = Number(seq);
               setIsOpen(false);
               const res = await updateCounterApi({
                    seq: num,
                    Token: Token,
               });
               if (res?.error) {
                    if ((res?.error as any)?.status === 403) {
                         ResToast({
                              title: 'Token expair please try again',
                              type: 'danger',
                         });
                    }

                    ResToast({
                         title: 'Something Went Wrong!',
                         type: 'danger',
                    });
                    return;
               }

               ResToast({
                    title: 'Darood submitted successfully',
                    type: 'success',
               });
               setIsSubmitted(true);
               if (typeof seq == 'number') {
                    setSeq(0);
               } else {
                    setSeq('');
               }
          } catch (error) {
               ResToast({
                    title: 'Something Went Wrong!',
                    type: 'danger',
               });
          }
     };

     return { handleUpdate, isLoading, isSuccess, status, error };
};
