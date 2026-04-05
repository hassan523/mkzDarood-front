import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import { useNewPasswordHandler } from '../../../model/Auth/AuthModel';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import ResToast from '../../../components/ResToast/ResToast';

const NewPassword = ({ navigation, route }: { navigation: Navigation; route: any }) => {
     const [isPasswordValid, setIsPasswordValid] = useState(false);
     const [visible, setVisible] = useState(false);
     const [data, setData] = useState<{ newPassword: string; reNewPassword: string }>({ newPassword: '', reNewPassword: '' });
     const { newPassword, reNewPassword } = data;

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setData({ ...data, [name]: value });
     };

     const { identifier, otp } = route.params;

     const { handleNewPassword, isLoading, status } = useNewPasswordHandler();

     const handleSubmit = () => {
          if (!isPasswordValid)
               return ResToast({
                    title: 'Invalid Password.',
                    type: 'danger',
               });

          handleNewPassword({
               email: identifier,
               otp,
               newPassword,
               reNewPassword,
          });
     };

     useEffect(() => {
          if (isLoading || (status as string) == 'pending') setVisible(true);
     }, [isLoading]);

     return (
          <>
               {!visible && (
                    <AuthLayout heading="Setup New Password">
                         <View style={styles.Container}>
                              <View style={styles.IconContainer}>
                                   <Fontisto name="key" size={40} color={colors.SecondaryColor} />
                              </View>
                              <View style={styles.FieldContainer}>
                                   <Text style={styles.Label}>New Password</Text>
                                   <Field
                                        placeHolder="Enter New Password"
                                        type="password"
                                        isIcon={<Fontisto name="locked" size={20} color={colors.PrimaryColor} />}
                                        value={newPassword}
                                        onChange={value => handleData({ name: 'newPassword', value })}
                                        disabled={isLoading}
                                        validate
                                        onValidationChange={isValid => setIsPasswordValid(isValid)}
                                   />
                              </View>
                              <View style={styles.FieldContainer}>
                                   <Text style={styles.Label}>Password</Text>
                                   <Field
                                        placeHolder="Re-Enter New Password"
                                        type="password"
                                        isIcon={<Fontisto name="locked" size={20} color={colors.PrimaryColor} />}
                                        value={reNewPassword}
                                        onChange={value => handleData({ name: 'reNewPassword', value })}
                                        disabled={isLoading}
                                   />
                              </View>
                              <Button name="Submit" onPress={handleSubmit} isLoading={isLoading} />
                         </View>
                    </AuthLayout>
               )}
               {status != 'uninitialized' && visible && (
                    <LoadingScreen
                         status={status}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/Allah.png')} // apni image yahan
                         loadingTitle="Authenticating..."
                         successTitle="All done!"
                         successSubtitle="Welcome back to Mkz Darood"
                         imageSize={40}
                         errorTitle="Login failed"
                         errorSubtitle="Check your credentials and try again"
                         hideDelay={1000}
                    />
               )}
          </>
     );
};

export default NewPassword;

const styles = StyleSheet.create({
     Container: {
          flex: 1,
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 20,
          gap: 25,
          marginTop: 125,
     },
     IconContainer: {
          height: 125,
          width: 125,
          borderRadius: 1000,
          backgroundColor: colors.PrimaryColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30,
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
});
