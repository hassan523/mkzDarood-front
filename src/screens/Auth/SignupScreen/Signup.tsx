import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import { useRegisterHandler } from '../../../model/Auth/AuthModel';
import useKeyboardStatus from '../../../utils/IsKeyboardStatus/useKeyboardStatus';
import ResToast from '../../../components/ResToast/ResToast';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';

const Signup = ({ navigation }: { navigation: Navigation }) => {
     const [isPasswordValid, setIsPasswordValid] = useState(false);
     const [isNumberValid, setIsNumberValid] = useState(false);
     const [visible, setVisible] = useState(false);
     const [data, setData] = useState({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
     });
     const { username, email, phone, password, confirmPassword } = data;
     const [isFocused, setIsFocused] = useState(false);

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setData({ ...data, [name]: value });
     };

     const { handleRegister, isLoading, status } = useRegisterHandler();

     const handleSubmit = () => {
          if (!isPasswordValid)
               return ResToast({
                    title: 'Invalid Password.',
                    type: 'danger',
               });
          if (!isNumberValid)
               return ResToast({
                    title: 'Invalid Phone number.',
                    type: 'danger',
               });
          handleRegister({
               username,
               email,
               phone,
               password,
               confirmPassword,
               deviceId: 'app-device-id',
          });
     };

     console.log(status);

     useEffect(() => {
          if (isLoading || (status as string) == 'pending') setVisible(true);
     }, [isLoading]);

     const isKeyboardVisible = useKeyboardStatus();

     return (
          <AuthLayout heading="Create Account" isBack onBack={() => navigation.goBack()}>
               {!visible && (
                    <ScrollView contentContainerStyle={[styles.Container, { paddingBottom: isKeyboardVisible ? 500 : 200 }]} showsVerticalScrollIndicator={false}>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Name</Text>
                              <Field
                                   placeHolder="Enter Name"
                                   type="text"
                                   isIcon={<FontAwesome5 name="user-alt" size={20} color={colors.PrimaryColor} />}
                                   value={username}
                                   onChange={value => handleData({ name: 'username', value })}
                                   onFocus={() => setIsFocused(true)}
                                   onBlur={() => setIsFocused(false)}
                                   disabled={isLoading}
                                   maxLength={20}
                              />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Email</Text>
                              <Field
                                   placeHolder="Enter Email"
                                   type="email"
                                   isIcon
                                   value={email}
                                   onChange={value => handleData({ name: 'email', value })}
                                   onFocus={() => setIsFocused(true)}
                                   onBlur={() => setIsFocused(false)}
                                   disabled={isLoading}
                                   validate
                              />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Phone Number</Text>
                              <Field
                                   placeHolder="Enter Phone Number"
                                   type="phone"
                                   isIcon={<FontAwesome name="phone" size={20} color={colors.PrimaryColor} />}
                                   value={phone}
                                   onChange={value => handleData({ name: 'phone', value })}
                                   onFocus={() => setIsFocused(true)}
                                   onBlur={() => setIsFocused(false)}
                                   disabled={isLoading}
                                   maxLength={15}
                                   minValue={10}
                                   validate
                                   onValidationChange={isValid => setIsNumberValid(isValid)}
                              />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Password</Text>
                              <Field
                                   placeHolder="Enter Password"
                                   type="password"
                                   isIcon={<Fontisto name="locked" size={20} color={colors.PrimaryColor} />}
                                   value={password}
                                   onChange={value => handleData({ name: 'password', value })}
                                   onFocus={() => setIsFocused(true)}
                                   onBlur={() => setIsFocused(false)}
                                   disabled={isLoading}
                                   validate
                                   onValidationChange={isValid => setIsPasswordValid(isValid)}
                              />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Confirm Password</Text>
                              <Field
                                   placeHolder="Enter Confirm Password"
                                   type="password"
                                   isIcon={<Fontisto name="locked" size={20} color={colors.PrimaryColor} />}
                                   value={confirmPassword}
                                   onChange={value => handleData({ name: 'confirmPassword', value })}
                                   onFocus={() => setIsFocused(true)}
                                   onBlur={() => setIsFocused(false)}
                                   disabled={isLoading}
                              />
                         </View>
                         <Button name="Create Account" onPress={handleSubmit} isLoading={isLoading} />
                         <View style={styles.BottomLine}>
                              <Text style={styles.BottomText}>Already have account?</Text>
                              <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                                   <Text style={[styles.BottomText, { color: colors.PrimaryColor }]}>Login</Text>
                              </TouchableOpacity>
                         </View>
                    </ScrollView>
               )}
               {status != 'uninitialized' && visible && (
                    <LoadingScreen
                         status={status}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/Allah.png')} // apni image yahan
                         loadingTitle="Processing Request"
                         successTitle="All done!"
                         successSubtitle="Please Confirm your OTP"
                         imageSize={40}
                         errorTitle="Account Creation failed"
                         errorSubtitle="Check your internet and try again"
                         hideDelay={1000}
                    />
               )}
          </AuthLayout>
     );
};

export default Signup;

const styles = StyleSheet.create({
     Container: {
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 20,
          gap: 25,
          marginTop: 125,
          backgroundColor: 'white',
     },
     FieldContainer: {
          width: '100%',
          gap: 10,
          backgroundColor: 'white',
     },
     Label: {
          fontFamily: Font.font600,
          fontSize: 16,
          color: colors.textColor,
     },
     BottomLine: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 4,
          paddingTop: 25,
     },
     BottomText: {
          color: colors.textColor,
          fontFamily: Font.font600,
          fontSize: 15,
     },
});
