import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Field from '../../../components/Field/Field';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';

const NewPassword = ({ navigation }: { navigation: Navigation }) => {
     const [data, setData] = useState<{
          newPassword: string;
          reNewPassword: string;
     }>({
          newPassword: '',
          reNewPassword: '',
     });
     const { newPassword, reNewPassword } = data;

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setData({ ...data, [name]: value });
     };
     return (
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
                         />
                    </View>
                    <Button name="Submit" onPress={() => navigation.navigate('Login')} />
               </View>
          </AuthLayout>
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
