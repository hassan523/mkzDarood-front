// OTPSheet.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { windowHeight } from '../../utils/dimensions/dimensions';
import useKeyboardStatus from '../../utils/IsKeyboardStatus/useKeyboardStatus';

const colors = {
     PrimaryColor: '#006860',
     lightGreen: '#349F92',
     errorRed: '#E53935',
     textColor: '#1E1E1E',
     SecTextColor: '#484848',
};

interface OTPSheetProps {
     visible: boolean;
     onClose: () => void;
     onConfirm: (otp: string) => void;
     isLoading?: boolean;
     email?: string;
}

const OTPSheet: React.FC<OTPSheetProps> = ({ visible, onClose, onConfirm, isLoading = false, email }) => {
     const [otp, setOtp] = useState('');
     const isComplete = otp.length === 6;
     const isKeyboardOpen = useKeyboardStatus();

     const backdropOpacity = useRef(new Animated.Value(0)).current;
     const sheetTranslateY = useRef(new Animated.Value(400)).current;
     const iconScale = useRef(new Animated.Value(0)).current;
     const contentOpacity = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          if (visible) {
               setOtp('');
               Animated.parallel([
                    Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(sheetTranslateY, { toValue: 0, friction: 8, tension: 90, useNativeDriver: true }),
               ]).start();
               Animated.spring(iconScale, { toValue: 1, friction: 5, tension: 120, delay: 200, useNativeDriver: true }).start();
               Animated.timing(contentOpacity, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }).start();
          } else {
               Animated.parallel([
                    Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
                    Animated.timing(sheetTranslateY, { toValue: 400, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true }),
               ]).start();
               iconScale.setValue(0);
               contentOpacity.setValue(0);
          }
     }, [visible]);

     if (!visible) return null;
     return (
          <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
               {/* Backdrop */}
               <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <TouchableOpacity style={StyleSheet.absoluteFill} disabled={isLoading} />
               </Animated.View>

               <View style={styles.container}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
                         <Animated.View
                              style={[
                                   styles.sheet,
                                   { transform: [{ translateY: sheetTranslateY }] },
                                   isKeyboardOpen && { paddingBottom: Platform.OS === 'ios' ? windowHeight - 500 : windowHeight - 500 },
                              ]}
                         >
                              {/* Pill */}
                              <View style={styles.pill} />

                              {/* Close */}
                              <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isLoading}>
                                   <MaterialIcons name="close" size={20} color={colors.SecTextColor} />
                              </TouchableOpacity>

                              {/* Icon */}
                              <Animated.View style={{ transform: [{ scale: iconScale }], marginTop: 8 }}>
                                   <View style={styles.iconOuter}>
                                        <View style={styles.iconInner}>
                                             <MaterialIcons name="mark-email-unread" size={34} color={colors.PrimaryColor} />
                                        </View>
                                   </View>
                              </Animated.View>

                              {/* Text */}
                              <Animated.View style={[styles.textBlock, { opacity: contentOpacity }]}>
                                   <Text style={styles.title}>Verify your email</Text>
                                   <Text style={styles.subtitle}>
                                        Enter the 6-digit OTP sent to{'\n'}
                                        <Text style={styles.emailText}>{email || 'your email'}</Text>
                                   </Text>
                              </Animated.View>

                              {/* OTP Input */}
                              <Animated.View style={[{ width: '100%' }, { opacity: contentOpacity, alignItems: 'center', justifyContent: 'center' }]}>
                                   <OtpInput
                                        numberOfDigits={6}
                                        onTextChange={setOtp}
                                        focusColor={colors.PrimaryColor}
                                        theme={{
                                             containerStyle: styles.otpContainer,
                                             pinCodeContainerStyle: styles.otpBox,
                                             pinCodeTextStyle: styles.otpText,
                                             focusedPinCodeContainerStyle: styles.otpBoxFocused,
                                             filledPinCodeContainerStyle: styles.otpBoxFilled,
                                        }}
                                   />
                              </Animated.View>

                              {/* Buttons */}
                              <Animated.View style={[styles.btnRow, { opacity: contentOpacity }]}>
                                   <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isLoading} activeOpacity={0.8}>
                                        <Text style={styles.cancelText}>Cancel</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity onPress={() => onConfirm(otp)} disabled={!isComplete || isLoading} activeOpacity={isComplete ? 0.85 : 0.5} style={{ flex: 1 }}>
                                        <View style={[styles.confirmBtn, !isComplete && styles.confirmBtnDisabled]}>
                                             {isLoading ? (
                                                  <Text style={styles.confirmText}>Verifying...</Text>
                                             ) : (
                                                  <>
                                                       <MaterialIcons name="verified-user" size={17} color="#fff" />
                                                       <Text style={styles.confirmText}>Confirm Delete</Text>
                                                  </>
                                             )}
                                        </View>
                                   </TouchableOpacity>
                              </Animated.View>
                         </Animated.View>
                    </KeyboardAvoidingView>
               </View>
          </Modal>
     );
};

const styles = StyleSheet.create({
     backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.6)' },
     container: { flex: 1, justifyContent: 'flex-end' },
     sheet: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingBottom: 44,
          paddingTop: 12,
          alignItems: 'center',
          gap: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 24,
     },
     pill: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', marginBottom: 4 },
     closeBtn: { position: 'absolute', right: 20, top: 18, width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },

     // Icon
     iconOuter: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.PrimaryColor + '12', alignItems: 'center', justifyContent: 'center' },
     iconInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.PrimaryColor + '20', alignItems: 'center', justifyContent: 'center' },

     // Text
     textBlock: { alignItems: 'center', gap: 8 },
     title: { fontSize: 22, fontWeight: '700', color: colors.textColor, letterSpacing: 0.2 },
     subtitle: { fontSize: 14, color: colors.SecTextColor, textAlign: 'center', lineHeight: 22 },
     emailText: { fontWeight: '700', color: colors.PrimaryColor },

     // OTP
     otpContainer: { width: '100%', gap: 8 },
     otpBox: { width: 46, height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' },
     otpBoxFocused: { borderColor: colors.PrimaryColor, backgroundColor: '#F0FAF8' },
     otpBoxFilled: { borderColor: colors.lightGreen, backgroundColor: '#F0FAF8' },
     otpText: { fontSize: 20, fontWeight: '700', color: colors.textColor },

     // Buttons
     btnRow: { flexDirection: 'row', width: '100%', gap: 12, marginTop: 4 },
     cancelBtn: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
     cancelText: { fontSize: 15, fontWeight: '600', color: colors.SecTextColor },
     confirmBtn: { height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.errorRed },
     confirmBtnDisabled: { backgroundColor: '#FFCDD2' },
     confirmText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
});

export default OTPSheet;
