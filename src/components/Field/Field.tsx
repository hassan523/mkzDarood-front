import React, { ReactNode, useState, useCallback } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle, KeyboardTypeOptions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../utils/colors/colors';
import Font from '../../utils/fonts/Font';

// ─── Validation Rules ─────────────────────────────────────────────────────────

type PasswordStrength = 'weak' | 'medium' | 'strong';

const validatePassword = (val: string): { error: string; strength: PasswordStrength } => {
     if (val.length === 0) return { error: '', strength: 'weak' };
     if (val.length < 8) return { error: 'Min 8 characters required', strength: 'weak' };
     const hasUpper = /[A-Z]/.test(val);
     const hasNum = /[0-9]/.test(val);
     const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);
     if (!hasUpper || !hasNum) return { error: 'Add uppercase letter & number', strength: 'medium' };
     if (!hasSpecial) return { error: '', strength: 'medium' };
     return { error: '', strength: 'strong' };
};

const validateNumber = (val: string, minValue?: number, maxValue?: number): string => {
     if (val.length === 0) return '';
     if (Number(val) < 0) return 'Negative numbers not allowed';
     if (minValue !== undefined && Number(val) < minValue) return `Min value is ${minValue}`;
     if (maxValue !== undefined && Number(val) > maxValue) return `Max value is ${maxValue}`;
     return '';
};

const validatePhone = (val: string): string => {
     if (val.length === 0) return '';
     // Spaces, dashes, parentheses strip karo pehle
     const cleaned = val.replace(/[\s\-().]/g, '');
     // E.164 standard — + optional, 7 to 15 digits total (all countries cover)
     const isValid = /^\+?[0-9]\d{6,14}$/.test(cleaned);
     if (!isValid) return 'Enter a valid phone number';
     return '';
};

// ─── Strength Bar ─────────────────────────────────────────────────────────────
const StrengthBar: React.FC<{ strength: PasswordStrength; visible: boolean }> = ({ strength, visible }) => {
     if (!visible) return null;
     const levels = { weak: 1, medium: 2, strong: 3 };
     const levelColors = { weak: '#E53935', medium: '#FB8C00', strong: colors.PrimaryColor };
     const active = levels[strength];
     const color = levelColors[strength];

     return (
          <View style={strengthStyles.row}>
               {[1, 2, 3].map(i => (
                    <View key={i} style={[strengthStyles.bar, { backgroundColor: i <= active ? color : '#E0E0E0' }]} />
               ))}
               <Text style={[strengthStyles.label, { color }]}>{strength.charAt(0).toUpperCase() + strength.slice(1)}</Text>
          </View>
     );
};

const strengthStyles = StyleSheet.create({
     row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5, paddingHorizontal: 2 },
     bar: { flex: 1, height: 3, borderRadius: 2 },
     label: { fontSize: 11, fontWeight: '500', marginLeft: 4, width: 45 },
});

// ─── Props ────────────────────────────────────────────────────────────────────
interface FieldProps {
     type?: 'text' | 'password' | 'email' | 'number' | 'phone';
     disabled?: boolean;
     placeHolder?: string;
     value?: string | number | null;
     onChange?: (text: string) => void;
     isIcon?: ReactNode;
     maxLength?: number;
     placeHolderTextColor?: string;
     customClass?: StyleProp<TextStyle>;
     customDivClass?: StyleProp<ViewStyle>;
     inputWidth?: number | string;
     divWidth?: number | string;
     multiline?: boolean;
     iconColor?: string;
     textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
     onFocus?: () => void;
     onBlur?: () => void;
     minValue?: number;
     maxValue?: number;
     showStrength?: boolean;
     validate?: boolean;
     /** Parent ko batata hai field valid hai ya nahi. true = valid, false = error hai */
     onValidationChange?: (isValid: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const Field: React.FC<FieldProps> = ({
     type = 'text',
     disabled = false,
     placeHolder = '',
     value,
     onChange,
     isIcon,
     maxLength,
     placeHolderTextColor = 'gray',
     customClass,
     customDivClass,
     inputWidth = '100%',
     divWidth = 'auto',
     multiline = false,
     textAlignVertical = 'auto',
     onFocus,
     onBlur,
     iconColor,
     minValue,
     maxValue,
     showStrength = true,
     validate = false,
     onValidationChange,
}) => {
     const [isPass, setIsPass] = useState(true);
     const [error, setError] = useState('');
     const [touched, setTouched] = useState(false);
     const [strength, setStrength] = useState<PasswordStrength>('weak');

     const hasError = touched && error.length > 0;

     // ── Validation handler ──
     const handleChange = useCallback(
          (text: string) => {
               if (type === 'number' && text.includes('-')) return;

               onChange?.(text);

               if (!validate) return;

               let currentError = '';

               if (type === 'password') {
                    const result = validatePassword(text);
                    currentError = result.error;
                    setError(result.error);
                    setStrength(result.strength);
               } else if (type === 'number') {
                    currentError = validateNumber(text, minValue, maxValue);
                    setError(currentError);
               } else if (type === 'phone') {
                    currentError = validatePhone(text);
                    setError(currentError);
               }

               // Parent ko notify karo — error nahi hai to valid
               onValidationChange?.(currentError.length === 0);
          },
          [type, minValue, maxValue, onChange, validate, onValidationChange],
     );

     const handleBlur = useCallback(() => {
          setTouched(true);
          onBlur?.();
     }, [onBlur]);

     const handleFocus = useCallback(() => {
          onFocus?.();
     }, [onFocus]);

     const getKeyboardType = (): KeyboardTypeOptions => {
          switch (type) {
               case 'email':
                    return 'email-address';
               case 'number':
                    return 'numeric';
               case 'phone':
                    return 'phone-pad';
               default:
                    return 'default';
          }
     };

     const stringValue = value != null ? String(value) : '';
     const inputStyle = [styles.input, customClass];
     const divStyle: StyleProp<ViewStyle> = [styles.div, { width: divWidth as number }, hasError && styles.divError, customDivClass];

     const renderInput = () => {
          if (type === 'password') {
               return (
                    <View style={divStyle}>
                         {isIcon}
                         <TextInput
                              style={[inputStyle, { width: '79%', height: 45 }]}
                              placeholder={placeHolder || 'Password'}
                              placeholderTextColor={placeHolderTextColor}
                              value={stringValue}
                              secureTextEntry={isPass}
                              editable={!disabled}
                              maxLength={maxLength}
                              onChangeText={handleChange}
                              autoCapitalize="none"
                              onFocus={handleFocus}
                              onBlur={handleBlur}
                         />
                         <TouchableOpacity onPress={() => setIsPass(p => !p)} disabled={disabled}>
                              <Icon name={isPass ? 'eye-slash' : 'eye'} size={20} color={hasError ? 'red' : iconColor ?? colors.PrimaryColor} />
                         </TouchableOpacity>
                    </View>
               );
          }

          if (type === 'email') {
               return (
                    <View style={divStyle}>
                         <EmailIcon name="email" size={20} color={iconColor ?? colors.PrimaryColor} />
                         <TextInput
                              style={[inputStyle, { width: '90%', height: 45 }]}
                              placeholder={placeHolder || 'Email'}
                              placeholderTextColor={placeHolderTextColor}
                              value={stringValue}
                              keyboardType="email-address"
                              editable={!disabled}
                              maxLength={maxLength}
                              onChangeText={handleChange}
                              autoCapitalize="none"
                              onFocus={handleFocus}
                              onBlur={handleBlur}
                         />
                    </View>
               );
          }

          if (isIcon) {
               return (
                    <View style={divStyle}>
                         {isIcon}
                         <TextInput
                              style={[inputStyle, { width: '90%', height: 45 }]}
                              placeholder={placeHolder}
                              placeholderTextColor={placeHolderTextColor}
                              value={stringValue}
                              keyboardType={getKeyboardType()}
                              editable={!disabled}
                              maxLength={maxLength}
                              onChangeText={handleChange}
                              autoCapitalize="none"
                              onFocus={handleFocus}
                              onBlur={handleBlur}
                         />
                    </View>
               );
          }

          return (
               <TextInput
                    style={[inputStyle, { width: inputWidth as number }, hasError && styles.inputError]}
                    placeholder={placeHolder}
                    placeholderTextColor={placeHolderTextColor}
                    value={stringValue}
                    keyboardType={getKeyboardType()}
                    editable={!disabled}
                    maxLength={maxLength}
                    onChangeText={handleChange}
                    multiline={multiline}
                    textAlignVertical={textAlignVertical}
                    autoCapitalize="none"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
               />
          );
     };

     return (
          <View style={{ width: '100%' }}>
               {renderInput()}
               {validate && type === 'password' && showStrength && stringValue.length > 0 && <StrengthBar strength={strength} visible />}
               {hasError && <Text style={styles.errorText}>{error}</Text>}
          </View>
     );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
     input: {
          borderWidth: 0,
          borderRadius: 5,
          backgroundColor: '#F8F8F8',
          color: colors.textColor,
          fontFamily: Font.font500,
          fontSize: 16,
          paddingHorizontal: 10,
          height: 50,
          textAlignVertical: 'center',
     },
     inputError: {
          borderWidth: 1.2,
          borderColor: '#E53935',
          backgroundColor: '#FFF8F8',
     },
     div: {
          borderWidth: 1.2,
          borderColor: 'transparent',
          borderRadius: 5,
          backgroundColor: '#F8F8F8',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          height: 50,
     },
     divError: {
          borderColor: '#E53935',
          backgroundColor: '#FFF8F8',
     },
     errorText: {
          color: '#E53935',
          fontSize: 11.5,
          fontWeight: '400',
          marginTop: 4,
          marginLeft: 2,
     },
});

export default Field;

// ─── Usage ────────────────────────────────────────────────────────────────────
/*
const [isPasswordValid, setIsPasswordValid] = useState(false);
const [isPhoneValid, setIsPhoneValid] = useState(false);

// Form submit button disable karo jab tak valid nahi
const canSubmit = isPasswordValid && isPhoneValid;

<Field
     type="password"
     value={pass}
     onChange={setPass}
     validate
     onValidationChange={(isValid) => setIsPasswordValid(isValid)}
/>

<Field
     type="phone"
     value={phone}
     onChange={setPhone}
     validate
     onValidationChange={(isValid) => setIsPhoneValid(isValid)}
/>

<Button title="Submit" disabled={!canSubmit} onPress={handleSubmit} />
*/
