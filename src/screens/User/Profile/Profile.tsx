import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Font from '../../../utils/fonts/Font';
import colors from '../../../utils/colors/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useProfileData } from '../../../model/Profile/ProfileModel';
import GradientBG from '../../../components/GradientBG/GradientBG';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import Skeleton from '../../../components/SkeletonComp/Skeleton';
import { useIsFocused } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import EditProfileScreen from './EditProfileScreen';
import { windowWidth } from '../../../utils/dimensions/dimensions';

interface DataTypes {
     profilePicture: string | undefined;
     username: string;
     email: string;
     phone: string;
     country: string;
     city: string;
     countryCode: string;
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
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: windowWidth - 150 }}>
                         <Text style={rowStyles.label}>{label}</Text>
                         {rightText ? rightText : null}
                    </View>
               </View>
          </View>
          {rightText ? null : displayValue == '' || displayValue == undefined ? (
               <FontAwesome5 name="info-circle" size={15} color="#F97316" />
          ) : (
               <FontAwesome5 name="chevron-right" size={10} color={'rgba(77, 77, 77, 0.6)'} />
          )}
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Profile = ({ navigation }: { navigation: Navigation }) => {
     const [imageLoading, setImageLoading] = useState(true);
     const [isEdit, setIsEdit] = useState(false);

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

     // APIS
     const getProfile = useProfileData({ Token: Token ?? '', id: id ?? '' });
     const userData = getProfile?.data?.profile;
     const isLoadingProfile = getProfile?.isLoading;

     const handleIsEdit = () => {
          setIsEdit(true);
     };

     const isFocused = useIsFocused();

     useEffect(() => {
          if (!isFocused) {
               setIsEdit(false);
          }
          return () => {
               setIsEdit(false);
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

     const profilePic = (userData as DataTypes)?.profilePicture;

     return (
          <>
               {!isEdit && (
                    <View style={{ flex: 1, backgroundColor: '#f4f0f0' }}>
                         <ScrollView contentContainerStyle={[styles.Container, { gap: 30 }]} showsVerticalScrollIndicator={false}>
                              <GradientBG style={styles.gradient} isBackgroundImage imgStyle={{ justifyContent: 'center' }}>
                                   <CustomHeader navigation={navigation} />

                                   <View style={{ marginTop: 50 }}>
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
                                             </View>
                                        </View>
                                   </View>
                              </GradientBG>
                              {/* ── Card ── */}
                              <View style={styles.card}>
                                   {/* Card header */}
                                   <View style={styles.cardHeader}>
                                        <View style={{}}>
                                             <Text style={styles.cardTitle}>Personal info</Text>
                                        </View>
                                        {!isEdit && (
                                             <TouchableOpacity style={styles.editBtn} onPress={handleIsEdit} disabled={isLoadingProfile} activeOpacity={0.8}>
                                                  <MaterialIcons name="edit" color={colors.PrimaryColor} size={15} />
                                                  <Text style={styles.editBtnText}>Edit</Text>
                                             </TouchableOpacity>
                                        )}
                                   </View>

                                   {/* Fields */}
                                   <ProfileRow
                                        label="Name"
                                        icon={<FontAwesome5 name="user-alt" size={18} color={colors.PrimaryColor} />}
                                        isEdit={isEdit}
                                        isLoading={!!isLoadingProfile}
                                        displayValue={userData?.username}
                                   />

                                   <ProfileRow
                                        label="Country"
                                        icon={<FontAwesome name="globe" size={18} color={colors.PrimaryColor} />}
                                        isEdit={isEdit}
                                        isLoading={!!isLoadingProfile}
                                        displayValue={userData?.country || undefined}
                                   />

                                   <ProfileRow
                                        label="City"
                                        icon={<MaterialIcons name="location-city" size={18} color={colors.PrimaryColor} />}
                                        isEdit={isEdit}
                                        isLoading={!!isLoadingProfile}
                                        displayValue={userData?.city.replace(userData?.country, '').replace(',', '') || undefined}
                                   />

                                   <ProfileRow
                                        label="Email"
                                        icon={<MaterialIcons name="email" size={18} color={colors.PrimaryColor} />}
                                        isEdit={isEdit}
                                        isLoading={!!isLoadingProfile}
                                        displayValue={userData?.email}
                                        rightText={
                                             <View style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#d1eee9', borderRadius: 100 }}>
                                                  <Text style={{ color: colors.PrimaryColor, fontFamily: Font.font700, fontSize: 12 }}>Verified</Text>
                                             </View>
                                        }
                                   />

                                   <ProfileRow
                                        label="Phone"
                                        icon={<FontAwesome name="phone" size={18} color={colors.PrimaryColor} />}
                                        isEdit={isEdit}
                                        isLoading={!!isLoadingProfile}
                                        displayValue={(userData as DataTypes)?.phone}
                                   />
                              </View>

                              {/* <View style={[styles.card]}>
                                   <View style={styles.cardHeader}>
                                        <View style={{}}>
                                             <Text style={styles.cardTitle}>Activity</Text>
                                        </View>
                                   </View>

                                   <ProfileRow
                                        label="Manage your darood history"
                                        icon={<Ionicons name="time" size={18} color={colors.PrimaryColor} />}
                                        isLoading={false}
                                        displayValue={'Darood History Management'}
                                        onPress={() => navigation.navigate('History')}
                                   />
                              </View> */}

                              <View style={[styles.card, { marginBottom: 30 }]}>
                                   {/* Card header */}
                                   <View style={styles.cardHeader}>
                                        <View style={{}}>
                                             <Text style={styles.cardTitle}>Settings</Text>
                                        </View>
                                   </View>

                                   {/* Fields */}
                                   <ProfileRow
                                        label="Check your settings"
                                        icon={<Ionicons name="settings" size={18} color={colors.PrimaryColor} />}
                                        isLoading={false}
                                        displayValue={'Setting'}
                                        onPress={() => navigation.navigate('SettingScreen')}
                                   />
                              </View>
                         </ScrollView>
                    </View>
               )}
               {isEdit && <EditProfileScreen goBack={() => setIsEdit(false)} />}
          </>
     );
};

export default Profile;

const styles = StyleSheet.create({
     Container: { width: '100%', gap: 0, justifyContent: 'center', backgroundColor: '#f4f0f0b9' },
     gradient: { borderBottomRightRadius: 20, borderBottomLeftRadius: 20, width: '100%', justifyContent: 'center', paddingTop: 14 },

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
     cardSub: { fontFamily: Font.font500 || Font.font600, color: colors.SecTextColor, fontSize: 12, marginTop: 2 },

     editBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 7,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.PrimaryColor,
     },
     editBtnText: { fontFamily: Font.font600, color: colors.PrimaryColor, fontSize: 13 },
});
