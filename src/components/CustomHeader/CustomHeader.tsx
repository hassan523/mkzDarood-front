import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../utils/colors/colors';
import Font from '../../utils/fonts/Font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { useSelector } from 'react-redux';
import { useProfileData } from '../../model/Profile/ProfileModel';
import Skeleton from '../SkeletonComp/Skeleton';
import { RootState } from '../../redux/store';

const CustomHeader = ({ showDrawerButton = true, navigation, style }: { showDrawerButton?: boolean; navigation: Navigation; style?: any }) => {
     const selector = useSelector((state: RootState) => state?.userData);
     const id: string | undefined = selector?.data?.user?._id;
     const Token: string | undefined = selector?.data?.accessToken;

     const getProfile = useProfileData({ Token: Token ?? '', id: id ?? '' });
     const userData = getProfile?.data?.profile;
     const profileImage = userData?.profilePicture ? userData.profilePicture.replace('/image/upload/', '/image/upload/w_90,h_90,c_fill,q_auto,f_auto/') : undefined;
     console.log({ profileImage, original: userData?.profilePicture });
     const isLoadingProfile = getProfile?.isLoading;
     const isLoggin = selector?.isLoggin;

     return (
          <View style={[styles.headerContainer, style]}>
               {showDrawerButton ? (
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                         <Ionicons name="menu" size={30} color={colors.SecondaryColor} />
                    </TouchableOpacity>
               ) : (
                    <View style={styles.menuButton} />
               )}

               <Image source={require('../../assets/logo2.png')} style={{ width: 60 }} resizeMode="contain" />
               {isLoggin ? (
                    isLoadingProfile ? (
                         <Skeleton width={45} height={45} borderRadius={10000} />
                    ) : (
                         <TouchableOpacity onPress={() => navigation.navigate('ProfileStackScreen')}>
                              <Image
                                   source={userData?.profilePicture ? { uri: userData.profilePicture } : require('../../assets/dummyProfileImage.jpg')}
                                   style={{ width: 45, height: 45, borderRadius: 1000 }}
                              />
                         </TouchableOpacity>
                    )
               ) : (
                    <View style={styles.rightHeaderPlaceholder} />
               )}
          </View>
     );
};

export default CustomHeader;

const styles = StyleSheet.create({
     headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          height: 80,
          paddingHorizontal: 15,
          top: 5,
          left: 0,
          right: 0,
          zIndex: 10000,
     },
     menuButton: {
          padding: 10,
          width: 44,
     },
     headerTitle: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 18,
          flex: 1,
          textAlign: 'center',
     },
     rightHeaderPlaceholder: {
          width: 44,
     },
});
