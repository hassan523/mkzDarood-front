import { useDispatch, useSelector } from 'react-redux';
import ResToast from '../../components/ResToast/ResToast'
import { authUser } from '../../redux/Features/authState';
import { RootState } from '../../redux/store';
import { useUpdateProfileMutation } from '../../redux/Profile/Profile';

export const useUpdateProfile = () => {
     const selector = useSelector((state: RootState) => state?.userData);
     const dispatch = useDispatch();
     const [updateProfile, { isLoading }] = useUpdateProfileMutation();

     const handleUpdateProfile = async ({
          id,
          Token,
          profilePicture,
          setIsEdit,
     }: {
          id: string | undefined;
          Token: string | undefined;
          profilePicture: string;
          setIsEdit: (arg0: boolean) => void;
     }) => {
          try {
               if (!profilePicture || profilePicture == '') {
                    ResToast({
                         title: 'Please Add Picture',
                         type: 'warning',
                    });
                    return;
               }
               const formData = new FormData();
               formData.append('profilePicture', profilePicture);

               const res = await updateProfile({ id, Token, formData });

               if (res?.error) {
                    ResToast({
                         title: (res.error as any).data.message || 'Failed to Update.',
                         type: 'danger',
                    });
                    return;
               }

               if (Token && selector?.data?.refreshToken && res?.data?.user) {
                    const newData = {
                         accessToken: Token,
                         refreshToken: selector?.data?.refreshToken,
                         user: res?.data?.user,
                    };
                    dispatch(authUser({ data: newData }));
               }
               setIsEdit(false);
          } catch (error) {
               ResToast({
                    title: 'Something Went Wrong!',
                    type: 'danger',
               });
          }
     };

     const handleChangePassword = async ({
          id,
          Token,
          oldPassword,
          newPassword,
          reEnter,
          setIsEdit,
     }: {
          id: string | undefined;
          Token: string | undefined;
          oldPassword: string;
          newPassword: string;
          reEnter: string;
          setIsEdit: (arg0: boolean) => void;
     }) => {
          try {
               if (oldPassword == '' || newPassword == '' || reEnter == '') {
                    ResToast({
                         title: 'All Field Required!',
                         type: 'warning',
                    });
                    return;
               }

               if (newPassword != reEnter) {
                    ResToast({
                         title: 'Password does not match',
                         type: 'warning',
                    });
                    return;
               }

               const res = await updateProfile({ id, Token, formData: { oldPassword, newPassword } });

               if (res?.error) {
                    ResToast({
                         title: (res.error as any).data.message || 'Failed to change password.',
                         type: 'danger',
                    });
               }

               if (Token && selector?.data?.refreshToken && res?.data?.user) {
                    const newData = {
                         accessToken: Token,
                         refreshToken: selector?.data?.refreshToken,
                         user: res?.data?.user,
                    };
                    dispatch(authUser({ data: newData }));
               }
               setIsEdit(false);
          } catch (error) {
               ResToast({
                    title: 'Something Went Wrong!',
                    type: 'danger',
               });
          }
     };

     return { handleUpdateProfile, handleChangePassword, isLoading };
};