import React, { ReactNode, useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle, KeyboardTypeOptions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../utils/colors/colors';
import Font from '../../utils/fonts/Font';

interface FieldProps {
   type?: string;
   disabled?: boolean;
   placeHolder?: string;
   value?: string | number | null;
   onChange?: (text: string) => void;
   isIcon?: ReactNode;
   maxLength?: number;
   placeHolderTextColor?: string;
   customClass?: StyleProp<TextStyle>;
   customDivClass?: StyleProp<ViewStyle>;
   inputWidth?: number;
   divWidth?: number;
   multiline?: boolean;
   iconColor?: string;
   textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
}

const Field: React.FC<FieldProps> = (props) => {
   const { type = 'text', disabled = false, placeHolder = '', value, onChange, isIcon, maxLength, placeHolderTextColor = 'black', customClass, customDivClass, inputWidth = 'auto', divWidth = 'auto', multiline = false, iconColor = 'black', textAlignVertical = 'auto' } = props;

   const [isPass, setIsPass] = useState<boolean>(true);

   const getInputType = (): KeyboardTypeOptions => {
      switch (type) {
         case 'password':
            return 'default';
         case 'email':
            return 'email-address';
         case 'number':
            return 'numeric';
         default:
            return 'default';
      }
   };

   return (
      <>
         {type === 'password' ? (
            <View style={[styles.div, { width: divWidth }, customDivClass]}>
               {isIcon}
               <TextInput style={[styles.input, { width: '79%' }, customClass]} placeholder={placeHolder || 'Password'} placeholderTextColor={placeHolderTextColor} value={value != null ? String(value) : ''} secureTextEntry={isPass} editable={!disabled} maxLength={maxLength} onChangeText={onChange} autoCapitalize="none" />
               <TouchableOpacity onPress={() => setIsPass(!isPass)}>
                  <Icon name={isPass ? 'eye-slash' : 'eye'} size={20} color={colors.PrimaryColor} />
               </TouchableOpacity>
            </View>
         ) : type === 'email' && isIcon ? (
            <View style={[styles.div, { width: divWidth }, customDivClass]}>
               <EmailIcon name="email" size={20} color={colors.PrimaryColor} />
               <TextInput style={[styles.input, { width: '90%' }, customClass]} placeholder={placeHolder || 'Email'} placeholderTextColor={placeHolderTextColor} value={value != null ? String(value) : ''} keyboardType={getInputType()} editable={!disabled} maxLength={maxLength} onChangeText={onChange} autoCapitalize="none" />
            </View>
         ) : isIcon ? (
            <View style={[styles.div, { width: divWidth }, customDivClass]}>
               {isIcon}
               <TextInput style={[styles.input, { width: '90%' }, customClass]} placeholder={placeHolder} placeholderTextColor={placeHolderTextColor} value={value != null ? String(value) : ''} editable={!disabled} maxLength={maxLength} onChangeText={onChange} autoCapitalize="none" keyboardType={getInputType()} />
            </View>
         ) : (
            <TextInput style={[styles.input, { width: inputWidth }, customClass]} placeholder={placeHolder} placeholderTextColor={placeHolderTextColor} value={value != null ? String(value) : ''} keyboardType={getInputType()} editable={!disabled} maxLength={maxLength} onChangeText={onChange} multiline={multiline} textAlignVertical={textAlignVertical} autoCapitalize="none" />
         )}
      </>
   );
};

const styles = StyleSheet.create({
   input: {
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: 'transparent',
      color: colors.textColor,
      fontFamily: Font.font500,
      fontSize: 16,
   },
   div: {
      borderWidth: 0,
      borderRadius: 5,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
});

export default Field;