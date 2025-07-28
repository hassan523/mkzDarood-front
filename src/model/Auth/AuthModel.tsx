import { useDispatch } from 'react-redux';
import { useForgotPasswordMutation, useLoginMutation, useSignupMutation, useVerifyOtpMutation } from '../../redux/Auth/Auth';
import ResToast from '../../components/ResToast/ResToast';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { authUser } from '../../redux/Features/authState';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RegisterResquest } from '../../redux/Auth/AuthType';

export const useLoginHandler = () => {
     const dispatch = useDispatch();
     const [login, { isLoading }] = useLoginMutation();

     type RootStackParamList = {
          Home: undefined;
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleLogin = async (credentials: { identifier: string; password: string; deviceId: string; navigation: Navigation }) => {
          try {
               const { identifier, password } = credentials;

               if (!identifier || !password) {
                    return ResToast({
                         title: 'Please enter both email and password.',
                         type: 'warning',
                    });
               }

               const res = await login({
                    identifier,
                    password,
                    deviceId: credentials.deviceId,
               });
               
               if (!res.error) {
                    dispatch(authUser({ data: res.data }));
                    ResToast({
                         title: 'Login successful!',
                         type: 'success',
                    });
                    navigation.navigate('Home');
               }
          } catch (error) {
               console.error('Login failed:', error);
               throw error;
          }
     };

     return { handleLogin, isLoading };
};

export const useRegisterHandler = () => {
     const registerDispatch = useDispatch();
     const [register, { isLoading }] = useSignupMutation();

     type RootStackParamList = {
          Otp: { type: string };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleRegister = async (credentials: { username: string; email: string; phone: string; password: string; confirmPassword: string; deviceId: string }) => {
          try {
               const { username, email, phone, password, confirmPassword, deviceId } = credentials;

               if (!username || !password || !email || !phone) {
                    return ResToast({
                         title: 'Please fill all fields.',
                         type: 'warning',
                    });
               }

               if (password !== confirmPassword) {
                    return ResToast({
                         title: 'Passwords do not match.',
                         type: 'warning',
                    });
               }

               const res = await register({
                    username,
                    email,
                    phone,
                    password,
                    deviceId,
                    role: 'User',
               });

               if (!res.error) {
                    // registerDispatch(authUser({ data: res?.data || null }));
                    ResToast({
                         title: 'Otp Send successfully',
                         type: 'success',
                    });
                    navigation.navigate('Otp', { type: 'signup' });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleRegister, isLoading };
};

export const useForgotPasswordHandler = () => {
     const dispatch = useDispatch();
     const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

     type RootStackParamList = {
          Otp: { type: string; email: string };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleForgotPassword = async ({ email }: { email: string }) => {
          try {
               if (!email) {
                    return ResToast({
                         title: 'Please enter your email.',
                         type: 'warning',
                    });
               }

               const res = await forgotPassword({ identifier: email });
               if (!res.error) {
                    // registerDispatch(authUser({ data: res?.data || null }));
                    ResToast({
                         title: 'Otp Send successfully',
                         type: 'success',
                    });
                    navigation.navigate('Otp', { type: 'forgot', email });
               } else {
                    ResToast({
                         title: (res.error as any).data.message || 'Failed to send OTP.',
                         type: 'danger',
                    });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleForgotPassword, isLoading };
};

export const useVerifyOTPHandler = () => {
     const dispatch = useDispatch();
     const [verifyOTP, { isLoading }] = useVerifyOtpMutation();

     type RootStackParamList = {
          NewPassword: { identifier: string; otp: string };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleVerifyOTP = async ({ identifier, otp }: { identifier: string; otp: string }) => {
          try {
               if (!identifier || !otp) {
                    return ResToast({
                         title: 'Please enter OTP or refresh.',
                         type: 'warning',
                    });
               }

               const res = await verifyOTP({ identifier, otp });
               if (!res.error) {
                    // registerDispatch(authUser({ data: res?.data || null }));
                    ResToast({
                         title: 'Otp Verified successfully',
                         type: 'success',
                    });
                    navigation.navigate('NewPassword', { identifier, otp });
               } else {
                    ResToast({
                         title: (res.error as any).data.message || 'Failed to send OTP.',
                         type: 'danger',
                    });
               }
          } catch (error) {
               console.error('Verified failed:', error);
               throw error;
          }
     };

     return { handleVerifyOTP, isLoading };
};
