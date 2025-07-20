import React, { JSX } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Auth/LoginScreen/Login';
import Signup from '../screens/Auth/SignupScreen/Signup';

interface AuthNavigation {
  initRoute: string;
}

const AuthNavigation = ({ initRoute }: AuthNavigation): JSX.Element => {
  const Stack = createNativeStackNavigator();
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
