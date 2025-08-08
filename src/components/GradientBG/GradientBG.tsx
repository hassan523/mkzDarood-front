import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { CSSProperties, ReactNode } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../utils/colors/colors';
import { windowHeight, windowWidth } from '../../utils/dimensions/dimensions';

const GradientBG = ({ style, children, isBackgroundImage, imgStyle }: { style?: CSSProperties | any; imgStyle?: CSSProperties | any; children: ReactNode; isBackgroundImage?: boolean }) => {
     return (
          <>
               {isBackgroundImage ? (
                    <LinearGradient
                         colors={[colors.gradientTwo, colors.gradientOne]}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={style || { justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: '100%' }}
                    >
                         <ImageBackground source={require('../../assets/bgVector.png')} resizeMode="cover" style={imgStyle || { opacity: 1 }}>
                              {children}
                         </ImageBackground>
                    </LinearGradient>
               ) : (
                    <LinearGradient
                         colors={[colors.gradientTwo, colors.gradientOne]}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={style || { justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: '100%' }}
                    >
                         {children}
                    </LinearGradient>
               )}
          </>
     );
};

export default GradientBG;

const styles = StyleSheet.create({
     gradient: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          width: '100%',
     },
});
