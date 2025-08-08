import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import colors from '../../utils/colors/colors';
import Font from '../../utils/fonts/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import GradientBG from '../GradientBG/GradientBG';

interface ButtonProps {
     name?: string;
     onPress?: () => void;
     isLoading?: boolean;
     loadingName?: string;
     icon?: ReactNode;
     iconLeft?: boolean;
     iconRight?: boolean;
     mainStyle?: StyleProp<ViewStyle>;
     textStyle?: StyleProp<TextStyle>;
     customWidth?: number | string | any;
     customHeight?: number;
     disabled?: boolean;
}

const RadiusButton: React.FC<ButtonProps> = props => {
     const { name, onPress, isLoading, loadingName, icon, iconLeft, iconRight = false, mainStyle, textStyle, customWidth, customHeight, disabled } = props;
     return icon ? (
          <TouchableOpacity
               style={[mainStyle ? mainStyle : styles.ContainerIcon, { width: customWidth ? customWidth : '100%', height: customHeight ? customHeight : 50 }]}
               onPress={isLoading ? () => {} : onPress}
               disabled={disabled}
          >
               {iconRight ? iconRight && icon ? icon : <Entypo name="chevron-left" color={colors.SecondaryColor} size={30} /> : null}

               {isLoading ? (
                    <Text style={textStyle ? textStyle : { color: colors.SecondaryColor, fontSize: 18, fontFamily: Font.font500 }}>{loadingName ? loadingName : 'Loading...'}</Text>
               ) : (
                    <Text style={textStyle ? textStyle : { color: colors.SecondaryColor, fontSize: 18, fontFamily: Font.font600 }}>{name || 'Button'}</Text>
               )}
               {iconLeft ? iconLeft && icon ? icon : <Entypo name="chevron-left" color={colors.SecondaryColor} size={30} /> : null}
          </TouchableOpacity>
     ) : (
          <TouchableOpacity
               style={[mainStyle ? mainStyle : styles.Container, { width: customWidth ? customWidth : '100%', height: customHeight ? customHeight : 50 }]}
               onPress={isLoading ? () => {} : onPress}
               disabled={disabled}
          >
               {isLoading ? (
                    <Text style={textStyle ? textStyle : { color: colors.SecondaryColor, fontSize: 18, fontFamily: Font.font600 }}>{loadingName ? loadingName : 'Loading...'}</Text>
               ) : (
                    <Text style={textStyle ? textStyle : { color: colors.SecondaryColor, fontSize: 18, fontFamily: Font.font600 }}>{name || 'Button'}</Text>
               )}
          </TouchableOpacity>
     );
};

export default RadiusButton;

const styles = StyleSheet.create({
     gradient: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          width: '100%',
     },
     Container: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
          paddingHorizontal: 40,
          borderWidth: 1.5,
          borderColor: 'white',
          backgroundColor: colors.lightGreen,
     },
     ContainerIcon: {
          backgroundColor: colors.lightGreen,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
          flexDirection: 'row',
          paddingVertical: 12,
          paddingHorizontal: 35,
          gap: 20,
          borderWidth: 1.5,
          borderColor: 'white',
     },
});
