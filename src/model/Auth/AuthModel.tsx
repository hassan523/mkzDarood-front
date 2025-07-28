import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/Auth/Auth';
import { LoginResquest } from '../../redux/Auth/AuthType';
import ResToast from '../../components/ResToast/ResToast';
import Navigation from '../../utils/NavigationProps/NavigationProps';

export const useLoginHandler = () => {
     const dispatch = useDispatch();
     const [login, { isLoading }] = useLoginMutation();

     const handleLogin = async (credentials: { identifier: string; password: string; deviceId: string; navigation: Navigation }) => {
          try {
               const { identifier, password, navigation } = credentials;

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
                    dispatch({
                         type: 'LOGIN_SUCCESS',
                         payload: res.data || {},
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
