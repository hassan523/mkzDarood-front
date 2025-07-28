import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import BtSheets from '../../../components/BtSheets/BtSheets';
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { authUser } from '../../../redux/Features/authState';
import { useLoginHandler } from '../../../model/Auth/AuthModel';

const Login = ({ navigation }: { navigation: Navigation }) => {
     const dispatch = useDispatch();

     const [data, setData] = useState<{
          email: string;
          password: string;
     }>({
          email: '',
          password: '',
     });
     const { email, password } = data;

     const [forgotEmail, setForgotEmail] = useState<string>('');
     const [isOpen, setIsOpen] = useState(false);

     const bottomSheetRef = useRef<BottomSheet>(null);

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setData({ ...data, [name]: value });
     };

     const handleOpenSheet = () => {
          setIsOpen(true);
          bottomSheetRef.current?.expand();
     };

     const handleCloseSheet = () => {
          setIsOpen(false);
          Keyboard.dismiss();
          bottomSheetRef.current?.close();
     };

     const { handleLogin, isLoading } = useLoginHandler();

     const handleSubmit = () => {
          // dispatch(
          //    authUser({
          //       data: {
          //          username: 'Hasan',
          //          email: 'lorem@gmail.com',
          //          phone: '123456789',
          //          profileImage: '',
          //       },
          //    }),
          // );
          handleLogin({
               deviceId: 'app-device-id',
               identifier: email,
               password,
               navigation: navigation,
          });
          // navigation.navigate('Home');
     };
     return (
          <>
               <AuthLayout>
                    <View style={styles.Container}>
                         <Image source={require('../../../assets/logo.png')} style={styles.Logo} />
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Email or Phone Number</Text>
                              <Field placeHolder="Enter Email or Phone Number" type="email" isIcon value={email} onChange={value => handleData({ name: 'email', value })} disabled={isOpen} />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Password</Text>
                              <Field
                                   placeHolder="Enter Password"
                                   type="password"
                                   isIcon={<Fontisto name="locked" size={20} color={colors.PrimaryColor} />}
                                   value={password}
                                   onChange={value => handleData({ name: 'password', value })}
                                   disabled={isOpen}
                              />
                         </View>
                         <View style={styles.Forget}>
                              <TouchableOpacity onPress={handleOpenSheet} disabled={isOpen}>
                                   <Text style={[styles.Label, { color: colors.PrimaryColor }]}>Forget Password?</Text>
                              </TouchableOpacity>
                         </View>
                         <Button name="Sign in" disabled={isOpen} onPress={handleSubmit} />
                    </View>
                    <View style={styles.BottomLine}>
                         <Text style={styles.BottomText}>Don't have account?</Text>
                         <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                              <Text style={[styles.BottomText, { color: colors.PrimaryColor }]}>Sign Up</Text>
                         </TouchableOpacity>
                    </View>

                    {/* {isOpen && (
          <TouchableOpacity
            style={styles.Overlay}
            activeOpacity={1}
            onPress={handleCloseSheet}
          />
        )} */}
               </AuthLayout>

               <BtSheets ref={bottomSheetRef} onClose={handleCloseSheet}>
                    <Text style={styles.ForgotHeading}>Forgot Password</Text>
                    <Text style={styles.InnerText}>Enter your Email or Phone Number</Text>
                    <View style={[styles.FieldContainer, { marginBottom: 25 }]}>
                         <Text style={styles.Label}>Email or Phone Number</Text>
                         <Field placeHolder="Enter Email or Phone Number" type="email" isIcon value={forgotEmail} onChange={setForgotEmail} />
                    </View>
                    <Button
                         name="Send Code"
                         onPress={() => {
                              navigation.navigate('Otp', { type: 'forgot' });
                         }}
                    />
               </BtSheets>
          </>
     );
};

export default Login;

const styles = StyleSheet.create({
     Container: {
          flex: 1,
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 20,
          gap: 25,
          marginTop: 100,
     },
     FieldContainer: {
          width: '100%',
          gap: 10,
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
     ForgotHeading: {
          fontFamily: Font.font600,
          fontSize: 18,
          color: colors.textColor,
     },
     InnerText: {
          fontFamily: Font.font600,
          fontSize: 16,
          color: colors.SecTextColor,
     },
     Overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
     },
     Logo: {
          marginBottom: 40,
     },
});
