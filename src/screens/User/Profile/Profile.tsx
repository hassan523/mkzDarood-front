import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Font from '../../../utils/fonts/Font';
import colors from '../../../utils/colors/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../../components/Button/Button';
import Field from '../../../components/Field/Field';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import ModalLayout from '../../../layout/ModalLayout/ModalLayout';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import API_BASE_URL from '../../../utils/Config';
import { useProfileData, useUpdateProfile } from '../../../model/Profile/ProfileModel';
import { user } from '../../../redux/Auth/AuthType';

interface DataTypes {
     profilePicture: string | undefined;
     username: string;
     email: string;
     phone: string;
}

const Profile = () => {
     const [updateData, setUpdateData] = useState<DataTypes>({ profilePicture: '', username: '', email: '', phone: '' });
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

     const handleIsEdit = () => {
          setUpdateData(userData as user);
          setIsEdit(true);
     };

     const handleData = ({ name, value }: { name: string; value: string }) => {
          setUpdateData({ ...updateData, [name]: value });
     };

     const handleSave = () => {
          handleUpdateProfile({ id: id, Token: Token, profilePicture: updateData?.profilePicture || '', setIsEdit: setIsEdit });
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

     return (
          <View style={styles.Container}>
               <ScrollView contentContainerStyle={[styles.ContainerWrapper, { paddingBottom: isFocused ? 400 : 0 }]} showsVerticalScrollIndicator={false}>
                    <Text style={styles.Heading}>Profile</Text>
                    <View style={styles.ImageContainer}>
                         {isEdit && updateData.profilePicture ? (
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
                              <TouchableOpacity style={styles.ImageEdit} onPress={pickImage}>
                                   <MaterialIcons name="edit" color={colors.PrimaryColor} size={20} />
                              </TouchableOpacity>
                         )}
                    </View>
                    <View style={styles.DataContainer}>
                         <View style={styles.HeaderContainer}>
                              <Text style={styles.Value}>Profile Details</Text>
                              {!isEdit && (
                                   <TouchableOpacity style={styles.Edit} onPress={handleIsEdit}>
                                        <Text style={[styles.Value, { fontFamily: Font.font700 }]}>Edit</Text>
                                        <MaterialIcons name="edit" color={colors.PrimaryColor} size={20} />
                                   </TouchableOpacity>
                              )}
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Username</Text>
                              {false ? (
                                   <Field
                                        placeHolder="Enter Usename"
                                        type="text"
                                        isIcon={<FontAwesome5 name="user-alt" size={20} color={colors.PrimaryColor} />}
                                        value={updateData.username}
                                        onChange={value => handleData({ name: 'username', value })}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                   />
                              ) : (
                                   <Text style={styles.Value}>{userData?.username}</Text>
                              )}
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Email</Text>
                              {false ? (
                                   <Field
                                        placeHolder="Enter Email"
                                        type="email"
                                        isIcon
                                        value={updateData.email}
                                        onChange={value => handleData({ name: 'email', value })}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                   />
                              ) : (
                                   <Text style={styles.Value}>{userData?.email}</Text>
                              )}
                         </View>
                         <View style={[styles.FieldContainer, { marginBottom: 15 }]}>
                              <Text style={styles.Label}>Phone Number</Text>
                              {false ? (
                                   <Field
                                        placeHolder="Enter Phone Number"
                                        type="text"
                                        isIcon={<FontAwesome name="phone" size={20} color={colors.PrimaryColor} />}
                                        value={updateData.phone}
                                        onChange={value => handleData({ name: 'phone', value })}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                   />
                              ) : (
                                   <Text style={styles.Value}>{(userData as DataTypes)?.phone}</Text>
                              )}
                         </View>

                         {isEdit ? (
                              <View style={styles.BtnContainer}>
                                   <Button
                                        name="Cancel"
                                        onPress={() => setIsEdit(false)}
                                        customWidth={80}
                                        customHeight={40}
                                        mainStyle={{
                                             backgroundColor: colors.SecondaryColor,
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                             borderRadius: 10,
                                             paddingHorizontal: 5,
                                             borderWidth: 2,
                                             borderColor: colors.PrimaryColor,
                                        }}
                                        textStyle={{
                                             color: colors.PrimaryColor,
                                             fontSize: 15,
                                             fontFamily: Font.font600,
                                        }}
                                   />
                                   <Button
                                        name="Save"
                                        onPress={handleSave}
                                        customWidth={80}
                                        customHeight={40}
                                        mainStyle={{
                                             backgroundColor: colors.PrimaryColor,
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                             borderRadius: 10,
                                             paddingHorizontal: 5,
                                             borderWidth: 2,
                                             borderColor: colors.PrimaryColor,
                                        }}
                                        textStyle={{
                                             color: 'white',
                                             fontSize: 15,
                                             fontFamily: Font.font600,
                                        }}
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                   />
                              </View>
                         ) : (
                              <Button
                                   name="Change Password"
                                   customWidth={150}
                                   textStyle={{
                                        color: colors.SecondaryColor,
                                        fontSize: 15,
                                        fontFamily: Font.font600,
                                        textDecorationLine: 'underline',
                                        textDecorationColor: colors.SecondaryColor,
                                   }}
                                   mainStyle={{
                                        backgroundColor: colors.PrimaryColor,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 10,
                                        paddingHorizontal: 5,
                                        borderWidth: 2,
                                        borderColor: colors.SecondaryColor,
                                   }}
                                   onPress={() => setIsOpen(true)}
                              />
                         )}
                    </View>
               </ScrollView>
               <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
                    <View style={styles.ModalContainer}>
                         <TouchableOpacity style={styles.Cross} onPress={() => setIsOpen(false)}>
                              <Entypo name="cross" color={colors.textColor} size={25} />
                         </TouchableOpacity>
                         <Text style={[styles.Heading, { color: colors.PrimaryColor, marginTop: 20 }]}>Change Password</Text>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Current Password</Text>
                              <Field placeHolder="Enter Current Password" type="password" value={password} onChange={value => setChangePassword({ ...changePassword, password: value })} />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>New Password</Text>
                              <Field placeHolder="Enter New Password" type="password" isIcon value={newPass} onChange={value => setChangePassword({ ...changePassword, newPass: value })} />
                         </View>
                         <View style={styles.FieldContainer}>
                              <Text style={styles.Label}>Re-Enter New Password</Text>
                              <Field placeHolder="Re-Enter New Password" type="password" isIcon value={reNewPass} onChange={value => setChangePassword({ ...changePassword, reNewPass: value })} />
                         </View>
                         <Button name="Save" onPress={handleChangePass} isLoading={isLoading} disabled={isLoading} />
                    </View>
               </ModalLayout>
          </View>
     );
};

export default Profile;

const styles = StyleSheet.create({
     Container: {
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: 'white',
     },
     ContainerWrapper: {
          width: '100%',
          gap: 35,
          alignItems: 'center',
          paddingTop: 30,
     },
     Heading: {
          fontFamily: Font.font600,
          fontSize: 18,
          color: colors.textColor,
     },
     ImageContainer: {
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
     },
     Value: {
          fontFamily: Font.font600,
          color: colors.textColor,
          fontSize: 16,
     },
     HeaderContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },
     Edit: {
          gap: 10,
          flexDirection: 'row',
          alignItems: 'center',
     },
     FieldContainer: {
          width: '100%',
          gap: 10,
     },
     Label: {
          fontFamily: Font.font600,
          fontSize: 15,
          color: colors.SecTextColor,
     },
     BtnContainer: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
     },
     ModalContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          gap: 20,
     },
     Cross: {
          position: 'absolute',
          right: 5,
          top: 5,
     },
});
