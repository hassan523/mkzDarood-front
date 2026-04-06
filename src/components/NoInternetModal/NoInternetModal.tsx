import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';

// ─── Colors ───────────────────────────────────────────────────────────────────
const colors = {
     PrimaryColor: '#006860',
     lightGreen: '#349F92',
     gradientOne: '#00998C',
     gradientTwo: '#005B41',
     errorRed: '#E53935',
     SecondaryColor: '#FFFFFF',
     textColor: '#1E1E1E',
     SecTextColor: '#484848',
};

// ─── Animated WiFi Icon ───────────────────────────────────────────────────────
const WifiOffIcon = ({ isConnected }: { isConnected: boolean }) => {
     const wave1 = useRef(new Animated.Value(0)).current;
     const wave2 = useRef(new Animated.Value(0)).current;
     const wave3 = useRef(new Animated.Value(0)).current;
     const iconScale = useRef(new Animated.Value(0.5)).current;
     const iconOpacity = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          // Icon entrance
          Animated.parallel([
               Animated.spring(iconScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
               Animated.timing(iconOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start();
     }, []);

     useEffect(() => {
          if (isConnected) {
               // Connected — waves pulse outward
               const waveAnim = (anim: Animated.Value, delay: number) =>
                    Animated.loop(
                         Animated.sequence([
                              Animated.timing(anim, { toValue: 1, duration: 600, delay, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                              Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
                              Animated.delay(800),
                         ]),
                    ).start();
               waveAnim(wave1, 0);
               waveAnim(wave2, 200);
               waveAnim(wave3, 400);
          }
     }, [isConnected]);

     const waveStyle = (anim: Animated.Value, size: number) => ({
          position: 'absolute' as const,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: colors.gradientOne,
          opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.6, 0] }),
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.5] }) }],
     });

     return (
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: iconScale }], opacity: iconOpacity }]}>
               {/* Ripple waves (only when connected) */}
               {isConnected && (
                    <>
                         <Animated.View style={waveStyle(wave1, 90)} />
                         <Animated.View style={waveStyle(wave2, 90)} />
                         <Animated.View style={waveStyle(wave3, 90)} />
                    </>
               )}

               {/* Icon circle */}
               <View style={[styles.iconCircle, { backgroundColor: isConnected ? colors.gradientOne + '18' : colors.errorRed + '12' }]}>
                    <Text style={{ fontSize: 38 }}>{isConnected ? '📶' : '📵'}</Text>
               </View>
          </Animated.View>
     );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const NoInternetModal = () => {
     const [isConnected, setIsConnected] = useState<boolean>(true);
     const [visible, setVisible] = useState(false);
     const [checking, setChecking] = useState(false);
     const [justConnected, setJustConnected] = useState(false);

     // Animations
     const backdropOpacity = useRef(new Animated.Value(0)).current;
     const sheetTranslateY = useRef(new Animated.Value(300)).current;
     const successScale = useRef(new Animated.Value(0)).current;
     const successOpacity = useRef(new Animated.Value(0)).current;
     const retryRotate = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          const unsubscribe = NetInfo.addEventListener(state => {
               const connected = !!(state.isConnected && state.isInternetReachable !== false);
               setIsConnected(connected);

               if (!connected) {
                    setJustConnected(false);
                    showModal();
               } else if (visible) {
                    handleConnectionRestored();
               }
          });
          return () => unsubscribe();
     }, [visible]);

     const showModal = () => {
          setVisible(true);
          Animated.parallel([
               Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
               Animated.spring(sheetTranslateY, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
          ]).start();
     };

     const hideModal = () => {
          Animated.parallel([
               Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
               Animated.timing(sheetTranslateY, { toValue: 300, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true }),
          ]).start(() => {
               setVisible(false);
               setJustConnected(false);
               successScale.setValue(0);
               successOpacity.setValue(0);
          });
     };

     const handleConnectionRestored = () => {
          setJustConnected(true);
          // Success pop animation
          Animated.parallel([
               Animated.spring(successScale, { toValue: 1, friction: 4, tension: 150, useNativeDriver: true }),
               Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start();
          // Auto close after 1.5s
          setTimeout(hideModal, 1500);
     };

     const handleRetry = async () => {
          setChecking(true);
          // Spin retry icon
          Animated.loop(Animated.timing(retryRotate, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true })).start();

          const state = await NetInfo.fetch();
          const connected = !!(state.isConnected && state.isInternetReachable !== false);

          retryRotate.stopAnimation();
          retryRotate.setValue(0);
          setChecking(false);
          setIsConnected(connected);

          if (connected) handleConnectionRestored();
     };

     const spin = retryRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

     if (!visible) return null;

     return (
          <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
               {/* Backdrop */}
               <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />

               <View style={styles.modalContainer}>
                    <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
                         {/* Top pill */}
                         <View style={styles.pill} />

                         {justConnected ? (
                              // ── SUCCESS STATE ──
                              <Animated.View style={[styles.successContainer, { transform: [{ scale: successScale }], opacity: successOpacity }]}>
                                   <View style={styles.successCircle}>
                                        <Text style={{ fontSize: 42 }}>✅</Text>
                                   </View>
                                   <Text style={styles.successTitle}>Connected!</Text>
                                   <Text style={styles.successSub}>Internet connection restored</Text>
                              </Animated.View>
                         ) : (
                              // ── OFFLINE STATE ──
                              <>
                                   <WifiOffIcon isConnected={false} />

                                   <View style={styles.textBlock}>
                                        <Text style={styles.title}>No Internet Connection</Text>
                                        <Text style={styles.subtitle}>Please check your WiFi or mobile data and try again.</Text>
                                   </View>

                                   {/* Tips */}
                                   <View style={styles.tipsBox}>
                                        {['Turn WiFi off and on', 'Check mobile data', 'Move to a better area'].map((tip, i) => (
                                             <View key={i} style={styles.tipRow}>
                                                  <View style={styles.tipDot} />
                                                  <Text style={styles.tipText}>{tip}</Text>
                                             </View>
                                        ))}
                                   </View>

                                   {/* Retry button */}
                                   <TouchableOpacity onPress={handleRetry} disabled={checking} activeOpacity={0.85} style={{ width: '100%' }}>
                                        <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.retryBtn}>
                                             <Animated.Text style={[styles.retryIcon, { transform: [{ rotate: spin }] }]}>🔄</Animated.Text>
                                             <Text style={styles.retryText}>{checking ? 'Checking...' : 'Try Again'}</Text>
                                        </LinearGradient>
                                   </TouchableOpacity>
                              </>
                         )}
                    </Animated.View>
               </View>
          </Modal>
     );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
     backdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.55)',
     },
     modalContainer: {
          flex: 1,
          justifyContent: 'flex-end',
     },
     sheet: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 12,
          alignItems: 'center',
          gap: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 20,
     },
     pill: {
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#E0E0E0',
          marginBottom: 8,
     },

     // Icon
     iconWrapper: { alignItems: 'center', justifyContent: 'center', width: 90, height: 90 },
     iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },

     // Text
     textBlock: { alignItems: 'center', gap: 8 },
     title: { fontSize: 20, fontWeight: '700', color: colors.textColor, letterSpacing: 0.2 },
     subtitle: { fontSize: 14, color: colors.SecTextColor, textAlign: 'center', lineHeight: 22 },

     // Tips
     tipsBox: { width: '100%', backgroundColor: '#F7FAFA', borderRadius: 14, padding: 16, gap: 10 },
     tipRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
     tipDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gradientOne },
     tipText: { fontSize: 13, color: colors.SecTextColor },

     // Retry
     retryBtn: { width: '100%', height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
     retryIcon: { fontSize: 18 },
     retryText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

     // Success
     successContainer: { alignItems: 'center', gap: 12, paddingVertical: 20 },
     successCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.gradientOne + '15', alignItems: 'center', justifyContent: 'center' },
     successTitle: { fontSize: 22, fontWeight: '700', color: colors.PrimaryColor },
     successSub: { fontSize: 14, color: colors.SecTextColor },
});

export default NoInternetModal;

// ─── Usage — App.tsx ya Root layout mein ─────────────────────────────────────
/*
import NoInternetModal from './components/NoInternetModal/NoInternetModal';

const App = () => {
     return (
          <>
               <MainNavigator />
               <NoInternetModal />   // ← bas yeh ek line — poori app mein kaam karega
          </>
     );
};

// Install:
// npm install @react-native-community/netinfo
// npm install react-native-linear-gradient
// cd ios && pod install
*/
