import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/Auth/Auth';
import { LoginResponse, LoginResquest } from '../../redux/Auth/AuthType';
import ResToast from '../../components/ResToast/ResToast';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { authUser } from '../../redux/Features/authState';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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
