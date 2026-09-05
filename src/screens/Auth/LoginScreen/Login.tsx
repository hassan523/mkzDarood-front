import { ActivityIndicator, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import BtSheets from '../../../components/BtSheets/BtSheets';
import BottomSheet from '@gorhom/bottom-sheet';
import { useForgotPasswordHandler, useLoginHandler } from '../../../model/Auth/AuthModel';
import useKeyboardStatus from '../../../utils/IsKeyboardStatus/useKeyboardStatus';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import { getDeviceId } from '../../../utils/GetDeviceID/getDeviceInfo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { finishOtpCooldown, startOtpResendTimer } from '../../../redux/Features/timerState';
import LinearGradient from 'react-native-linear-gradient';
import { useCreateNonceHandler, useVerifyUserHandler } from '../../../model/BioMetric/BioMetric';
import ReactNativeBiometrics from 'react-native-biometrics';
import { formatTime } from '../../../utils/FormatTime/FormatTime';

let _deviceId = '';
const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
const Login = ({ navigation }: { navigation: Navigation }) => {
     const dispatch = useDispatch();

     const isFingerPrint = useSelector((state: RootState) => state?.userData?.isFingerEnabled);
     const StoredDeviceID = useSelector((state: RootState) => state?.userData?.deviceId);
     const { otpTimerEnd, resendCount, isOtpCooldown } = useSelector((state: RootState) => state.resendOtpTimer);
     const [remaningTime, setRemainingTime] = useState<string>('00:00');

     console.log(remaningTime);
     useEffect(() => {
          if (!isOtpCooldown) return;

          const interval = setInterval(() => {
               const secondsLeft = otpTimerEnd ? Math.max(0, Math.ceil((otpTimerEnd - Date.now()) / 1000)) : 0;

               console.log({ resendCount, isOtpCooldown, otpTimerEnd: formatTime(Math.max(0, Math.ceil(((otpTimerEnd as any) - Date.now()) / 1000))), page: 'Login - polling' });

               setRemainingTime((formatTime(Math.max(0, Math.ceil(((otpTimerEnd as any) - Date.now()) / 1000))) as any) ?? 0);
               if (secondsLeft === 0) {
                    dispatch(finishOtpCooldown());
               }
          }, 1000);

          return () => clearInterval(interval);
     }, [isOtpCooldown, otpTimerEnd, dispatch, resendCount]);

     const [visible, setVisible] = useState(false);
     const [deviceId, setDeviceId] = useState<string>('');
     const [counter, setCounter] = useState(0);
     const [nonce, setNonce] = useState('');
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
     // const nonceExpiry = new Date(Date.now() + 60 * 1000) ;

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setData({ ...data, [name]: value });
     };

     const handleOpenSheet = () => {
          setIsOpen(true);
          bottomSheetRef.current?.expand();
     };

     const handleCloseSheet = () => {
          if (isOpen) {
               setIsOpen(false);
               Keyboard.dismiss();
               bottomSheetRef.current?.close();
          }
     };

     const handleGetDeviceID = async () => {
          if (deviceId != '') return;
          const id = await getDeviceId();
          _deviceId = id;
          setDeviceId(id);
     };

     useEffect(() => {
          handleGetDeviceID();
     }, []);

     const { handleLogin, isLoading: loginLoading, status: loginStatus } = useLoginHandler();
     const { handleVerifyUser, isLoading: VerifyLoading, status: VerifyStatus } = useVerifyUserHandler();
     const { handleForgotPassword, isLoading: forgotLoading } = useForgotPasswordHandler();
     const { handleCreateNonce, status: nonceStatus } = useCreateNonceHandler();

     const isLoading = loginLoading || VerifyLoading;

     const handleSubmit = async () => {
          await handleLogin({
               deviceId: deviceId,
               identifier: email,
               password,
               navigation: navigation,
          });
     };

     useEffect(() => {
          if (loginStatus == 'pending') setVisible(true);
     }, [loginStatus]);

     useEffect(() => {
          if (VerifyStatus == 'pending') setVisible(true);
     }, [VerifyStatus]);

     const handleForgot = async () => {
          const response = await handleForgotPassword({ email: forgotEmail, type: 'otp' });
          if ((response as any) !== false) {
               dispatch(startOtpResendTimer());
          }
     };

     useEffect(() => {
          let timer: ReturnType<typeof setTimeout>;
          if (counter > 0) {
               timer = setTimeout(() => setCounter(counter - 1), 1000);
          }
          return () => clearTimeout(timer);
     }, [counter]);

     const handleFingerprint = async () => {
          if (isFingerPrint === false) return;
          if (counter <= 0) {
               // biometrics logic yahan
               const CreateNonce = await handleCreateNonce();
               setNonce(CreateNonce?.res.data?.nonce || '');
               if (CreateNonce?.res.data?.message == 'Challenge generated') {
                    setCounter(60);
               }
          }
     };

     const handleVerify = async () => {
          if (nonce === '') return;
          try {
               // Payload: kuch bhi ho sakta hai — userId, timestamp, ya server-sent nonce
               const payload = nonce;

               const { success, signature } = await rnBiometrics.createSignature({
                    promptMessage: 'Verify Fingerprint',
                    cancelButtonText: 'Cancel',
                    payload,
               });

               if (success && signature) {
                    // TODO: Send signature + payload to backend for verification
                    await handleVerifyUser({
                         deviceId,
                         nonce,
                         signature,
                         storedDeviceID: StoredDeviceID,
                    });
               } else {
               }
          } catch (e) {
               console.log(e);
          }
     };

     useEffect(() => {
          if (counter === 0) {
               handleFingerprint();
          }
     }, [counter]);

     useEffect(() => {
          if (counter == 0) {
               setNonce('');
          }
     }, [counter]);

     const isKeyboardVisible = useKeyboardStatus();

     return (
          <>
               {!visible && (
                    <AuthLayout isBack onBack={() => navigation.goBack()}>
                         <ScrollView contentContainerStyle={[styles.Container, { paddingBottom: isKeyboardVisible ? 500 : 200 }]} showsVerticalScrollIndicator={false}>
                              <View style={styles.ContainerWrapper}>
                                   <Image source={require('../../../assets/logo.png')} style={styles.Logo} />
                                   <View style={styles.FieldContainer}>
                                        <Text style={styles.Label}>Email or Phone Number</Text>
                                        <Field
                                             placeHolder="Enter Email or Phone Number"
                                             type="email"
                                             isIcon
                                             value={email}
                                             onChange={value => handleData({ name: 'email', value })}
                                             disabled={isOpen || isLoading}
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
                                             disabled={isOpen || isLoading}
                                        />
                                   </View>
                                   <View style={styles.Forget}>
                                        <TouchableOpacity onPress={handleOpenSheet} disabled={isOpen || isLoading}>
                                             <Text style={[styles.Label, { color: colors.PrimaryColor }]}>Forget Password?</Text>
                                        </TouchableOpacity>
                                   </View>
                                   {/* Replace existing <Button> with this */}
                                   <View style={styles.SignInRow}>
                                        <TouchableOpacity
                                             style={[styles.SignInBtn, (isOpen || isLoading) && { opacity: 0.6 }]}
                                             onPress={handleSubmit}
                                             disabled={isOpen || isLoading}
                                             activeOpacity={0.85}
                                        >
                                             <LinearGradient colors={['#349F92', '#006860']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.SignInGradient}>
                                                  {isLoading ? (
                                                       <ActivityIndicator color="white" size="small" />
                                                  ) : (
                                                       <>
                                                            <Text style={styles.SignInText}>Sign In</Text>
                                                            <MaterialCommunityIcons name="login" size={20} color="white" />
                                                       </>
                                                  )}
                                             </LinearGradient>
                                        </TouchableOpacity>

                                        {isFingerPrint && (
                                             <TouchableOpacity
                                                  style={[styles.FingerprintCircle, (isOpen || isLoading) && { opacity: 0.6 }]}
                                                  onPress={handleVerify}
                                                  disabled={isOpen || isLoading}
                                                  activeOpacity={0.85}
                                             >
                                                  <LinearGradient colors={['#349F92', '#006860']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.FingerprintGradient}>
                                                       <MaterialCommunityIcons name="fingerprint" size={28} color="white" />
                                                  </LinearGradient>
                                             </TouchableOpacity>
                                        )}
                                   </View>
                              </View>
                              <View style={styles.BottomLine}>
                                   <Text style={styles.BottomText}>Don't have account?</Text>
                                   <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={isOpen || isLoading}>
                                        <Text style={[styles.BottomText, { color: colors.PrimaryColor }]}>Sign Up</Text>
                                   </TouchableOpacity>
                              </View>
                         </ScrollView>
                    </AuthLayout>
               )}

               {/* // For Keyboard Loading */}

               {visible && loginStatus !== 'uninitialized' && (
                    <LoadingScreen
                         status={loginStatus}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/LoadingLogo.png')}
                         loadingTitle="Authenticating..."
                         successTitle="All done!"
                         successSubtitle="Welcome back to Mkz Darood"
                         imageSize={70}
                         errorTitle="Login failed"
                         errorSubtitle="Check your credentials and try again"
                         hideDelay={1000}
                    />
               )}

               {/* For Fingerprint Loading */}
               {visible && VerifyStatus !== 'uninitialized' && (
                    <LoadingScreen
                         status={VerifyStatus}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/LoadingLogo.png')}
                         loadingTitle="Authenticating..."
                         successTitle="All done!"
                         successSubtitle="Welcome back to Mkz Darood"
                         imageSize={70}
                         errorTitle="Login failed"
                         errorSubtitle="Check your credentials and try again"
                         hideDelay={1000}
                    />
               )}

               <BtSheets ref={bottomSheetRef} onClose={handleCloseSheet}>
                    <Text style={styles.ForgotHeading}>Forgot Password</Text>
                    <Text style={styles.InnerText}>Enter your Email or Phone Number</Text>
                    <View style={[styles.FieldContainer, { marginBottom: 25 }]}>
                         <Text style={styles.Label}>Email or Phone Number</Text>
                         <Field placeHolder="Enter Email or Phone Number" type="email" isIcon value={forgotEmail} onChange={setForgotEmail} disabled={forgotLoading} />
                    </View>
                    <Button
                         name={remaningTime == '00:00' ? 'Send Code' : 'You are on cooldown ' + remaningTime.toString()}
                         onPress={handleForgot}
                         isLoading={forgotLoading}
                         disabled={remaningTime == '00:00' ? false : true}
                    />
               </BtSheets>
          </>
     );
};

export default Login;

const styles = StyleSheet.create({
     Container: {
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 20,
          gap: 25,
          marginTop: 125,
          backgroundColor: 'white',
     },
     ContainerWrapper: {
          alignItems: 'center',
          width: '100%',
          gap: 25,
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
          paddingBottom: 25,
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
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
     },
     Logo: {
          marginBottom: 40,
          width: '100%',
          height: 170,
          objectFit: 'contain',
     },
     SignInRow: {
          flexDirection: 'row',
          width: '100%',
          gap: 12,
          alignItems: 'center',
     },
     SignInBtn: {
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
     },
     SignInGradient: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
          gap: 8,
     },
     SignInText: {
          color: 'white',
          fontFamily: Font.font600,
          fontSize: 16,
     },
     FingerprintCircle: {
          borderRadius: 12,
          overflow: 'hidden',
     },
     FingerprintGradient: {
          width: 52,
          height: 52,
          alignItems: 'center',
          justifyContent: 'center',
     },
});
