import { useDispatch, useSelector } from 'react-redux';
import ResToast from '../../components/ResToast/ResToast';
import { useCreateNonceMutation, useDeleteBioMetricMutation, useRegisterBioMetricMutation, useVerifyUserMutation } from '../../redux/BioMetric/BioMetric';
import { RootState } from '../../redux/store';
import { RegisterBioMetricRequest } from '../../redux/BioMetric/BioMetricTypes';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { authUser } from '../../redux/Features/authState';

export const useRegisterBioMetricHandler = () => {
     const [RegisterBioMetricrApi, { isLoading, isSuccess, status, error }] = useRegisterBioMetricMutation();
     const selector = useSelector((state: RootState) => state?.userData);
     const Token: string | undefined = selector?.data?.accessToken ?? '';
     const RefreshToken: string | undefined = selector?.data?.refreshToken;
     const DeviceId = ((selector?.data?.user as any)?.refreshTokens as [{ token: string; deviceId: string; _id: string }])?.filter(item => item.token == RefreshToken)[0] ?? '';
     const id = selector?.data?.user?._id ?? '';

     const handleRegisterBioMetric = async ({ publicKey }: { publicKey: string }) => {
          try {
               if (publicKey == '') {
                    ResToast({ title: 'Something Went Wrong!', type: 'danger' });
                    return;
               }

               const res = await RegisterBioMetricrApi({ deviceId: DeviceId.deviceId, publicKey, Token, userId: id });
               console.log(res);
               if (res?.error) {
                    return ResToast({ title: 'Something Went Wrong!', type: 'danger' });
               }
               ResToast({ title: 'Biometric Verification Save successfully', type: 'success' });
               return { res };
          } catch (error) {
               ResToast({ title: 'Something Went Wrong!', type: 'danger' });
          }
     };

     return { handleRegisterBioMetric, isLoading, isSuccess, status, error };
};

export const useCreateNonceHandler = () => {
     const [CreateNonceAPI, { isLoading, isSuccess, status, error }] = useCreateNonceMutation();

     const storedDeviceID = useSelector((state: RootState) => state?.userData?.deviceId);

     const handleCreateNonce = async () => {
          try {
               const res = await CreateNonceAPI({ deviceId: storedDeviceID });
               console.log(res);
               return { res };
          } catch (error) {
               ResToast({ title: 'Something Went Wrong!', type: 'danger' });
          }
     };

     return { handleCreateNonce, isLoading, isSuccess, status, error };
};

export const useVerifyUserHandler = () => {
     const dispatch = useDispatch();
     const [VerifyUserAPI, { isLoading, isSuccess, status, error }] = useVerifyUserMutation();

     type RootStackParamList = {
          Home: undefined;
     };
     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleVerifyUser = async ({ deviceId, nonce, signature, storedDeviceID }: Pick<RegisterBioMetricRequest, 'deviceId' | 'storedDeviceID' | 'signature' | 'nonce'>) => {
          try {
               const res = await VerifyUserAPI({ storedDeviceID, deviceId, nonce, signature });
               console.log(res);

               if (res?.data?.user?.role !== 'User') {
                    return ResToast({
                         title: 'Unauthorized access.',
                         type: 'danger',
                    });
               }

               if (!res.error) {
                    setTimeout(() => {
                         dispatch(authUser({ data: res.data }));
                         ResToast({
                              title: 'Login successful!',
                              type: 'success',
                         });
                         navigation.navigate('Home');
                    }, 1000);
               } else {
                    ResToast({
                         title: (res.error as any).data.message || 'Login failed.',
                         type: 'danger',
                    });
               }

               return { res };
          } catch (error) {
               ResToast({ title: 'Something Went Wrong!', type: 'danger' });
          }
     };

     return { handleVerifyUser, isLoading, isSuccess, status, error };
};

export const useDeleteBioMetricHandler = () => {
     const [DeleteBioMetricApi, { isLoading, isSuccess, status, error }] = useDeleteBioMetricMutation();

     const selector = useSelector((state: RootState) => state?.userData);
     const Token: string | undefined = selector?.data?.accessToken ?? '';
     const id = selector?.data?.user?._id ?? '';

     const handleDeleteBioMetric = async () => {
          try {
               const res = await DeleteBioMetricApi({ Token, userId: id });
               console.log(res);
               if (res?.error) {
                    return ResToast({ title: 'Something Went Wrong!', type: 'danger' });
               }
               ResToast({ title: 'Biometric Verification Save successfully', type: 'success' });
               return { res };
          } catch (error) {
               ResToast({ title: 'Something Went Wrong!', type: 'danger' });
          }
     };

     return { handleDeleteBioMetric, isLoading, isSuccess, status, error };
};
