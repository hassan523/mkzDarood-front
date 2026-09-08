import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useProfileData, useUpdateProfile } from '../../../model/Profile/ProfileModel';
import { user } from '../../../redux/Auth/AuthType';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../components/GradientBG/GradientBG';
import Field from '../../../components/Field/Field';
import Skeleton from '../../../components/SkeletonComp/Skeleton';
import AddressAutocomplete from '../../../components/AddressAutocomplete/AddressAutocomplete';
import ResToast from '../../../components/ResToast/ResToast';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import { getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import useKeyboardStatus from '../../../utils/IsKeyboardStatus/useKeyboardStatus';

interface DataTypes {
     profilePicture: string | undefined;
     username: string;
     email: string;
     phone: string;
     country: string;
     city: string;
     countryCode: string;
}

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ title }: { title: string }) => <Text style={sectionStyles.label}>{title}</Text>;
const sectionStyles = StyleSheet.create({
     label: {
          fontFamily: Font.font700,
          fontSize: 11,
          color: colors.PrimaryColor,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 6,
          marginTop: 18,
          paddingHorizontal: 20,
     },
});

// ─── Field Row ────────────────────────────────────────────────────────────────
const FieldRow = ({ icon, iconBg, children, isLast }: { icon: React.ReactNode; iconBg?: string; children: React.ReactNode; isLast?: boolean }) => (
     <View style={[fieldRowStyles.wrap, !isLast && fieldRowStyles.border]}>
          <View style={[fieldRowStyles.iconBox, { backgroundColor: iconBg || '#d1eee9' }]}>{icon}</View>
          <View style={{ flex: 1 }}>{children}</View>
     </View>
);
const fieldRowStyles = StyleSheet.create({
     wrap: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 6,
          paddingHorizontal: 16,
     },
     border: {
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c540',
     },
     iconBox: {
          width: 40,
          height: 40,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
     },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const EditProfileScreen = ({ goBack }: { goBack: any }) => {
     const [imageLoading, setImageLoading] = useState(true);
     const [visible, setVisible] = useState(false);
     const [updateData, setUpdateData] = useState<DataTypes>({
          profilePicture: '',
          username: '',
          email: '',
          phone: '',
          country: '',
          city: '',
          countryCode: '',
     });

     const selector = useSelector((state: RootState) => state?.userData);
     const id = selector?.data?.user?._id;
     const Token = selector?.data?.accessToken;

     const { handleUpdateProfile, isLoading, status } = useUpdateProfile();
     const getProfile = useProfileData({ Token: Token ?? '', id: id ?? '' });
     const userData = getProfile?.data?.profile;
     const isLoadingProfile = getProfile?.isLoading;

     const isKeyboardVisible = useKeyboardStatus();

     // Pre-fill data on mount
     useEffect(() => {
          if (userData) setUpdateData(userData as DataTypes);
     }, [userData]);

     const handleData = ({ name, value }: { name: string; value: string }) => setUpdateData(prev => ({ ...prev, [name]: value }));

     const code = getCountryCallingCode((updateData?.countryCode as any)?.toUpperCase() || 'PK');

     const validatePhone = (phone: string, country: any) => {
          const parsed = parsePhoneNumberFromString(phone, country);
          return parsed?.isValid() || false;
     };

     const handleSave = () => {
          if (!updateData.username) return ResToast({ title: 'Please enter your name', type: 'warning' });
          if (!updateData.country) return ResToast({ title: 'Please enter country', type: 'warning' });
          if (!updateData.countryCode) return ResToast({ title: 'Please select country', type: 'warning' });
          if (!updateData.city) return ResToast({ title: 'Please enter city', type: 'warning' });
          if (!updateData.phone) return ResToast({ title: 'Please enter phone', type: 'warning' });

          const isValid = validatePhone(updateData.phone || '0', updateData.countryCode?.toUpperCase());
          if (!isValid) return ResToast({ title: 'Invalid Phone Number', type: 'warning' });

          handleUpdateProfile({
               id,
               Token,
               profilePicture: updateData.profilePicture || '',
               setIsEdit: () => goBack(),
               country: updateData.country,
               city: updateData.city,
               countryCode: updateData.countryCode,
               username: updateData.username,
               phone: updateData.phone,
          });
          setVisible(true);
     };

     const pickImage = () => {
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

     const profilePic = updateData.profilePicture;

     return (
          <View style={{ flex: 1, backgroundColor: '#f4f0f0' }}>
               {!visible && (
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                         <ScrollView contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 400 : 40 }} showsVerticalScrollIndicator={false}>
                              {/* ── Header ── */}
                              <GradientBG style={styles.gradientHeader} isBackgroundImage imgStyle={{ justifyContent: 'center' }}>
                                   {/* Back + Title */}
                                   <View style={styles.topRow}>
                                        <TouchableOpacity onPress={() => goBack()} style={styles.backBtn} activeOpacity={0.8}>
                                             <MaterialIcons name="arrow-back" color="#fff" size={20} />
                                        </TouchableOpacity>
                                        <Text style={styles.screenTitle}>Edit Profile</Text>
                                        <View style={{ width: 38 }} />
                                   </View>

                                   {/* Avatar */}
                                   <View style={styles.avatarSection}>
                                        <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.avatarTouch}>
                                             {isLoadingProfile ? (
                                                  <Skeleton width={100} height={100} borderRadius={50} />
                                             ) : profilePic ? (
                                                  <Image
                                                       source={profilePic ? { uri: profilePic } : require('../../../assets/DummyPost.png')}
                                                       style={styles.avatarImg}
                                                       onError={() => setImageLoading(false)}
                                                       onLoad={() => setImageLoading(false)}
                                                  />
                                             ) : (
                                                  <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} style={styles.avatarFallback}>
                                                       <Text style={styles.avatarInitial}>{userData?.username?.charAt(0)?.toUpperCase()}</Text>
                                                  </LinearGradient>
                                             )}

                                             {/* Camera Badge */}
                                             <View style={styles.cameraBadge}>
                                                  <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} style={styles.cameraBadgeGrad}>
                                                       <MaterialIcons name="photo-camera" color="#fff" size={14} />
                                                  </LinearGradient>
                                             </View>
                                        </TouchableOpacity>

                                        <Text style={styles.tapHint}>Tap to change photo</Text>
                                   </View>
                              </GradientBG>

                              {/* ── Form Card ── */}
                              <View style={styles.formCard}>
                                   <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>Personal Info</Text>
                                   </View>

                                   <SectionLabel title="Full Name" />
                                   <FieldRow icon={<FontAwesome5 name="user-alt" size={15} color={colors.PrimaryColor} />}>
                                        <Field
                                             placeHolder="Enter your name"
                                             type="text"
                                             value={updateData.username}
                                             onChange={value => handleData({ name: 'username', value })}
                                             customDivClass={styles.fieldBox}
                                             customClass={styles.fieldText}
                                             disabled={isLoading}
                                        />
                                   </FieldRow>

                                   <SectionLabel title="Country" />
                                   <FieldRow icon={<FontAwesome name="globe" size={15} color={colors.PrimaryColor} />}>
                                        <AddressAutocomplete
                                             type="country"
                                             value={updateData.country}
                                             onChangeText={value => {
                                                  handleData({ name: 'country', value });
                                                  setUpdateData(prev => ({
                                                       ...prev,
                                                       city: '',
                                                       countryCode: '',
                                                  }));
                                             }}
                                             placeholder="Enter your country"
                                             apiKey="AIzaSyClo7scOstr59xuT6Y-sKNPodDQGnrtPhE"
                                             iconName="city"
                                             setCountryCode={value =>
                                                  setUpdateData((prev: any) => ({
                                                       ...prev,
                                                       countryCode: value,
                                                  }))
                                             }
                                        />
                                   </FieldRow>

                                   <SectionLabel title="City" />
                                   <FieldRow icon={<MaterialIcons name="location-city" size={15} color={colors.PrimaryColor} />}>
                                        <AddressAutocomplete
                                             type="city"
                                             value={updateData.city.replace(updateData?.country, '').replace(',', '')}
                                             onChangeText={value => handleData({ name: 'city', value })}
                                             placeholder="Enter your city"
                                             apiKey="AIzaSyClo7scOstr59xuT6Y-sKNPodDQGnrtPhE"
                                             countryCode={updateData?.countryCode}
                                        />
                                   </FieldRow>

                                   <SectionLabel title="Email" />
                                   <FieldRow icon={<MaterialIcons name="email" size={15} color={colors.PrimaryColor} />}>
                                        <View style={styles.emailRow}>
                                             <Field
                                                  placeHolder="Email"
                                                  type="email"
                                                  value={updateData.email}
                                                  onChange={() => {}}
                                                  customDivClass={[styles.fieldBox, { flex: 1, borderColor: 'transparent' }]}
                                                  customClass={styles.fieldText}
                                                  disabled
                                             />
                                        </View>
                                   </FieldRow>

                                   <SectionLabel title="Phone Number" />
                                   <FieldRow icon={<FontAwesome name="phone" size={15} color={colors.PrimaryColor} />} isLast>
                                        <View style={styles.phoneRow}>
                                             <View style={styles.codeBox}>
                                                  <Text style={styles.codeText}>{code ? `+${code}` : '0'}</Text>
                                             </View>
                                             <View style={[styles.fieldBox, styles.phoneInput]}>
                                                  <Field
                                                       placeHolder="Phone Number"
                                                       type="number"
                                                       value={updateData.phone}
                                                       onChange={value => handleData({ name: 'phone', value })}
                                                       customDivClass={{
                                                            backgroundColor: 'transparent',
                                                            borderWidth: 0,
                                                            flex: 1,
                                                       }}
                                                       customClass={styles.fieldText}
                                                       disabled={isLoading}
                                                       maxLength={12}
                                                       minValue={10}
                                                       validate
                                                  />
                                             </View>
                                        </View>
                                   </FieldRow>
                              </View>

                              {/* ── Buttons ── */}
                              <View style={styles.buttonsWrap}>
                                   <TouchableOpacity style={styles.cancelBtn} onPress={() => goBack()} activeOpacity={0.8} disabled={isLoading}>
                                        <Text style={styles.cancelText}>Cancel</Text>
                                   </TouchableOpacity>

                                   <TouchableOpacity style={{ flex: 1 }} onPress={handleSave} activeOpacity={0.85} disabled={isLoading}>
                                        <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} style={styles.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                             <MaterialIcons name="check" color="#fff" size={18} />
                                             <Text style={styles.saveText}>{isLoading ? 'Saving...' : 'Save Changes'}</Text>
                                        </LinearGradient>
                                   </TouchableOpacity>
                              </View>
                         </ScrollView>
                    </KeyboardAvoidingView>
               )}

               {/* Loading Overlay */}
               {visible && (
                    <LoadingScreen
                         status={status}
                         onHide={() => {
                              setVisible(false);
                              goBack();
                         }}
                         image={require('../../../assets/LoadingLogo.png')}
                         loadingTitle="Updating Profile..."
                         successTitle="All done!"
                         successSubtitle="Profile updated successfully"
                         imageSize={70}
                         errorTitle="Something went wrong"
                         errorSubtitle="Please try again later"
                         hideDelay={2000}
                         backgroundColor={colors.SecondaryColor}
                         style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 999,
                         }}
                    />
               )}
          </View>
     );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
     gradientHeader: {
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          paddingTop: 14,
          paddingBottom: 30,
     },

     // ── Top nav ──
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

     // ── Avatar ──
     avatarSection: { alignItems: 'center' },
     avatarTouch: { position: 'relative' },
     avatarImg: { width: 100, height: 100, borderRadius: 50 },
     avatarFallback: {
          width: 100,
          height: 100,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
     },
     avatarInitial: { fontFamily: Font.font600, color: '#fff', fontSize: 40 },
     cameraBadge: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          borderRadius: 16,
          overflow: 'hidden',
          elevation: 4,
     },
     cameraBadgeGrad: {
          width: 28,
          height: 28,
          alignItems: 'center',
          justifyContent: 'center',
     },
     tapHint: {
          fontFamily: Font.font500 || Font.font600,
          color: 'rgba(255,255,255,0.65)',
          fontSize: 12,
          marginTop: 10,
     },

     // ── Form Card ──
     formCard: {
          marginHorizontal: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          borderRadius: 20,
          paddingBottom: 10,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
     },
     cardHeader: {
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c540',
          marginBottom: 2,
     },
     cardTitle: {
          fontFamily: Font.font700,
          fontSize: 16,
          color: colors.PrimaryColor,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
     },

     // ── Fields ──
     fieldBox: {
          backgroundColor: '#f7fafa',
          borderColor: '#e0eeec',
          borderWidth: 1,
          borderRadius: 10,
     },
     fieldText: {
          color: '#1a1a1a',
          fontFamily: Font.font600,
          fontSize: 15,
     },

     // ── Email row ──
     emailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
     },
     verifiedBadge: {
          paddingHorizontal: 12,
          paddingVertical: 5,
          backgroundColor: '#d1eee9',
          borderRadius: 100,
     },
     verifiedText: {
          color: colors.PrimaryColor,
          fontFamily: Font.font700,
          fontSize: 11,
     },

     // ── Phone ──
     phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
     codeBox: {
          height: 48,
          paddingHorizontal: 12,
          backgroundColor: '#f7fafa',
          borderWidth: 1,
          borderColor: '#e0eeec',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          justifyContent: 'center',
          minWidth: 64,
          alignItems: 'center',
     },
     codeText: {
          fontFamily: Font.font600,
          fontSize: 14,
          color: colors.PrimaryColor,
     },
     phoneInput: {
          flex: 1,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          height: 48,
          justifyContent: 'center',
          paddingLeft: 10,
     },

     // ── Buttons ──
     buttonsWrap: {
          flexDirection: 'row',
          gap: 12,
          marginHorizontal: 16,
          marginTop: 20,
     },
     cancelBtn: {
          flex: 1,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: colors.PrimaryColor,
          backgroundColor: '#fff',
     },
     cancelText: {
          fontFamily: Font.font600,
          color: colors.PrimaryColor,
          fontSize: 15,
     },
     saveBtn: {
          height: 50,
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 8,
     },
     saveText: {
          fontFamily: Font.font600,
          color: '#fff',
          fontSize: 15,
          letterSpacing: 0.3,
     },
});
