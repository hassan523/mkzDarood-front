import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';

const Login = () => {
  return (
    <AuthLayout>
      <Text>Login</Text>
      <View style={styles.BottomLine}>
        <Text style={styles.BottomText}>Don't have account?</Text>
        <TouchableOpacity>
          <Text style={[styles.BottomText, { color: colors.PrimaryColor }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

export default Login;

const styles = StyleSheet.create({
  BottomLine: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  BottomText: {
    color: colors.textColor,
    fontFamily: Font.font600,
    fontSize: 15,
  },
});
