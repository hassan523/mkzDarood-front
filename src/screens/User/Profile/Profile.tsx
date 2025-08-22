import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Font from '../../../utils/fonts/Font';
import colors from '../../../utils/colors/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Button from '../../../components/Button/Button';
import Field from '../../../components/Field/Field';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
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

interface DataTypes {
     profilePicture: string | undefined;
     username: string;
     email: string;
     phone: string;
     country?: string;
     city?: string;
}

const Profile = ({ navigation }: { navigation: Navigation }) => {
     const [updateData, setUpdateData] = useState<DataTypes>({ profilePicture: '', username: '', email: '', phone: '', country: '', city: '' });
     const [isEdit, setIsEdit] = useState(false);
     const [isOpen, setIsOpen] = useState(false);
     const [isFocused, setIsFocused] = useState(false);
     const [changePassword, setChangePassword] = useState({
          password: '',
          newPass: '',
          reNewPass: '',
     });

     const selector = useSelector((state: RootState) => state?.userData);
     const id: string | undefined = selector?.data?.user?._id;
     const Token: string | undefined = selector?.data?.accessToken;

     const { password, newPass, reNewPass } = changePassword;

     const { handleUpdateProfile, handleChangePassword, isLoading } = useUpdateProfile();

     const getProfile = useProfileData({ Token: Token ?? '', id: id ?? '' });
     const userData = getProfile?.data?.profile;
     const isLoadingProfile = getProfile?.isLoading;

     const handleIsEdit = () => {
          setUpdateData(userData as user);
          setIsEdit(true);
     };

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setUpdateData({ ...updateData, [name]: value });
     };

     const handleSave = () => {
          handleUpdateProfile({
               id: id,
               Token: Token,
               profilePicture: updateData?.profilePicture || '',
               setIsEdit: setIsEdit,
               country: updateData?.country,
               city: updateData?.city,
               username: updateData?.username,
               phone: updateData?.phone,
          });
     };

     const handleChangePass = () => {
          handleChangePassword({ id: id, Token: Token, oldPassword: password, newPassword: newPass, reEnter: reNewPass, setIsEdit: setIsOpen });
     };

     const pickImage = async () => {
          if (!isEdit) return;

          const options: ImageLibraryOptions = {
               mediaType: 'photo',
               quality: 0.8,
               maxWidth: 500,
               maxHeight: 500,
               includeBase64: false,
          };

          launchImageLibrary(options, response => {
               if (response.didCancel) {
                    console.log('User cancelled image picker');
               } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
               } else if (response.assets && response.assets.length > 0) {
                    const firstAsset: Asset = response.assets[0];
                    setUpdateData({
                         ...updateData,
                         profilePicture: firstAsset.uri || '',
                    });
               }
          });
     };

     const isKeyboardVisible = useKeyboardStatus();

     return (
          <View style={{ flex: 1 }}>
               <GradientBG style={styles.gradient} isBackgroundImage imgStyle={{ height: windowHeight, justifyContent: 'center' }}>
                    <ScrollView contentContainerStyle={[styles.Container, { paddingBottom: isKeyboardVisible ? 500 : 100 }]} showsVerticalScrollIndicator={false}>
                         <CustomHeader navigation={navigation} />
                         <View
                              style={{
                                   marginTop: 100,
                              }}
                         >
                              <View style={styles.ImageContainer}>
                                   <View style={styles.ImageWrapper}>
                                        {isLoadingProfile ? (
                                             <ActivityIndicator size="large" color={colors.SecondaryColor} style={{ alignItems: 'center', justifyContent: 'center', top: 40 }} />
                                        ) : isEdit && updateData.profilePicture ? (
                                             <Image
                                                  source={{
                                                       uri: updateData.profilePicture === (userData as DataTypes)?.profilePicture ? `${updateData.profilePicture}` : updateData.profilePicture,
                                                  }}
                                                  style={styles.Image}
                                             />
                                        ) : (userData as DataTypes)?.profilePicture ? (
                                             <Image source={{ uri: `${(userData as DataTypes)?.profilePicture}` }} style={styles.Image} />
                                        ) : (
                                             <View style={styles.Avatar}>
                                                  <Text style={styles.AvatarText}>{userData?.username?.charAt(0)?.toUpperCase()}</Text>
                                             </View>
                                        )}
                                        {isEdit && (
                                             <TouchableOpacity style={styles.ImageEdit} onPress={pickImage} disabled={isLoadingProfile}>
                                                  <MaterialIcons name="edit" color={colors.PrimaryColor} size={20} />
                                             </TouchableOpacity>
                                        )}
                                   </View>
                              </View>
                              <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                   <View style={styles.DataContainer}>
                                        <View style={styles.HeaderContainer}>
                                             <Text style={styles.Value}>Profile Details</Text>
                                             {!isEdit && (
                                                  <TouchableOpacity style={styles.Edit} onPress={handleIsEdit} disabled={isLoadingProfile}>
                                                       <Text style={[styles.Value, { fontFamily: Font.font700, fontSize: 16 }]}>Edit</Text>
                                                       <MaterialIcons name="edit" color={colors.SecondaryColor} size={20} />
                                                  </TouchableOpacity>
                                             )}
                                        </View>
                                        <View>
                                             <View
                                                  style={[
                                                       styles.FieldContainer,
                                                       {
                                                            flexDirection: isEdit ? 'column' : 'row',
                                                            justifyContent: 'space-between',
                                                            borderTopWidth: isEdit ? 0 : 1,
                                                            borderColor: 'lightgray',
                                                            paddingBlock: isEdit ? 5 : 15,
                                                       },
                                                  ]}
                                             >
                                                  <Text style={styles.FieldLabel}>Name</Text>
                                                  {isEdit ? (
                                                       <Field
                                                            placeHolder="Enter Usename"
                                                            type="text"
                                                            isIcon={<FontAwesome5 name="user-alt" size={20} color={colors.SecondaryColor} />}
                                                            value={updateData.username}
                                                            onChange={value => handleData({ name: 'username', value })}
                                                            onFocus={() => setIsFocused(true)}
                                                            onBlur={() => setIsFocused(false)}
                                                            customDivClass={{ backgroundColor: colors.lightGreen, borderColor: colors.SecondaryColor, borderWidth: 1 }}
                                                            customClass={{
                                                                 backgroundColor: colors.lightGreen,
                                                                 borderColor: colors.SecondaryColor,
                                                                 borderWidth: 0,
                                                                 color: colors.SecondaryColor,
                                                                 fontFamily: Font.font600,
                                                                 fontSize: 16,
                                                            }}
                                                            iconColor="white"
                                                            disabled={isLoading}
                                                       />
                                                  ) : isLoadingProfile ? (
                                                       <Skeleton width={120} height={10} borderRadius={5} />
                                                  ) : (
                                                       <Text style={styles.Value}>{userData?.username || 'Name'}</Text>
                                                  )}
                                             </View>
                                             <View
                                                  style={[
                                                       styles.FieldContainer,
                                                       {
                                                            flexDirection: isEdit ? 'column' : 'row',
                                                            justifyContent: 'space-between',
                                                            borderTopWidth: isEdit ? 0 : 1,
                                                            borderColor: 'lightgray',
                                                            paddingBlock: isEdit ? 5 : 15,
                                                       },
                                                  ]}
                                             >
                                                  <Text style={styles.FieldLabel}>Country</Text>
                                                  {isEdit ? (
                                                       <Field
                                                            placeHolder="Add your country"
                                                            placeHolderTextColor="white"
                                                            type="text"
                                                            isIcon={<Fontisto name="world-o" size={20} color={colors.SecondaryColor} />}
                                                            value={updateData.country}
                                                            onChange={value => handleData({ name: 'country', value })}
                                                            onFocus={() => setIsFocused(true)}
                                                            onBlur={() => setIsFocused(false)}
                                                            customDivClass={{ backgroundColor: colors.lightGreen, borderColor: colors.SecondaryColor, borderWidth: 1 }}
                                                            customClass={{
                                                                 backgroundColor: colors.lightGreen,
                                                                 borderColor: colors.SecondaryColor,
                                                                 borderWidth: 0,
                                                                 color: colors.SecondaryColor,
                                                                 fontFamily: Font.font600,
                                                                 fontSize: 16,
                                                            }}
                                                            iconColor="white"
                                                            disabled={isLoading}
                                                       />
                                                  ) : isLoadingProfile ? (
                                                       <Skeleton width={120} height={10} borderRadius={5} />
                                                  ) : (
                                                       <Text style={styles.Value}>{userData?.country || 'Add Country'}</Text>
                                                  )}
                                             </View>
                                             <View
                                                  style={[
                                                       styles.FieldContainer,
                                                       {
                                                            flexDirection: isEdit ? 'column' : 'row',
                                                            justifyContent: 'space-between',
                                                            borderTopWidth: isEdit ? 0 : 1,
                                                            borderColor: 'lightgray',
                                                            paddingBlock: isEdit ? 5 : 15,
                                                       },
                                                  ]}
                                             >
                                                  <Text style={styles.FieldLabel}>City</Text>
                                                  {isEdit ? (
                                                       <Field
                                                            placeHolder="Add your city"
                                                            type="text"
                                                            isIcon={<Fontisto name="world-o" size={20} color={colors.SecondaryColor} />}
                                                            placeHolderTextColor="white"
                                                            value={updateData.city}
                                                            onChange={value => handleData({ name: 'city', value })}
                                                            onFocus={() => setIsFocused(true)}
                                                            onBlur={() => setIsFocused(false)}
                                                            customDivClass={{ backgroundColor: colors.lightGreen, borderColor: colors.SecondaryColor, borderWidth: 1 }}
                                                            customClass={{
                                                                 backgroundColor: colors.lightGreen,
                                                                 borderColor: colors.SecondaryColor,
                                                                 borderWidth: 0,
                                                                 color: colors.SecondaryColor,
                                                                 fontFamily: Font.font600,
                                                                 fontSize: 16,
                                                            }}
                                                            iconColor="white"
                                                            disabled={isLoading}
                                                       />
                                                  ) : isLoadingProfile ? (
                                                       <Skeleton width={120} height={10} borderRadius={5} />
                                                  ) : (
                                                       <Text style={styles.Value}>{userData?.city || 'Add City'}</Text>
                                                  )}
                                             </View>
                                             <View
                                                  style={[
                                                       styles.FieldContainer,
                                                       {
                                                            flexDirection: isEdit ? 'column' : 'row',
                                                            justifyContent: 'space-between',
                                                            borderTopWidth: isEdit ? 0 : 1,
                                                            borderColor: 'lightgray',
                                                            paddingBlock: isEdit ? 5 : 15,
                                                            alignItems: 'center',
                                                       },
                                                  ]}
                                             >
                                                  <Text style={styles.FieldLabel}>Email</Text>
                                                  {isEdit ? (
                                                       <Field
                                                            placeHolder="Enter Email"
                                                            type="email"
                                                            isIcon
                                                            value={updateData.email}
                                                            onChange={value => handleData({ name: 'email', value })}
                                                            onFocus={() => setIsFocused(true)}
                                                            onBlur={() => setIsFocused(false)}
                                                            customDivClass={{ backgroundColor: colors.lightGreen, borderColor: colors.SecondaryColor, borderWidth: 1 }}
                                                            customClass={{
                                                                 backgroundColor: colors.lightGreen,
                                                                 borderColor: colors.SecondaryColor,
                                                                 borderWidth: 0,
                                                                 color: colors.SecondaryColor,
                                                                 fontFamily: Font.font600,
                                                                 fontSize: 16,
                                                            }}
                                                            iconColor="white"
                                                            disabled
                                                       />
                                                  ) : isLoadingProfile ? (
                                                       <Skeleton width={120} height={10} borderRadius={5} />
                                                  ) : (
                                                       <Text style={styles.Value}>{userData?.email}</Text>
                                                  )}
                                             </View>
                                             <View
                                                  style={[
                                                       styles.FieldContainer,
                                                       {
                                                            marginBottom: 15,
                                                            flexDirection: isEdit ? 'column' : 'row',
                                                            justifyContent: 'space-between',
                                                            borderTopWidth: isEdit ? 0 : 1,
                                                            borderBottomWidth: isEdit ? 0 : 1,
                                                            borderColor: 'lightgray',
                                                            paddingBlock: isEdit ? 5 : 15,
                                                       },
                                                  ]}
                                             >
                                                  <Text style={styles.FieldLabel}>Phone Number</Text>
                                                  {isEdit ? (
                                                       <Field
                                                            placeHolder="Enter Phone Number"
                                                            type="text"
                                                            isIcon={<FontAwesome name="phone" size={20} color={colors.SecondaryColor} />}
                                                            value={updateData.phone}
                                                            onChange={value => handleData({ name: 'phone', value })}
                                                            onFocus={() => setIsFocused(true)}
                                                            onBlur={() => setIsFocused(false)}
                                                            customDivClass={{ backgroundColor: colors.lightGreen, borderColor: colors.SecondaryColor, borderWidth: 1 }}
                                                            customClass={{
                                                                 backgroundColor: colors.lightGreen,
                                                                 borderColor: colors.SecondaryColor,
                                                                 borderWidth: 0,
                                                                 color: colors.SecondaryColor,
                                                                 fontFamily: Font.font600,
                                                                 fontSize: 16,
                                                            }}
                                                            iconColor="white"
                                                            disabled={isLoading}
                                                       />
                                                  ) : isLoadingProfile ? (
                                                       <Skeleton width={120} height={10} borderRadius={5} />
                                                  ) : (
                                                       <Text style={styles.Value}>{(userData as DataTypes)?.phone}</Text>
                                                  )}
                                             </View>
                                        </View>

                                        {isEdit ? (
                                             <View style={styles.BtnContainer}>
                                                  <TouchableOpacity style={[styles.Btn, { backgroundColor: colors.SecondaryColor }]} onPress={() => setIsEdit(false)} disabled={isLoading}>
                                                       <Text style={[styles.Value, { color: colors.PrimaryColor }]}>Cancel</Text>
                                                  </TouchableOpacity>
                                                  <TouchableOpacity style={[styles.Btn, { backgroundColor: colors.lightGreen }]} onPress={handleSave}>
                                                       {isLoading ? <Text style={[styles.Value]}>Saving...</Text> : <Text style={[styles.Value]}>Save</Text>}
                                                  </TouchableOpacity>
                                             </View>
                                        ) : (
                                             <TouchableOpacity style={[styles.Btn, { backgroundColor: colors.lightGreen }]} onPress={() => setIsOpen(true)} disabled={isLoadingProfile}>
                                                  <Text
                                                       style={{
                                                            color: colors.SecondaryColor,
                                                            fontSize: 15,
                                                            fontFamily: Font.font600,
                                                            textDecorationLine: 'underline',
                                                            textDecorationColor: colors.SecondaryColor,
                                                       }}
                                                  >
                                                       Change Password
                                                  </Text>
                                             </TouchableOpacity>
                                        )}
                                   </View>
                              </View>
                              <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
                                   <View style={styles.ModalContainer}>
                                        <View style={{ flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'space-between' }}>
                                             <Entypo name="cross" color={'white'} size={25} />
                                             <Text style={[styles.Heading, { color: colors.PrimaryColor, marginTop: 10 }]}>Change Password</Text>
                                             <TouchableOpacity style={styles.Cross} onPress={() => setIsOpen(false)} disabled={isLoading}>
                                                  <Entypo name="cross" color={colors.textColor} size={25} />
                                             </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '100%', gap: 20 }}>
                                             <View style={styles.FieldContainer}>
                                                  <Field
                                                       placeHolder="Enter Current Password"
                                                       type="password"
                                                       value={password}
                                                       onChange={value => setChangePassword({ ...changePassword, password: value })}
                                                       disabled={isLoading}
                                                  />
                                             </View>
                                             <View style={styles.FieldContainer}>
                                                  <Field
                                                       placeHolder="Enter New Password"
                                                       type="password"
                                                       isIcon
                                                       value={newPass}
                                                       onChange={value => setChangePassword({ ...changePassword, newPass: value })}
                                                       disabled={isLoading}
                                                  />
                                             </View>
                                             <View style={styles.FieldContainer}>
                                                  <Field
                                                       placeHolder="Re-Enter New Password"
                                                       type="password"
                                                       isIcon
                                                       value={reNewPass}
                                                       onChange={value => setChangePassword({ ...changePassword, reNewPass: value })}
                                                       disabled={isLoading}
                                                  />
                                             </View>
                                        </View>
                                        <Button name="Save" onPress={handleChangePass} isLoading={isLoading} disabled={isLoading} />
                                   </View>
                              </ModalLayout>
                         </View>
                    </ScrollView>
               </GradientBG>
          </View>
     );
};

export default Profile;

const styles = StyleSheet.create({
     Container: {
          width: '100%',
          gap: 25,
          justifyContent: 'center',
     },
     gradient: {
          borderRadius: 0,
          width: '100%',
          justifyContent: 'center',
          paddingTop: 20,
     },
     Heading: {
          fontFamily: Font.font600,
          fontSize: 18,
          color: colors.textColor,
     },
     ImageContainer: {
          marginBottom: 35,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
     },
     ImageWrapper: {
          height: 120,
          width: 120,
          position: 'relative',
     },
     Avatar: {
          height: 120,
          width: 120,
          backgroundColor: colors.PrimaryColor,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1000,
     },
     AvatarText: {
          fontFamily: Font.font600,
          color: colors.SecondaryColor,
          fontSize: 50,
     },
     ImageEdit: {
          position: 'absolute',
          height: 35,
          width: 35,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.SecondaryColor,
          borderRadius: 1000,
          bottom: 0,
          right: 0,
          borderWidth: 1,
          borderColor: colors.PrimaryColor,
     },
     Image: {
          height: 120,
          width: 120,
          borderRadius: 1000,
     },
     DataContainer: {
          gap: 15,
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderWidth: 1,
          borderColor: 'lightgray',
          borderRadius: 10,
          backgroundColor: colors.lightGreen,
     },
     Value: {
          fontFamily: Font.font600,
          color: colors.SecondaryColor,
          fontSize: 18,
     },
     HeaderContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },
     Edit: {
          gap: 5,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          paddingInline: 20,
          paddingBlock: 8,
          borderColor: 'white',
          borderRadius: 1000,
     },
     FieldContainer: {
          width: '100%',
          gap: 10,
          borderBlockColor: 'white',
     },
     Label: {
          fontFamily: Font.font700,
          fontSize: 15,
          color: colors.terTextColor,
     },
     FieldLabel: {
          fontFamily: Font.font700,
          fontSize: 18,
          color: colors.SecondaryColor,
     },
     ModalContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          gap: 20,
     },
     Cross: {
          left: 5,
          top: 5,
     },
     BtnContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          flexDirection: 'row',
          paddingHorizontal: 20,
     },
     Btn: {
          width: windowWidth / 2 - 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.SecondaryColor,
          borderRadius: 400,
     },
});
