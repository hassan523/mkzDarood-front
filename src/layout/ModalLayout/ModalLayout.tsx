import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { windowHeight } from '../../utils/dimensions/dimensions';

interface ModalType {
     isOpen: boolean;
     setIsOpen: (value: boolean) => void;
     children: React.ReactNode;
}

const ModalLayout = ({ isOpen, setIsOpen, children }: ModalType) => {
     return (
          <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
               <View style={styles.modalOverlay}>
                    <Pressable style={styles.overlayPressable} onPress={() => setIsOpen(false)} />

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                         <View style={styles.modalContent}>{children}</View>
                    </KeyboardAvoidingView>
               </View>
          </Modal>
     );
};

const styles = StyleSheet.create({
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          height: windowHeight,
          zIndex: 9999999,
     },
     overlayPressable: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
     },
     modalContainer: {
          width: '90%',
          maxWidth: 400,
     },
     modalContent: {
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 20,
          width: '100%',
     },
});

export default ModalLayout;
