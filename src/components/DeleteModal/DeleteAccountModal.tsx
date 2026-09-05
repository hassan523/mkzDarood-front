import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useKeyboardStatus from '../../utils/IsKeyboardStatus/useKeyboardStatus';

// ─── Colors ───────────────────────────────────────────────────────────────────
const colors = {
     PrimaryColor: '#006860',
     lightGreen: '#349F92',
     gradientOne: '#00998C',
     gradientTwo: '#005B41',
     errorRed: '#E53935',
     errorLight: '#FFEBEE',
     SecondaryColor: '#FFFFFF',
     textColor: '#1E1E1E',
     SecTextColor: '#484848',
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface DeleteAccountModalProps {
     visible: boolean;
     onClose: () => void;
     onConfirm: () => void;
     isLoading?: boolean;
     /** User ko confirm karne ke liye "DELETE" type karna hoga */
     requireConfirmText?: boolean;
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ visible, onClose, onConfirm, isLoading = false, requireConfirmText = true }) => {
     const [confirmText, setConfirmText] = useState('');
     const isConfirmed = requireConfirmText ? confirmText === 'DELETE' : true;

     // Animations
     const backdropOpacity = useRef(new Animated.Value(0)).current;
     const sheetTranslateY = useRef(new Animated.Value(400)).current;
     const shakeAnim = useRef(new Animated.Value(0)).current;
     const iconScale = useRef(new Animated.Value(0)).current;
     const warningOpacity = useRef(new Animated.Value(0)).current;
     const isKeyboardOpen = useKeyboardStatus();

     useEffect(() => {
          if (visible) {
               setConfirmText('');
               // Sheet slide up
               Animated.parallel([
                    Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(sheetTranslateY, { toValue: 0, friction: 8, tension: 90, useNativeDriver: true }),
               ]).start();
               // Icon pop in
               Animated.spring(iconScale, { toValue: 1, friction: 5, tension: 120, delay: 200, useNativeDriver: true }).start();
               // Warning fade in
               Animated.timing(warningOpacity, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }).start();
          } else {
               Animated.parallel([
                    Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
                    Animated.timing(sheetTranslateY, { toValue: 400, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true }),
               ]).start();
               // Reset
               iconScale.setValue(0);
               warningOpacity.setValue(0);
          }
     }, [visible]);

     // Shake animation — jab confirm text galat ho aur delete press karo
     const triggerShake = () => {
          shakeAnim.setValue(0);
          Animated.sequence([
               Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
          ]).start();
     };

     const handleDelete = () => {
          if (!isConfirmed) {
               triggerShake();
               return;
          }
          onConfirm();
     };

     if (!visible) return null;

     return (
          <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
               {/* Backdrop */}
               <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} disabled={isLoading} />
               </Animated.View>

               <View style={styles.container}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
                         <Animated.View style={[styles.sheet, { height: isKeyboardOpen ? '95%' : 'auto', transform: [{ translateY: sheetTranslateY }] }]}>
                              {/* Pill */}
                              <View style={styles.pill} />

                              {/* Close button */}
                              <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isLoading}>
                                   <MaterialIcons name="close" size={20} color={colors.SecTextColor} />
                              </TouchableOpacity>

                              {/* Icon */}
                              <Animated.View style={[styles.iconWrapper, { transform: [{ scale: iconScale }] }]}>
                                   <View style={styles.iconCircleOuter}>
                                        <View style={styles.iconCircleInner}>
                                             <MaterialIcons name="delete-forever" size={36} color={colors.errorRed} />
                                        </View>
                                   </View>
                              </Animated.View>

                              {/* Title */}
                              <Animated.View style={[styles.textBlock, { opacity: warningOpacity }]}>
                                   <Text style={styles.title}>Delete Account</Text>
                                   <Text style={styles.subtitle}>
                                        This action is <Text style={styles.bold}>permanent</Text> and cannot be undone. All your data will be lost forever.
                                   </Text>
                              </Animated.View>

                              {/* Warning bullets */}
                              <Animated.View style={[styles.warningBox, { opacity: warningOpacity }]}>
                                   {['Your profile will be permanently deleted', 'You will not be able to recover your account'].map((item, i) => (
                                        <View key={i} style={styles.warningRow}>
                                             <MaterialIcons name="warning-amber" size={14} color={colors.errorRed} />
                                             <Text style={styles.warningText}>{item}</Text>
                                        </View>
                                   ))}
                              </Animated.View>

                              {/* Confirm input */}
                              {requireConfirmText && (
                                   <Animated.View style={[styles.inputBlock, { opacity: warningOpacity, transform: [{ translateX: shakeAnim }] }]}>
                                        <Text style={styles.inputLabel}>
                                             Type <Text style={styles.deleteWord}>DELETE</Text> to confirm
                                        </Text>
                                        <TextInput
                                             style={[styles.input, confirmText.length > 0 && !isConfirmed && styles.inputError, isConfirmed && styles.inputSuccess]}
                                             value={confirmText}
                                             onChangeText={setConfirmText}
                                             placeholder="Type DELETE here"
                                             placeholderTextColor="#ccc"
                                             autoCapitalize="characters"
                                             editable={!isLoading}
                                        />
                                        {confirmText.length > 0 && !isConfirmed && <Text style={styles.inputHint}>Must type exactly: DELETE</Text>}
                                   </Animated.View>
                              )}

                              {/* Buttons */}
                              <View style={styles.btnRow}>
                                   {/* Cancel */}
                                   <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isLoading} activeOpacity={0.8}>
                                        <Text style={styles.cancelText}>Cancel</Text>
                                   </TouchableOpacity>

                                   {/* Delete */}
                                   <TouchableOpacity onPress={handleDelete} disabled={isLoading} activeOpacity={isConfirmed ? 0.85 : 0.5} style={{ flex: 1 }}>
                                        <View style={[styles.deleteBtn, !isConfirmed && styles.deleteBtnDisabled]}>
                                             {isLoading ? (
                                                  <Text style={styles.deleteBtnText}>Deleting...</Text>
                                             ) : (
                                                  <>
                                                       <MaterialIcons name="delete-forever" size={18} color="#fff" />
                                                       <Text style={styles.deleteBtnText}>Delete Account</Text>
                                                  </>
                                             )}
                                        </View>
                                   </TouchableOpacity>
                              </View>
                         </Animated.View>
                    </KeyboardAvoidingView>
               </View>
          </Modal>
     );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
     backdrop: {
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(0,0,0,0.6)',
     },
     container: {
          flex: 1,
          justifyContent: 'flex-end',
     },
     sheet: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingBottom: 44,
          paddingTop: 12,
          alignItems: 'center',
          gap: 18,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 24,
     },
     pill: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', marginBottom: 4 },
     closeBtn: { position: 'absolute', right: 20, top: 18, width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },

     // Icon
     iconWrapper: { marginTop: 4 },
     iconCircleOuter: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.errorRed + '10', alignItems: 'center', justifyContent: 'center' },
     iconCircleInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.errorRed + '18', alignItems: 'center', justifyContent: 'center' },

     // Text
     textBlock: { alignItems: 'center', gap: 8 },
     title: { fontSize: 22, fontWeight: '700', color: colors.textColor, letterSpacing: 0.2 },
     subtitle: { fontSize: 14, color: colors.SecTextColor, textAlign: 'center', lineHeight: 22 },
     bold: { fontWeight: '700', color: colors.errorRed },

     // Warning box
     warningBox: { width: '100%', backgroundColor: '#FFF5F5', borderRadius: 14, padding: 14, gap: 10, borderWidth: 1, borderColor: colors.errorRed + '25' },
     warningRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
     warningText: { fontSize: 13, color: '#B71C1C', flex: 1, lineHeight: 19 },

     // Input
     inputBlock: { width: '100%', gap: 8 },
     inputLabel: { fontSize: 13, color: colors.SecTextColor, fontWeight: '500' },
     deleteWord: { color: colors.errorRed, fontWeight: '700', letterSpacing: 1 },
     input: {
          width: '100%',
          height: 48,
          borderWidth: 1.5,
          borderColor: '#E0E0E0',
          borderRadius: 12,
          paddingHorizontal: 14,
          fontSize: 15,
          color: colors.textColor,
          letterSpacing: 1,
          backgroundColor: '#FAFAFA',
     },
     inputError: { borderColor: colors.errorRed, backgroundColor: '#FFF5F5' },
     inputSuccess: { borderColor: '#4CAF50', backgroundColor: '#F1F8F1' },
     inputHint: { fontSize: 11.5, color: colors.errorRed, marginLeft: 2 },

     // Buttons
     btnRow: { flexDirection: 'row', width: '100%', gap: 12, marginTop: 4 },
     cancelBtn: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
     cancelText: { fontSize: 15, fontWeight: '600', color: colors.SecTextColor },
     deleteBtn: { height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.errorRed },
     deleteBtnDisabled: { backgroundColor: '#FFCDD2' },
     deleteBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
});

export default DeleteAccountModal;

// ─── Usage ────────────────────────────────────────────────────────────────────
/*
const [deleteModal, setDeleteModal] = useState(false);

<DeleteAccountModal
     visible={deleteModal}
     onClose={() => setDeleteModal(false)}
     onConfirm={() => {
          // apna delete API call yahan
          handleDeleteAccount();
     }}
     isLoading={isLoading}
     requireConfirmText={true}   // false karo agar confirm typing nahi chahiye
/>

// Open karo:
<TouchableOpacity onPress={() => setDeleteModal(true)}>
     <Text>Delete Account</Text>
</TouchableOpacity>
*/
