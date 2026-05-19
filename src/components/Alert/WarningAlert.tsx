// components/WarningAlert.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

interface WarningAlertProps {
     message: string;
     title?: string;
     onDismiss?: () => void;
     visible?: boolean;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ message, title = 'Warning', onDismiss, visible = true }) => {
     const translateY = useRef(new Animated.Value(-80)).current;
     const opacity = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          if (visible) {
               Animated.parallel([
                    Animated.spring(translateY, {
                         toValue: 0,
                         useNativeDriver: true,
                         tension: 100,
                         friction: 10,
                    }),
                    Animated.timing(opacity, {
                         toValue: 1,
                         duration: 250,
                         useNativeDriver: true,
                    }),
               ]).start();
          } else {
               Animated.parallel([
                    Animated.timing(translateY, {
                         toValue: -80,
                         duration: 200,
                         useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                         toValue: 0,
                         duration: 200,
                         useNativeDriver: true,
                    }),
               ]).start();
          }
     }, [visible]);

     return (
          <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
               {/* Left bar */}
               <View style={styles.leftBar} />

               {/* Icon */}
               <Text style={styles.icon}>⚠️</Text>

               {/* Text */}
               <View style={styles.textWrapper}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
               </View>

               {/* Dismiss X (optional) */}
               {onDismiss && (
                    <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
                         <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
               )}
          </Animated.View>
     );
};

const styles = StyleSheet.create({
     container: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#1a1200',
          borderWidth: 1,
          borderColor: 'rgba(245,158,11,0.4)',
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 14,
          marginHorizontal: 16,
          marginVertical: 8,
          overflow: 'hidden',
     },
     leftBar: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: '#f59e0b',
          borderTopLeftRadius: 14,
          borderBottomLeftRadius: 14,
     },
     icon: {
          fontSize: 22,
          marginRight: 12,
          marginLeft: 6,
     },
     textWrapper: {
          flex: 1,
     },
     title: {
          color: '#f59e0b',
          fontWeight: '700',
          fontSize: 13,
          marginBottom: 2,
          letterSpacing: 0.3,
     },
     message: {
          color: '#94a3b8',
          fontSize: 12,
          lineHeight: 17,
     },
     closeBtn: {
          paddingLeft: 10,
          paddingVertical: 2,
     },
     closeText: {
          color: '#64748b',
          fontSize: 14,
          fontWeight: '600',
     },
});

export default WarningAlert;
