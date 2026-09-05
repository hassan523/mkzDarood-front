import { StyleSheet, View, TextInput, NativeSyntheticEvent, Text, TouchableOpacity, ScrollView } from 'react-native';

import React, { useEffect, useRef, useState } from 'react';

import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';

import Fontisto from 'react-native-vector-icons/Fontisto';
import BottomSheet from '@gorhom/bottom-sheet';

import { useForgotPasswordHandler, useVerifyOTPHandler } from '../../../model/Auth/AuthModel';

import useKeyboardStatus from '../../../utils/IsKeyboardStatus/useKeyboardStatus';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { finishOtpCooldown, startOtpResendTimer } from '../../../redux/Features/timerState';
import { formatTime } from '../../../utils/FormatTime/FormatTime';

const Otp = ({
     route,
     navigation,
}: {
     route: {
          params: {
               type: string;
               email: string;
               data: {
                    username: string;
                    email: string;
                    phone: string;
                    password: string;
                    deviceId: string;
               };
          };
     };

     navigation: Navigation;
}) => {
     const { type, email, data } = route.params;

     const { username, phone, password, deviceId, email: signupEmail } = data || {};

     /* -------------------------------------------------
        Local States
     ------------------------------------------------- */

     const [visible, setVisible] = useState(false);

     const [isOpen, setIsOpen] = useState(false);

     const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);

     const [remaining, setRemaining] = useState(0);

     /* -------------------------------------------------
        Redux
     ------------------------------------------------- */

     const dispatch = useDispatch();

     const { otpTimerEnd } = useSelector((state: RootState) => state.resendOtpTimer);
     /* -------------------------------------------------
        Refs
     ------------------------------------------------- */

     const inputs = useRef<(TextInput | null)[]>(Array(6).fill(null));

     const bottomSheetRef = useRef<BottomSheet>(null);

     /* -------------------------------------------------
        Handlers
     ------------------------------------------------- */

     const handleOpenSheet = () => {
          setIsOpen(true);

          bottomSheetRef.current?.expand();
     };

     const handleChangeCode = (text: string, index: number) => {
          const updatedCode = [...verificationCode];

          updatedCode[index] = text;

          setVerificationCode(updatedCode);

          if (text && index < inputs.current.length - 1) {
               inputs.current[index + 1]?.focus();
          } else if (!text && index > 0) {
               inputs.current[index - 1]?.focus();
          }
     };

     const handleKeyPress = (e: NativeSyntheticEvent<{ key: string }>, index: number) => {
          const updatedCode = [...verificationCode];

          if (e.nativeEvent.key === 'Backspace') {
               if (updatedCode[index] === '' && index > 0) {
                    inputs.current[index - 1]?.focus();
               } else {
                    updatedCode[index] = '';

                    setVerificationCode(updatedCode);
               }
          }
     };

     /* -------------------------------------------------
        API Hooks
     ------------------------------------------------- */

     const { handleVerifyOTP, isLoading, status } = useVerifyOTPHandler();

     const { handleForgotPassword, isLoading: resendLoading } = useForgotPasswordHandler();

     /* -------------------------------------------------
        Verify OTP
     ------------------------------------------------- */

     const handleForgot = async () => {
          await handleVerifyOTP({
               identifier: type === 'signup' ? data?.email : email,

               otp: verificationCode.join(''),

               type: type === 'signup' ? 'signup' : 'otp',

               username,
               phone,
               password,
               deviceId,

               email: signupEmail || email,
          });

          handleOpenSheet();
     };

     /* -------------------------------------------------
        Loading Screen
     ------------------------------------------------- */

     useEffect(() => {
          if (type === 'signup' && (isLoading || String(status) === 'pending')) {
               setVisible(true);
          }
     }, [isLoading, status, type]);

     /* -------------------------------------------------
        Keyboard
     ------------------------------------------------- */

     const isKeyboardVisible = useKeyboardStatus();

     /* -------------------------------------------------
        OTP Timer
     ------------------------------------------------- */

     useEffect(() => {
          if (!otpTimerEnd) {
               setRemaining(0);

               return;
          }

          const updateTimer = () => {
               const secondsLeft = Math.max(0, Math.ceil((otpTimerEnd - Date.now()) / 1000));

               setRemaining(secondsLeft);

               if (secondsLeft === 0) {
                    dispatch(finishOtpCooldown());
               }
          };

          updateTimer();

          const timer = setInterval(updateTimer, 1000);

          return () => clearInterval(timer);
     }, [otpTimerEnd, dispatch]);

     /* -------------------------------------------------
        Resend OTP
     ------------------------------------------------- */

     const handleResendOtp = async () => {
          try {
               const response = await handleForgotPassword({
                    email: signupEmail || email,
                    type: type === 'signup' ? 'signup' : 'otp',
               });

               if ((response as any) !== false) {
                    dispatch(startOtpResendTimer());
               }
          } catch (error) {
               console.error('Resend OTP Error:', error);
          }
     };

     /* -------------------------------------------------
        UI
     ------------------------------------------------- */

     return (
          <>
               {!visible && (
                    <AuthLayout heading="Verification" isBack onBack={() => navigation.goBack()}>
                         <ScrollView
                              contentContainerStyle={[
                                   styles.Container,
                                   {
                                        paddingBottom: isKeyboardVisible ? 500 : 200,
                                   },
                              ]}
                              showsVerticalScrollIndicator={false}
                         >
                              {/* ---------------- Icon ---------------- */}

                              <View style={styles.IconContainer}>
                                   <View style={styles.IconSecContainer}>
                                        <Fontisto name="locked" size={40} color={colors.SecondaryColor} />
                                   </View>
                              </View>

                              {/* ---------------- Heading ---------------- */}

                              <View style={styles.HeadingContainer}>
                                   <Text style={styles.Heading}>Verification Code</Text>

                                   <View style={styles.InnerText}>
                                        <Text style={styles.Description}>We have sent the code to</Text>

                                        <Text style={styles.Description}>{signupEmail || email || ''}</Text>
                                   </View>
                              </View>

                              {/* ---------------- OTP Inputs ---------------- */}

                              <View style={styles.codeContainer}>
                                   {[0, 1, 2, 3, 4, 5].map(index => (
                                        <TextInput
                                             ref={ref => {
                                                  inputs.current[index] = ref;
                                             }}
                                             key={index}
                                             style={styles.codeInput}
                                             value={verificationCode[index]}
                                             onChangeText={text => handleChangeCode(text, index)}
                                             onKeyPress={e => handleKeyPress(e, index)}
                                             keyboardType="number-pad"
                                             maxLength={1}
                                             placeholder="-"
                                             placeholderTextColor="black"
                                             returnKeyType={index === 5 ? 'done' : 'next'}
                                             onSubmitEditing={() => {
                                                  if (index < 5) {
                                                       inputs.current[index + 1]?.focus();
                                                  }
                                             }}
                                             editable={!isLoading && !resendLoading}
                                        />
                                   ))}
                              </View>

                              {/* ---------------- Button ---------------- */}

                              <View style={styles.BtnContainer}>
                                   <Button name="Submit" onPress={handleForgot} isLoading={isLoading} disabled={resendLoading} />

                                   {/* ---------------- Resend ---------------- */}

                                   <View style={styles.ResendContainer}>
                                        {remaining > 0 ? (
                                             <Text style={styles.ResendTimer}>Resend code in {formatTime(remaining)}</Text>
                                        ) : (
                                             <>
                                                  <Text style={styles.ResendTimer}>Didn’t receive the code?</Text>

                                                  <TouchableOpacity onPress={handleResendOtp} disabled={resendLoading}>
                                                       <Text style={styles.ResendButton}>{resendLoading ? 'Loading...' : 'Resend'}</Text>
                                                  </TouchableOpacity>
                                             </>
                                        )}
                                   </View>

                                   {/* Optional debug */}

                                   {/* 
                                   <Text>
                                        Resend attempts: {resendCount}
                                   </Text>
                                   */}
                              </View>
                         </ScrollView>
                    </AuthLayout>
               )}

               {/* -------------------------------------------------
                   Signup Loading Screen
               ------------------------------------------------- */}

               {status !== 'uninitialized' && visible && type === 'signup' && (
                    <LoadingScreen
                         status={status}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/LoadingLogo.png')}
                         loadingTitle="Verifing Account Details"
                         successTitle="All done!"
                         successSubtitle="Account Created Successfully"
                         imageSize={70}
                         errorTitle="Something went wrong"
                         errorSubtitle="Check your otp and try again"
                         hideDelay={1000}
                    />
               )}
          </>
     );
};

export default Otp;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
     Container: {
          alignItems: 'center',

          width: '100%',

          paddingHorizontal: 20,

          gap: 25,

          marginTop: 125,

          backgroundColor: 'white',
     },

     codeContainer: {
          flexDirection: 'row',

          justifyContent: 'space-between',

          marginBottom: 15,

          gap: 5,
     },

     codeInput: {
          borderRadius: 10,

          padding: 5,

          width: 50,

          height: 50,

          textAlign: 'center',

          backgroundColor: 'white',

          color: colors.textColor,

          borderWidth: 1,

          borderColor: colors.textColor,

          fontFamily: Font.font700,

          fontSize: 20,
     },

     IconContainer: {
          height: 150,

          width: 150,

          borderRadius: 1000,

          backgroundColor: 'rgba(0, 74, 180, 0.16)',

          justifyContent: 'center',

          alignItems: 'center',

          marginBottom: 30,
     },

     IconSecContainer: {
          borderRadius: 1000,

          height: 125,

          width: 125,

          backgroundColor: colors.PrimaryColor,

          justifyContent: 'center',

          alignItems: 'center',
     },

     HeadingContainer: {
          gap: 10,

          width: '100%',

          justifyContent: 'center',

          alignItems: 'center',
     },

     Heading: {
          fontFamily: Font.font600,

          fontSize: 18,

          color: colors.textColor,
     },

     InnerText: {
          alignItems: 'center',
     },

     Description: {
          fontSize: 16,

          fontFamily: Font.font600,

          color: colors.SecTextColor,
     },

     BtnContainer: {
          width: '100%',

          justifyContent: 'center',

          alignItems: 'center',

          gap: 10,
     },

     ResendContainer: {
          flexDirection: 'row',

          gap: 5,

          alignItems: 'center',

          justifyContent: 'center',
     },

     ResendTimer: {
          fontSize: 16,

          fontFamily: Font.font600,

          color: colors.SecTextColor,
     },

     ResendButton: {
          fontSize: 16,

          fontFamily: Font.font700,

          color: colors.PrimaryColor,
     },

     CheckContainer: {
          width: 90,

          height: 90,

          borderRadius: 1000,

          backgroundColor: colors.PrimaryColor,

          justifyContent: 'center',

          alignItems: 'center',

          marginVertical: 20,
     },
});
