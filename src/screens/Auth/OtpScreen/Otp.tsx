import {
  StyleSheet,
  View,
  TextInput,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import AuthLayout from '../../../layout/AuthLayout/AuthLayout';
import colors from '../../../utils/colors/colors';
import Button from '../../../components/Button/Button';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import Fontisto from 'react-native-vector-icons/Fontisto';

const Otp = ({ navigation }: { navigation: Navigation }) => {
  const [verificationCode, setVerificationCode] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const inputs = useRef<(TextInput | null)[]>(Array(5).fill(null));

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

  const handleKeyPress = (
    e: NativeSyntheticEvent<{ key: string }>,
    index: number,
  ) => {
    const updatedCode = [...verificationCode];

    if (e.nativeEvent.key === 'Backspace') {
      if (updatedCode[index] === '' && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        updatedCode[index] = '';
      }
      setVerificationCode(updatedCode);
    }
  };

  return (
    <AuthLayout
      heading="Verification"
      isBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.Container}>
        <View style={styles.IconContainer}>
          <View style={styles.IconSecContainer}>
            <Fontisto name="locked" size={40} color={colors.SecondaryColor} />
          </View>
        </View>
        <View style={styles.HeadingContainer}>
          <Text style={styles.Heading}>Verification Code</Text>
          <View style={styles.InnerText}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Font.font600,
                color: colors.SecTextColor,
              }}
            >
              We have sent the code to
            </Text>
            <Text
              style={[
                styles.Heading,
                { fontSize: 16, fontFamily: Font.font600 },
              ]}
            >
              lorem@example.com
            </Text>
          </View>
        </View>
        <View style={styles.codeContainer}>
          {[0, 1, 2, 3, 4].map(index => (
            <TextInput
              ref={ref => {
                if (ref && inputs.current) {
                  inputs.current[index] = ref;
                }
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
              returnKeyType={index === 4 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index < 4) {
                  inputs.current[index + 1]?.focus();
                }
              }}
            />
          ))}
        </View>
        <View style={styles.BtnContainer}>
          <Button name="Submit" onPress={() => {}} />
          <View style={styles.ResendContainer}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Font.font600,
                color: colors.SecTextColor,
              }}
            >
              Didn’t receive the code?
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Font.font700,
                  color: colors.PrimaryColor,
                }}
              >
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Otp;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 25,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 20,
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
  BtnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ResendContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
