import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { ReactNode } from 'react';
import { windowHeight, windowWidth } from '../../utils/dimensions/dimensions';
import colors from '../../utils/colors/colors';
import Font from '../../utils/fonts/Font';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const AuthLayout = ({ children, heading = '', isBack = false, onBack = () => {} }: { children: ReactNode; heading?: string; isBack?: boolean; onBack?: () => void }) => {
     return (
          <View style={styles.Container}>
               {heading != '' && (
                    <View style={styles.HeaderContainer}>
                         {isBack && (
                              <TouchableOpacity style={styles.Back} onPress={onBack}>
                                   <FontAwesome6 name="arrow-left-long" size={20} color={colors.textColor} />
                              </TouchableOpacity>
                         )}
                         <Text style={styles.Heading}>{heading}</Text>
                    </View>
               )}

               {children}
               <Image source={require('../../assets/bg1.png')} style={styles.ImgLeft} />
               <Image source={require('../../assets/bg2.png')} style={styles.ImgRight} />
          </View>
     );
};

export default AuthLayout;

const styles = StyleSheet.create({
     Container: {
          flex: 1,
          height: windowHeight,
          width: windowWidth,
          position: 'relative',
          backgroundColor: colors.SecondaryColor,
     },
     HeaderContainer: {
          width: '100%',
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          top: 20,
     },
     Heading: {
          fontFamily: Font.font600,
          fontSize: 18,
          color: colors.textColor,
     },
     Back: {
          position: 'absolute',
          left: 20,
     },
     ImgLeft: {
          position: 'absolute',
          bottom: 0,
          left: 0,
     },
     ImgRight: {
          position: 'absolute',
          bottom: 0,
          right: 0,
     },
});
