import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../components/GradientBG/GradientBG';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

import Skeleton from '../../../components/SkeletonComp/Skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import DeleteAccountModal from '../../../components/DeleteModal/DeleteAccountModal';
import { useVerifyDeleteAccount, useUpdateProfile, useDeleteAccount } from '../../../model/Profile/ProfileModel';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import Field from '../../../components/Field/Field';
import ModalLayout from '../../../layout/ModalLayout/ModalLayout';
import Button from '../../../components/Button/Button';
import ResToast from '../../../components/ResToast/ResToast';
import OTPSheet from '../../../components/BtSheets/OTPSheet';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
     UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Reusable Row ─────────────────────────────────────────────────────────────
const ProfileRow = ({
     label,
     icon,
     isEdit,
     isLoading,
     children,
     displayValue,
     overLayColor,
     rightText,
     onPress,
     valueColor,
}: {
     label: string;
     icon: React.ReactNode;
     rightText?: string | React.ReactNode | React.ReactNode;
     isEdit?: boolean;
     isLoading: boolean;
     children?: React.ReactNode;
     onPress?: () => void;
     displayValue?: string;
     overLayColor?: string;
     valueColor?: string;
}) => (
     <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={{
               flexDirection: 'row',
               width: '100%',
               paddingVertical: 14,
               borderBottomWidth: 1,
               borderBottomColor: '#c5c5c563',
               paddingHorizontal: 20,
               justifyContent: 'space-between',
               alignItems: 'center',
          }}
     >
          <View style={rowStyles.wrapper}>
               <View style={[rowStyles.IconStyle, { backgroundColor: overLayColor ? overLayColor : '#d1eee9' }]}>
                    <View style={rowStyles.iconBox}>{icon}</View>
               </View>
               <View style={{ gap: 2 }}>
                    {isEdit ? (
                         children
                    ) : isLoading ? (
                         <Skeleton width={150} height={10} borderRadius={5} />
                    ) : (
                         <Text style={[rowStyles.value, { color: valueColor ? valueColor : colors.textColor }]}>{displayValue || `Add ${label}`}</Text>
                    )}
                    <Text style={rowStyles.label}>{label}</Text>
               </View>
          </View>
          {rightText ? rightText : <FontAwesome5 name="chevron-right" size={10} color={'rgba(77, 77, 77, 0.6)'} />}
     </TouchableOpacity>
);

const rowStyles = StyleSheet.create({
     wrapper: {
          gap: 10,

          flexDirection: 'row',
          alignItems: 'center',
     },
     IconStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          color: colors.textColor,
          backgroundColor: '#d1eee9',
          padding: 7,
          borderRadius: 10,
     },
     iconBox: {
          color: colors.textColor,
          width: 26,
          height: 26,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
     },
     label: {
          fontFamily: Font.font600,
          fontSize: 13,
          color: 'rgba(77, 77, 77, 0.6)',
          textTransform: 'capitalize',
     },
     value: {
          fontFamily: Font.font600,
          fontSize: 16,
          color: '#000000',
     },
});

const SettingScreen = ({ navigation }: { navigation: Navigation }) => {
     const [isOpen, setIsOpen] = useState(false);
     const [isValidPassword, setIsValidPassword] = useState(false);
     const [otpSheet, setOtpSheet] = useState(false);
     const [deleteModal, setDeleteModal] = useState(false);
     const [visible, setVisible] = useState(false);
     const [changePassword, setChangePassword] = useState({ password: '', newPass: '', reNewPass: '' });

     const { password, newPass, reNewPass } = changePassword;

     const selector = useSelector((state: RootState) => state?.userData);
     const isFingerPrint = useSelector((state: RootState) => state?.userData?.isFingerEnabled);
     const id = selector?.data?.user?._id;
     const email = selector?.data?.user?.email;
     const Token = selector?.data?.accessToken;

     // API
     const { handleDeleteAccount, DeleteStatus: ConfirmDeleteStatus, DeleteLoading: ConfirmDeleteLoading } = useDeleteAccount();
     const { handleVerifyDeleteAccount, DeleteStatus, DeleteLoading } = useVerifyDeleteAccount();
     const { handleChangePassword, isLoading, status } = useUpdateProfile();

     const handleDeleteAccountHandler = () => {
          handleVerifyDeleteAccount({ setOTPModal: setOtpSheet, setDeleteModal: setDeleteModal });
          setDeleteModal(false);
     };

     const handleChangePass = () => {
          if (!isValidPassword) return ResToast({ title: 'Invalid Password', type: 'danger' });
          handleChangePassword({ id, Token, oldPassword: password, newPassword: newPass, reEnter: reNewPass, setIsEdit: setIsOpen });
     };

     useEffect(() => {
          if (ConfirmDeleteStatus === 'pending') {
               setVisible(true);
               setIsOpen(false);
               setOtpSheet(false);
          }
     }, [ConfirmDeleteStatus]);

     return (
          <View style={{ flex: 1, backgroundColor: '#f4f0f0' }}>
               {!visible && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, gap: 20 }}>
                         {/* ── Header ── */}
                         <GradientBG style={[styles.gradientHeader, { marginBottom: 10 }]} isBackgroundImage imgStyle={{ justifyContent: 'center' }}>
                              <View style={styles.topRow}>
                                   <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
                                        <MaterialIcons name="arrow-back" color="#fff" size={20} />
                                   </TouchableOpacity>
                                   <Text style={styles.screenTitle}>Settings</Text>
                                   <View style={{ width: 38 }} />
                              </View>

                              {/* Hero */}
                              <View style={styles.heroWrap}>
                                   <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.heroIconCircle}>
                                        <Ionicons name="settings" size={36} color="#fff" />
                                   </LinearGradient>
                                   <Text style={styles.heroTitle}>Your Privacy & Security Matters</Text>
                                   <Text style={styles.heroSub}>Manage your account settings.</Text>
                              </View>
                         </GradientBG>

                         <View style={styles.card}>
                              {/* Card header */}
                              <View style={styles.cardHeader}>
                                   <View style={{}}>
                                        <Text style={styles.cardTitle}>Security</Text>
                                   </View>
                              </View>

                              {/* Fields */}
                              <ProfileRow
                                   label="Update your password"
                                   icon={<FontAwesome5 name="lock" size={18} color={colors.PrimaryColor} />}
                                   isLoading={false}
                                   displayValue={'Change Password'}
                                   onPress={() => setIsOpen(true)}
                              />
                              <ProfileRow
                                   label="Biometric authentication"
                                   icon={<FontAwesome5 name="fingerprint" size={18} color={'#E58B06'} />}
                                   isLoading={false}
                                   displayValue={'Fingerprint Login'}
                                   overLayColor="#fcf7e3"
                                   onPress={() => navigation.navigate('FingerPrintScreen')}
                                   rightText={
                                        <View style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: isFingerPrint ? '#d1eee9' : '#e7e7e7', borderRadius: 100 }}>
                                             <Text style={{ color: colors.textColor, fontFamily: Font.font700, fontSize: 12 }}>{isFingerPrint ? 'On' : 'Off'}</Text>
                                        </View>
                                   }
                              />
                         </View>

                         <View style={[styles.card, { marginBottom: 30 }]}>
                              {/* Card header */}
                              <View style={styles.cardHeader}>
                                   <View style={{}}>
                                        <Text style={styles.cardTitle}>Privacy</Text>
                                   </View>
                              </View>

                              {/* Fields */}
                              <ProfileRow
                                   label="Read our policy"
                                   icon={<Ionicons name="document-text" size={18} color={colors.PrimaryColor} />}
                                   isLoading={false}
                                   displayValue={'Privacy Policy'}
                                   onPress={() => navigation.navigate('PrivacyPolicy')}
                              />
                              <ProfileRow
                                   label="Permanently remove account"
                                   icon={<FontAwesome5 name="trash" size={18} color={'#DD2D26'} />}
                                   isLoading={false}
                                   displayValue={'Delete Account'}
                                   valueColor="#DD2D26"
                                   overLayColor="#FEF2F2"
                                   onPress={() => setDeleteModal(true)}
                              />
                         </View>
                    </ScrollView>
               )}
               {/* ── Change Password Modal ── */}
               {!visible && (
                    <ModalLayout
                         isOpen={isOpen}
                         setIsOpen={() => {
                              setIsOpen(false);
                              setChangePassword({ newPass: '', password: '', reNewPass: '' });
                         }}
                    >
                         <View style={styles.ModalContainer}>
                              <View style={styles.modalHeader}>
                                   <View style={styles.modalIconBox}>
                                        <MaterialIcons name="lock-outline" color={colors.PrimaryColor} size={22} />
                                   </View>
                                   <Text style={styles.modalTitle}>Change Password</Text>
                                   <Text style={styles.modalSub}>Choose a strong new password</Text>
                                   <TouchableOpacity
                                        style={styles.modalClose}
                                        onPress={() => {
                                             setIsOpen(false);
                                             setChangePassword({ newPass: '', password: '', reNewPass: '' });
                                        }}
                                        disabled={isLoading}
                                   >
                                        <Entypo name="cross" color={colors.SecTextColor} size={22} />
                                   </TouchableOpacity>
                              </View>
                              <View style={{ width: '100%', gap: 14 }}>
                                   <Field
                                        placeHolder="Current Password"
                                        type="password"
                                        value={password}
                                        onChange={value => setChangePassword({ ...changePassword, password: value })}
                                        disabled={isLoading}
                                   />
                                   <Field
                                        placeHolder="New Password"
                                        type="password"
                                        isIcon
                                        value={newPass}
                                        onChange={value => setChangePassword({ ...changePassword, newPass: value })}
                                        disabled={isLoading}
                                        validate
                                        onValidationChange={value => setIsValidPassword(value)}
                                   />
                                   <Field
                                        placeHolder="Re-Enter New Password"
                                        type="password"
                                        isIcon
                                        value={reNewPass}
                                        onChange={value => setChangePassword({ ...changePassword, reNewPass: value })}
                                        disabled={isLoading}
                                   />
                              </View>
                              <Button name="Update Password" onPress={handleChangePass} isLoading={isLoading} disabled={isLoading} />
                         </View>
                    </ModalLayout>
               )}
               {!visible && (
                    <DeleteAccountModal
                         visible={deleteModal}
                         onClose={() => setDeleteModal(false)}
                         onConfirm={() => {
                              // apna delete API call yahan
                              handleDeleteAccountHandler();
                         }}
                         isLoading={DeleteLoading}
                         requireConfirmText={true} // false karo agar confirm typing nahi chahiye
                    />
               )}

               {!visible && (
                    <OTPSheet
                         visible={otpSheet}
                         onClose={() => setOtpSheet(false)}
                         email={email}
                         onConfirm={otp => {
                              // apna verify API yahan
                              console.log('OTP:', otp);
                              handleDeleteAccount(otp);
                         }}
                         isLoading={ConfirmDeleteLoading}
                    />
               )}

               {/* ── Loading Overlay ── */}
               {visible && (
                    <LoadingScreen
                         status={ConfirmDeleteStatus}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/LoadingLogo.png')}
                         loadingTitle={ConfirmDeleteStatus != 'uninitialized' ? 'Deleting Your Account...' : 'Updating Profile Details...'}
                         successTitle="All done!"
                         successSubtitle={ConfirmDeleteStatus != 'uninitialized' ? 'Account Deleted Successfully...' : 'Profile Updated Successfully'}
                         imageSize={70}
                         errorTitle="Something went wrong"
                         errorSubtitle="Please try again later"
                         hideDelay={2000}
                         backgroundColor={colors.SecondaryColor}
                         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                    />
               )}
          </View>
     );
};

export default SettingScreen;

const styles = StyleSheet.create({
     gradientHeader: {
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          paddingTop: 14,
          paddingBottom: 30,
     },
     topRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 24,
     },
     backBtn: {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     screenTitle: {
          fontFamily: Font.font700,
          fontSize: 18,
          color: '#fff',
          letterSpacing: 0.3,
     },

     // ── Card ──
     card: {
          marginHorizontal: 16,
          borderRadius: 20,
          backgroundColor: '#fff',
          paddingHorizontal: 0,
          paddingTop: 15,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
     },
     cardHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',

          paddingHorizontal: 20,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c563',
     },
     cardTitle: { fontFamily: Font.font700, color: colors.PrimaryColor, fontSize: 18, letterSpacing: 0.3, textTransform: 'uppercase' },

     // ── Hero ──
     heroWrap: { alignItems: 'center', gap: 8 },
     heroIconCircle: {
          width: 80,
          height: 80,
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.35)',
     },
     heroTitle: {
          fontFamily: Font.font700,
          fontSize: 20,
          color: '#fff',
          letterSpacing: 0.2,
     },
     heroSub: {
          fontFamily: Font.font500 || Font.font600,
          fontSize: 13,
          color: 'rgba(255,255,255,0.65)',
          textAlign: 'center',
          paddingHorizontal: 30,
     },
     lastUpdatedBadge: {
          marginTop: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 16,
          paddingVertical: 5,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.3)',
     },
     lastUpdatedText: {
          fontFamily: Font.font600,
          fontSize: 11,
          color: '#fff',
     },

     // ── Modal ──
     ModalContainer: { justifyContent: 'center', alignItems: 'center', gap: 18, width: '100%' },
     modalHeader: { alignItems: 'center', width: '100%', position: 'relative', paddingBottom: 4 },
     modalIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.PrimaryColor + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
     modalTitle: { fontFamily: Font.font600, fontSize: 18, color: colors.textColor, letterSpacing: 0.2 },
     modalSub: { fontFamily: Font.font500 || Font.font600, fontSize: 12, color: colors.SecTextColor, marginTop: 3 },
     modalClose: { position: 'absolute', right: 0, top: 0 },
});
