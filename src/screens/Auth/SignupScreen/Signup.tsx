import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';

const Signup = ({ navigation }: { navigation: Navigation }) => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { username, email, password, confirmPassword } = data;

  const handleData = ({ name, value }: { name: string; value: string }) => {
    setData({ ...data, [name]: value });
  };
  return (
    <AuthLayout
      heading="Create Account"
      isBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.Container}>
        <View style={styles.FieldContainer}>
          <Text style={styles.Label}>Usename</Text>
          <Field
            placeHolder="Enter Usename"
            type="text"
            isIcon={
              <FontAwesome5
                name="user-alt"
                size={20}
                color={colors.PrimaryColor}
              />
            }
            value={username}
            onChange={value => handleData({ name: 'username', value })}
          />
        </View>
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
        <View style={styles.FieldContainer}>
          <Text style={styles.Label}>Confirm Password</Text>
          <Field
            placeHolder="Enter Confirm Password"
            type="password"
            isIcon={
              <Fontisto name="locked" size={20} color={colors.PrimaryColor} />
            }
            value={confirmPassword}
            onChange={value => handleData({ name: 'confirmPassword', value })}
          />
        </View>
        <Button
          name="Create Account"
          onPress={() => navigation.navigate('Otp', { type: 'signup' })}
        />
      </View>
      <View style={styles.BottomLine}>
        <Text style={styles.BottomText}>Already have account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.BottomText, { color: colors.PrimaryColor }]}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

export default Signup;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 25,
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
