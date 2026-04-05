import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import colors from '../../../utils/colors/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../../components/Button/Button';
import Field from '../../../components/Field/Field';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import ModalLayout from '../../../layout/ModalLayout/ModalLayout';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useProfileData, useUpdateProfile } from '../../../model/Profile/ProfileModel';
import { user } from '../../../redux/Auth/AuthType';
import GradientBG from '../../../components/GradientBG/GradientBG';
import { windowHeight, windowWidth } from '../../../utils/dimensions/dimensions';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import useKeyboardStatus from '../../../utils/IsKeyboardStatus/useKeyboardStatus';
import Skeleton from '../../../components/SkeletonComp/Skeleton';
import { useIsFocused } from '@react-navigation/native';
import AddressAutocomplete from '../../../components/AddressAutocomplete/AddressAutocomplete';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import FastImage from 'react-native-fast-image';
import ResToast from '../../../components/ResToast/ResToast';
import LinearGradient from 'react-native-linear-gradient';

interface DataTypes {
     profilePicture: string | undefined;
     username: string;
     email: string;
     phone: string;
     country: string;
     city: string;
}

// ─── Reusable Row ─────────────────────────────────────────────────────────────
const ProfileRow = ({
     label,
     icon,
     isEdit,
     isLoading,
     children,
     displayValue,
}: {
     label: string;
     icon: React.ReactNode;
     isEdit: boolean;
     isLoading: boolean;
     children: React.ReactNode;
     displayValue?: string;
}) => (
     <View style={rowStyles.wrapper}>
          <View style={rowStyles.labelRow}>
               <View style={rowStyles.iconBox}>{icon}</View>
               <Text style={rowStyles.label}>{label}</Text>
          </View>
          {isEdit ? children : isLoading ? <Skeleton width={150} height={10} borderRadius={5} /> : <Text style={rowStyles.value}>{displayValue || `Add ${label}`}</Text>}
     </View>
);

const rowStyles = StyleSheet.create({
     wrapper: {
          width: '100%',
          gap: 8,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.12)',
     },
     labelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
     },
     iconBox: {
          width: 26,
          height: 26,
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     label: {
          fontFamily: Font.font600,
          fontSize: 11,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 1,
          textTransform: 'uppercase',
     },
     value: {
          fontFamily: Font.font600,
          fontSize: 16,
          color: '#fff',
          paddingLeft: 34,
     },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Profile = ({ navigation }: { navigation: Navigation }) => {
     const [imageLoading, setImageLoading] = useState(true);
     const [updateData, setUpdateData] = useState<DataTypes>({ profilePicture: '', username: '', email: '', phone: '', country: '', city: '' });
     const [isEdit, setIsEdit] = useState(false);
     const [isValidPassword, setIsValidPassword] = useState(false);
     const [isValidNumber, setIsValidNumber] = useState(false);
     const [visible, setVisible] = useState(false);
     const [isOpen, setIsOpen] = useState(false);
     const [countryCode, setCountryCode] = useState<string | null>(null);
     const [changePassword, setChangePassword] = useState({ password: '', newPass: '', reNewPass: '' });

     // Avatar ring pulse animation
     const ringAnim = useRef(new Animated.Value(1)).current;
     useEffect(() => {
          Animated.loop(
               Animated.sequence([
                    Animated.timing(ringAnim, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
                    Animated.timing(ringAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
               ]),
          ).start();
     }, []);

     const selector = useSelector((state: RootState) => state?.userData);
     const id = selector?.data?.user?._id;
     const Token = selector?.data?.accessToken;
     const { password, newPass, reNewPass } = changePassword;
     const { handleUpdateProfile, handleChangePassword, isLoading, status } = useUpdateProfile();
     const getProfile = useProfileData({ Token: Token ?? '', id: id ?? '' });
     const userData = getProfile?.data?.profile;
     const isLoadingProfile = getProfile?.isLoading;

     const handleIsEdit = () => {
          setUpdateData(userData as user);
          setIsEdit(true);
     };
     const handleData = ({ name, value }: { name: string; value: string }) => setUpdateData({ ...updateData, [name]: value });

     const handleSave = () => {
          handleUpdateProfile({
               id,
               Token,
               profilePicture: updateData?.profilePicture || '',
               setIsEdit,
               country: updateData?.country,
               city: updateData?.city,
               username: updateData?.username,
               phone: updateData?.phone,
          });
     };

     const handleChangePass = () => {
          if (!isValidPassword) return ResToast({ title: 'Invalid Password', type: 'danger' });
          handleChangePassword({ id, Token, oldPassword: password, newPassword: newPass, reEnter: reNewPass, setIsEdit: setIsOpen });
     };

     useEffect(() => {
          if (status === 'pending') setVisible(true);
     }, [status]);

     const pickImage = () => {
          if (!isEdit) return;
          ImagePicker.openPicker({
               width: 500,
               height: 500,
               cropping: true,
               cropperCircleOverlay: true,
               compressImageQuality: 0.8,
               mediaType: 'photo',
               cropperToolbarTitle: 'Adjust Photo',
               cropperActiveWidgetColor: colors.PrimaryColor,
               cropperStatusBarColor: colors.PrimaryColor,
               cropperToolbarColor: colors.PrimaryColor,
               cropperToolbarWidgetColor: colors.SecondaryColor,
          })
               .then(image => setUpdateData(prev => ({ ...prev, profilePicture: image.path })))
               .catch(error => {
                    if (error.code !== 'E_PICKER_CANCELLED') console.log('ImagePicker Error:', error);
               });
     };

     const isKeyboardVisible = useKeyboardStatus();
     const isFocused = useIsFocused();

     useEffect(() => {
          if (!isFocused) {
               setIsEdit(false);
               setIsOpen(false);
          }
          return () => {
               setIsEdit(false);
               setIsOpen(false);
          };
     }, [isFocused]);

     useEffect(() => {
          if (!(userData as DataTypes)?.profilePicture) {
               setImageLoading(false);
               return;
          }
          const timer = setTimeout(() => setImageLoading(false), 3000);
          return () => clearTimeout(timer);
     }, [(userData as DataTypes)?.profilePicture]);

     const profilePic = isEdit ? updateData.profilePicture : (userData as DataTypes)?.profilePicture;

     return (
          <>
               <View style={{ flex: 1, backgroundColor: '#f0f4f3' }}>
                    {!visible && (
                         <GradientBG style={styles.gradient} isBackgroundImage imgStyle={{ height: windowHeight, justifyContent: 'center' }}>
                              <ScrollView contentContainerStyle={[styles.Container, { paddingBottom: isKeyboardVisible ? 500 : 100 }]} showsVerticalScrollIndicator={false}>
                                   <CustomHeader navigation={navigation} />

                                   <View style={{ marginTop: 100 }}>
                                        {/* ── Avatar Section ── */}
                                        <View style={styles.avatarSection}>
                                             {/* Decorative ring */}
                                             <Animated.View style={[styles.avatarRingOuter, { transform: [{ scale: ringAnim }] }]} />
                                             <View style={styles.avatarRingInner} />

                                             <View style={styles.avatarWrapper}>
                                                  {isLoadingProfile || imageLoading ? (
                                                       <Skeleton width={110} height={110} borderRadius={55} />
                                                  ) : profilePic ? (
                                                       <FastImage
                                                            source={{ uri: profilePic, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable }}
                                                            style={styles.avatarImage}
                                                            onLoad={() => setImageLoading(false)}
                                                            onError={() => setImageLoading(false)}
                                                       />
                                                  ) : (
                                                       <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} style={styles.avatarFallback}>
                                                            <Text style={styles.avatarInitial}>{userData?.username?.charAt(0)?.toUpperCase()}</Text>
                                                       </LinearGradient>
                                                  )}

                                                  {isEdit && (
                                                       <TouchableOpacity style={styles.editBadge} onPress={pickImage} disabled={isLoadingProfile} activeOpacity={0.8}>
                                                            <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} style={styles.editBadgeGradient}>
                                                                 <MaterialIcons name="photo-camera" color="#fff" size={16} />
                                                            </LinearGradient>
                                                       </TouchableOpacity>
                                                  )}
                                             </View>

                                             {/* Name + email below avatar */}
                                             {!isEdit && (
                                                  <View style={{ alignItems: 'center', marginTop: 14, gap: 4 }}>
                                                       {isLoadingProfile ? (
                                                            <Skeleton width={120} height={14} borderRadius={7} />
                                                       ) : (
                                                            <Text style={styles.avatarName}>{userData?.username || 'Your Name'}</Text>
                                                       )}
                                                       {isLoadingProfile ? <Skeleton width={160} height={10} borderRadius={5} /> : <Text style={styles.avatarEmail}>{userData?.email}</Text>}
                                                  </View>
                                             )}
                                        </View>

                                        {/* ── Card ── */}
                                        <View style={styles.card}>
                                             {/* Card header */}
                                             <View style={styles.cardHeader}>
                                                  <View>
                                                       <Text style={styles.cardTitle}>Profile Details</Text>
                                                       <Text style={styles.cardSub}>Manage your personal info</Text>
                                                  </View>
                                                  {!isEdit && (
                                                       <TouchableOpacity style={styles.editBtn} onPress={handleIsEdit} disabled={isLoadingProfile} activeOpacity={0.8}>
                                                            <MaterialIcons name="edit" color="#fff" size={15} />
                                                            <Text style={styles.editBtnText}>Edit</Text>
                                                       </TouchableOpacity>
                                                  )}
                                             </View>

                                             {/* Fields */}
                                             <ProfileRow
                                                  label="Name"
                                                  icon={<FontAwesome5 name="user-alt" size={12} color="#fff" />}
                                                  isEdit={isEdit}
                                                  isLoading={!!isLoadingProfile}
                                                  displayValue={userData?.username}
                                             >
                                                  <Field
                                                       placeHolder="Enter Username"
                                                       type="text"
                                                       isIcon={<FontAwesome5 name="user-alt" size={16} color={colors.SecondaryColor} />}
                                                       value={updateData.username}
                                                       onChange={value => handleData({ name: 'username', value })}
                                                       customDivClass={styles.fieldDiv}
                                                       customClass={styles.fieldInput}
                                                       iconColor="white"
                                                       disabled={isLoading}
                                                  />
                                             </ProfileRow>

                                             <ProfileRow
                                                  label="Country"
                                                  icon={<FontAwesome name="globe" size={12} color="#fff" />}
                                                  isEdit={isEdit}
                                                  isLoading={!!isLoadingProfile}
                                                  displayValue={userData?.country || undefined}
                                             >
                                                  <AddressAutocomplete
                                                       type="country"
                                                       value={updateData.country}
                                                       onChangeText={value => {
                                                            handleData({ name: 'country', value });
                                                            setUpdateData(prev => ({ ...prev, city: '' }));
                                                       }}
                                                       placeholder="Enter your Country"
                                                       apiKey="AIzaSyClo7scOstr59xuT6Y-sKNPodDQGnrtPhE"
                                                       iconName="city"
                                                       setCountryCode={value => setCountryCode(value)}
                                                  />
                                             </ProfileRow>

                                             <ProfileRow
                                                  label="City"
                                                  icon={<MaterialIcons name="location-city" size={12} color="#fff" />}
                                                  isEdit={isEdit}
                                                  isLoading={!!isLoadingProfile}
                                                  displayValue={updateData?.city || undefined}
                                             >
                                                  <AddressAutocomplete
                                                       type="city"
                                                       value={updateData.city}
                                                       onChangeText={value => handleData({ name: 'city', value })}
                                                       placeholder="Enter your city"
                                                       apiKey="AIzaSyClo7scOstr59xuT6Y-sKNPodDQGnrtPhE"
                                                       iconName="city"
                                                       countryCode={countryCode}
                                                  />
                                             </ProfileRow>

                                             <ProfileRow
                                                  label="Email"
                                                  icon={<MaterialIcons name="email" size={12} color="#fff" />}
                                                  isEdit={isEdit}
                                                  isLoading={!!isLoadingProfile}
                                                  displayValue={userData?.email}
                                             >
                                                  <Field
                                                       placeHolder="Enter Email"
                                                       type="email"
                                                       isIcon
                                                       value={updateData.email}
                                                       onChange={value => handleData({ name: 'email', value })}
                                                       customDivClass={styles.fieldDiv}
                                                       customClass={styles.fieldInput}
                                                       iconColor="white"
                                                       disabled
                                                  />
                                             </ProfileRow>

                                             <ProfileRow
                                                  label="Phone"
                                                  icon={<FontAwesome name="phone" size={12} color="#fff" />}
                                                  isEdit={isEdit}
                                                  isLoading={!!isLoadingProfile}
                                                  displayValue={(userData as DataTypes)?.phone}
                                             >
                                                  <Field
                                                       placeHolder="Enter Phone Number"
                                                       type="number"
                                                       isIcon={<FontAwesome name="phone" size={16} color={colors.SecondaryColor} />}
                                                       value={updateData.phone}
                                                       onChange={value => handleData({ name: 'phone', value })}
                                                       customDivClass={styles.fieldDiv}
                                                       customClass={styles.fieldInput}
                                                       iconColor="white"
                                                       disabled={isLoading}
                                                       maxLength={15}
                                                       minValue={10}
                                                       validate
                                                       onValidationChange={value => setIsValidNumber(value)}
                                                  />
                                             </ProfileRow>

                                             {/* Buttons */}
                                             <View style={{ marginTop: 20 }}>
                                                  {isEdit ? (
                                                       <View style={styles.btnRow}>
                                                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEdit(false)} disabled={isLoading} activeOpacity={0.8}>
                                                                 <Text style={styles.cancelBtnText}>Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity activeOpacity={0.85} onPress={handleSave} style={{ flex: 1 }}>
                                                                 <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} style={styles.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                                                      <Text style={styles.saveBtnText}>{isLoading ? 'Saving...' : 'Save Changes'}</Text>
                                                                 </LinearGradient>
                                                            </TouchableOpacity>
                                                       </View>
                                                  ) : (
                                                       <TouchableOpacity onPress={() => setIsOpen(true)} disabled={isLoadingProfile} activeOpacity={0.8} style={styles.changePassBtn}>
                                                            <MaterialIcons name="lock-outline" color={colors.PrimaryColor} size={16} />
                                                            <Text style={styles.changePassText}>Change Password</Text>
                                                       </TouchableOpacity>
                                                  )}
                                             </View>
                                        </View>
                                   </View>
                              </ScrollView>
                         </GradientBG>
                    )}

                    {/* ── Change Password Modal ── */}
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

                    {/* ── Loading Overlay ── */}
                    {visible && (
                         <LoadingScreen
                              status={status}
                              onHide={() => setVisible(false)}
                              image={require('../../../assets/Allah.png')}
                              loadingTitle="Updating Profile Details..."
                              successTitle="All done!"
                              successSubtitle="Profile Updated Successfully"
                              imageSize={40}
                              errorTitle="Something went wrong"
                              errorSubtitle="Please try again later"
                              hideDelay={2000}
                              backgroundColor={colors.SecondaryColor}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                         />
                    )}
               </View>
          </>
     );
};

export default Profile;

const styles = StyleSheet.create({
     Container: { width: '100%', gap: 0, justifyContent: 'center' },
     gradient: { borderRadius: 0, width: '100%', justifyContent: 'center', paddingTop: 14 },

     // ── Avatar ──
     avatarSection: { alignItems: 'center', marginBottom: 28, position: 'relative' },
     avatarRingOuter: { position: 'absolute', top: -8, width: 138, height: 138, borderRadius: 69, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
     avatarRingInner: { position: 'absolute', top: 0, width: 122, height: 122, borderRadius: 61, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
     avatarWrapper: { width: 110, height: 110, borderRadius: 55, overflow: 'visible', position: 'relative' },
     avatarImage: { width: 110, height: 110, borderRadius: 55 },
     avatarFallback: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
     avatarInitial: { fontFamily: Font.font600, color: '#fff', fontSize: 44 },
     avatarName: { fontFamily: Font.font600, color: '#fff', fontSize: 20, letterSpacing: 0.3 },
     avatarEmail: { fontFamily: Font.font500 || Font.font600, color: 'rgba(255,255,255,0.6)', fontSize: 13 },
     editBadge: { position: 'absolute', bottom: 2, right: 2, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
     editBadgeGradient: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

     // ── Card ──
     card: {
          marginHorizontal: 16,
          borderRadius: 20,
          backgroundColor: colors.lightGreen,
          paddingHorizontal: 20,
          paddingVertical: 22,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
     },
     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
     cardTitle: { fontFamily: Font.font600, color: '#fff', fontSize: 18, letterSpacing: 0.2 },
     cardSub: { fontFamily: Font.font500 || Font.font600, color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 },

     editBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: 'rgba(255,255,255,0.18)',
          paddingHorizontal: 14,
          paddingVertical: 7,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.3)',
     },
     editBtnText: { fontFamily: Font.font600, color: '#fff', fontSize: 13 },

     // ── Field styles inside card ──
     fieldDiv: { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1 },
     fieldInput: { backgroundColor: 'transparent', color: '#fff', fontFamily: Font.font600, fontSize: 15, paddingHorizontal: 0 },

     // ── Buttons ──
     btnRow: { flexDirection: 'row', gap: 12 },
     cancelBtn: {
          flex: 1,
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.4)',
          backgroundColor: 'rgba(255,255,255,0.1)',
     },
     cancelBtnText: { fontFamily: Font.font600, color: '#fff', fontSize: 15 },
     saveBtn: { height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
     saveBtnText: { fontFamily: Font.font600, color: '#fff', fontSize: 15, letterSpacing: 0.3 },
     changePassBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, borderRadius: 12, backgroundColor: '#fff', marginTop: 4 },
     changePassText: { fontFamily: Font.font600, color: colors.PrimaryColor, fontSize: 14, textDecorationLine: 'underline', textDecorationColor: colors.PrimaryColor },

     // ── Modal ──
     ModalContainer: { justifyContent: 'center', alignItems: 'center', gap: 18, width: '100%' },
     modalHeader: { alignItems: 'center', width: '100%', position: 'relative', paddingBottom: 4 },
     modalIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.PrimaryColor + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
     modalTitle: { fontFamily: Font.font600, fontSize: 18, color: colors.textColor, letterSpacing: 0.2 },
     modalSub: { fontFamily: Font.font500 || Font.font600, fontSize: 12, color: colors.SecTextColor, marginTop: 3 },
     modalClose: { position: 'absolute', right: 0, top: 0 },
});
