import { useDispatch, useSelector } from 'react-redux';
import ResToast from '../../components/ResToast/ResToast';
import { authUser, logout } from '../../redux/Features/authState';
import { RootState } from '../../redux/store';
import { useVerifyDeleteProfileMutation, useGetProfileQuery, useUpdateProfileMutation, useDeleteProfileMutation } from '../../redux/Profile/Profile';

export const useUpdateProfile = () => {
     const selector = useSelector((state: RootState) => state?.userData);
     const dispatch = useDispatch();
     const [updateProfile, { isLoading, status }] = useUpdateProfileMutation();

     const handleUpdateProfile = async ({
          id,
          Token,
          profilePicture,
          country,
          city,
          username,
          phone,
          countryCode,
          setIsEdit,
     }: {
          id: string | undefined;
          Token: string | undefined;
          profilePicture: string;
          country?: string;
          city?: string;
          username?: string;
          phone?: string;
          countryCode?: string;
          setIsEdit: (arg0: boolean) => void;
     }) => {
          try {
               const proofImgType = profilePicture?.split('.');
               const imgType = proofImgType.pop();

               const formData = new FormData();
               const imageBlob = {
                    uri: profilePicture,
                    type: `image/${imgType}`,
                    name: `profileImg.${imgType}`,
               } as any;
               formData.append('profilePicture', imageBlob);
               formData.append('country', country);
               formData.append('countryCode', countryCode);
               formData.append('city', city);
               formData.append('username', username);
               formData.append('phone', phone);

               const res = await updateProfile({ id, Token, formData });
               console.log(res, 'dasdsadsadsa');
               if (res?.error) {
                    return ResToast({
                         title: (res.error as any).data.message || 'Failed to Update.',
                         type: 'danger',
                    });
               }

               if (!res?.error) {
                    setIsEdit(false);
                    return ResToast({
                         title: 'profile updated successfuly.',
                         type: 'success',
                    });
               }

               if (Token && selector?.data?.refreshToken && (res as any)?.data?.user) {
                    const newData = {
                         accessToken: Token,
                         refreshToken: selector?.data?.refreshToken,
                         user: (res as any)?.data?.user,
                    };
                    dispatch(authUser({ data: newData }));
               }
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

     return { handleUpdateProfile, handleChangePassword, isLoading, status };
};

export const useVerifyDeleteAccount = () => {
     const selector = useSelector((state: RootState) => state?.userData);
     const [deleteAccount, { isLoading: DeleteLoading, status: DeleteStatus }] = useVerifyDeleteProfileMutation();
     const Token = selector.data?.accessToken || '';
     const userId = selector.data?.user?._id || '';

     const handleVerifyDeleteAccount = async ({ setOTPModal, setDeleteModal }: { setOTPModal: (arg0: boolean) => void; setDeleteModal: (arg0: boolean) => void }) => {
          try {
               const res = await deleteAccount({ userId, Token });
               console.log(res, 'dasdsadsadsa');

               if (res?.error) {
                    return ResToast({
                         title: (res.error as any).data.message || 'Failed to Send Otp.',
                         type: 'danger',
                    });
               }

               if (!res?.error) {
                    setOTPModal(true);
                    setDeleteModal(false);
                    // setTimeout(() => {
                    //      dispatch(logout());
                    // }, 2000);
                    return ResToast({
                         title: 'Otp Sent to your email. Please check and confirm delete account.',
                         type: 'success',
                    });
               }
          } catch (error) {
               ResToast({
                    title: 'Something Went Wrong!',
                    type: 'danger',
               });
          }
     };

     return { handleVerifyDeleteAccount, DeleteLoading, DeleteStatus };
};

export const useDeleteAccount = () => {
     const selector = useSelector((state: RootState) => state?.userData);
     const [deleteAccount, { isLoading: DeleteLoading, status: DeleteStatus }] = useDeleteProfileMutation();
     const Token = selector.data?.accessToken || '';
     const userId = selector.data?.user?._id || '';
     const dispatch = useDispatch();

     const handleDeleteAccount = async (otp: string) => {
          try {
               const res = await deleteAccount({ userId, Token, otp });
               console.log(res, 'dasdsadsadsa');

               if (res?.error) {
                    return ResToast({
                         title: (res.error as any).data.message || 'Failed to delete account.',
                         type: 'danger',
                    });
               }

               if (!res?.error) {
                    setTimeout(() => {
                         dispatch(logout());
                         return ResToast({
                              title: 'Account deleted successfully.',
                              type: 'success',
                         });
                    }, 2000);
               }
          } catch (error) {
               ResToast({
                    title: 'Something Went Wrong!',
                    type: 'danger',
               });
          }
     };

     return { handleDeleteAccount, DeleteLoading, DeleteStatus };
};

export const useProfileData = ({ Token, id }: { Token: string; id: string }) => {
     try {
          const { data, isLoading, refetch, isError, error } = useGetProfileQuery({ id, Token }, { skip: !id });

          return { data, isLoading, refetch, isError, error };
     } catch (error) {
          ResToast({
               title: 'Something Went Wrong!',
               type: 'danger',
          });
     }
};
