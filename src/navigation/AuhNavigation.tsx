import React, { JSX } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Auth/LoginScreen/Login';
import Signup from '../screens/Auth/SignupScreen/Signup';
import Otp from '../screens/Auth/OtpScreen/Otp';
import NewPassword from '../screens/Auth/NewPassword/NewPassword';

interface AuthNavigation {
  initRoute: "Login";
}

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: { type: string };
  NewPassword: undefined;
};

const AuthNavigation = ({ initRoute }: AuthNavigation): JSX.Element => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  const screenOptions = { headerShown: false };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initRoute}
        screenOptions={{ ...screenOptions }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: 'Signup' }}
        />
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{ title: 'Otp' }}
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={{ title: 'NewPassword' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
