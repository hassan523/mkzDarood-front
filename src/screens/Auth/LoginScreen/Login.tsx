import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Button from '../../../components/Button/Button';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = data;

  const handleData = ({ name, value }: { name: string; value: string }) => {
    setData({ ...data, [name]: value });
  };

  return (
    <AuthLayout>
      <View style={styles.Container}>
        <View style={styles.FieldContainer}>
          <Text style={styles.Label}>Email or Phone Number</Text>
          <Field
            placeHolder="Enter Email or Phone Number"
            type="email"
            isIcon
            value={email}
            onChange={value => handleData({ name: 'email', value })}
          />
        </View>
        <View style={styles.FieldContainer}>
          <Text style={styles.Label}>Password</Text>
          <Field
            placeHolder="Enter Password"
            type="password"
            isIcon={
              <Fontisto name="locked" size={20} color={colors.PrimaryColor} />
            }
            value={password}
            onChange={value => handleData({ name: 'password', value })}
          />
        </View>
        <View style={styles.Forget}>
          <TouchableOpacity>
            <Text style={[styles.Label, { color: colors.PrimaryColor }]}>
              Forget Password?
            </Text>
          </TouchableOpacity>
        </View>
        <Button name='Sign in' />
      </View>
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
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
  },
  FieldContainer: {
    width: '100%',
    gap: 1,
  },
  Label: {
    fontFamily: Font.font600,
    fontSize: 16,
    color: colors.textColor,
  },
  Forget: {
    width: '100%',
    alignItems: 'flex-end',
  },
  BottomLine: {
    position: 'absolute',
    bottom: 25,
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
