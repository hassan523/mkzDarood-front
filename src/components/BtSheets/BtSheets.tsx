import { Keyboard, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import colors from '../../utils/colors/colors';

interface BtSheetsProps {
  children: ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  backgroundStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  showOverlay?: boolean;
}

const BtSheets = forwardRef<BottomSheet, BtSheetsProps>(
  (
    {
      children,
      snapPoints = ['40%','80%'],
      onClose = () => {},
      backgroundStyle = {
        backgroundColor: colors.SecondaryColor,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      },
      handleIndicatorStyle = {
        backgroundColor: colors.PrimaryColor,
        width: 40,
      },
      containerStyle = { zIndex: 1000 },
    },
    ref,
  ) => {
     const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);
    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={keyboardVisible ? [snapPoints[1]] : [snapPoints[0]]}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        android_keyboardInputMode="adjustResize"
      >
        
        <BottomSheetView style={[styles.Container, containerStyle]}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1000,
  },
});

export default BtSheets;
