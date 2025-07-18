import { Image, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { windowHeight, windowWidth } from '../../utils/dimensions/dimensions';
import colors from '../../utils/colors/colors';

const AuthLayout = ({
  children,
  heading = '',
}: {
  children: ReactNode;
  heading?: string;
}) => {
  return (
    <View style={styles.Container}>
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
