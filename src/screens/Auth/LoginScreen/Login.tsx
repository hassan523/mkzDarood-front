import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Font from '../../../utils/fonts/Font';

const Login = () => {
  return (
    <View>
      <Text style={{ fontFamily: Font.font600, marginTop: 60, fontSize: 24 }}>
        Login
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
