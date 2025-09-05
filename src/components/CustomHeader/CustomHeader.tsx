import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../utils/colors/colors';
import Font from '../../utils/fonts/Font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { RootState } from 'src/redux/store';
import { useSelector } from 'react-redux';

const CustomHeader = ({ showDrawerButton = true, navigation }: { showDrawerButton?: boolean; navigation: Navigation }) => {
     const selector = useSelector((state: RootState) => state?.userData);
     const profileImg = (selector?.data?.user as any)?.profilePicture;
     const isLoggin = selector?.isLoggin;

     return (
          <View style={styles.headerContainer}>
               {showDrawerButton ? (
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                         <Ionicons name="menu" size={30} color={colors.SecondaryColor} />
                    </TouchableOpacity>
               ) : (
                    <View style={styles.menuButton} />
               )}

               <Image source={require('../../assets/logo2.png')} style={{ width: 100 }} resizeMode="contain" />
               {isLoggin ? (
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileStackScreen')}>
                         <Image src={profileImg} style={{ width: 45, height: 45, borderRadius: 1000 }} />
                    </TouchableOpacity>
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
          height: 60,
          paddingHorizontal: 15,
          position: 'absolute',
          top: 0,
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
