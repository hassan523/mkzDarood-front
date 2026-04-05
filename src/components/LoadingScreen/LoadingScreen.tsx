import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';

// ─── Color Palette ────────────────────────────────────────────────────────────
const colors = {
     PrimaryColor: '#006860',
     lightGreen: '#349F92',
     SecondaryColor: '#FFFFFF',
     textColor: '#1E1E1E',
     SecTextColor: '#484848',
     terTextColor: '#3B3B3B',
     gradientOne: '#00998C',
     gradientTwo: '#005B41',
     errorColor: '#E53935',
};

// ─── Status Type (RTK Query) ──────────────────────────────────────────────────
type LoadingStatus = 'uninitialized' | 'pending' | 'fulfilled' | 'rejected';

// ─── Tick Icon ────────────────────────────────────────────────────────────────
const TickIcon: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = colors.PrimaryColor }) => {
     const scale = useRef(new Animated.Value(0)).current;
     const opacity = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
               Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          ]).start();
     }, []);

     return (
          <Animated.View style={{ transform: [{ scale }], opacity }}>
               <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color + '15', alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
                         <Polyline points="4,13 9,18 20,7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
               </View>
          </Animated.View>
     );
};

// ─── Error Icon ───────────────────────────────────────────────────────────────
const ErrorIcon: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = colors.errorColor }) => {
     const scale = useRef(new Animated.Value(0)).current;
     const opacity = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
               Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          ]).start();
     }, []);

     return (
          <Animated.View style={{ transform: [{ scale }], opacity }}>
               <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color + '15', alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
                         <Line x1="5" y1="5" x2="19" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
                         <Line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
                    </Svg>
               </View>
          </Animated.View>
     );
};

// ─── Spinning Ring ─────────────────────────────────────────────────────────────
const SpinningRing: React.FC<{ size?: number; color?: string; children?: React.ReactNode }> = ({ size = 88, color = colors.PrimaryColor, children }) => {
     const spin = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true })).start();
     }, []);

     const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

     return (
          <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
               <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={StyleSheet.absoluteFillObject}>
                    <Circle cx={size / 2} cy={size / 2} r={size / 2 - 3} stroke={color} strokeWidth="1.2" opacity={0.12} fill="none" />
               </Svg>
               <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ rotate }] }]}>
                    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                         <Path d={`M${size / 2} 3 A${size / 2 - 3} ${size / 2 - 3} 0 0 1 ${size - 3} ${size / 2}`} stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
                    </Svg>
               </Animated.View>
               {children}
          </View>
     );
};

// ─── Static Ring ──────────────────────────────────────────────────────────────
const StaticRing: React.FC<{ size?: number; color?: string; children?: React.ReactNode }> = ({ size = 88, color = colors.PrimaryColor, children }) => {
     const scale = useRef(new Animated.Value(0.8)).current;
     const opacity = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.spring(scale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
               Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start();
     }, []);

     return (
          <Animated.View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', transform: [{ scale }], opacity }}>
               <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={StyleSheet.absoluteFillObject}>
                    <Circle cx={size / 2} cy={size / 2} r={size / 2 - 3} stroke={color} strokeWidth="1.4" opacity={0.3} fill="none" />
               </Svg>
               {children}
          </Animated.View>
     );
};

// ─── LoadingText ───────────────────────────────────────────────────────────────
const LoadingText: React.FC<{
     title: string;
     subtitle?: string;
     titleStyle?: TextStyle;
     subtitleStyle?: TextStyle;
     animate?: boolean;
     titleColor?: string;
}> = ({ title, subtitle, titleStyle, subtitleStyle, animate = false, titleColor }) => {
     const pulse = useRef(new Animated.Value(animate ? 0.4 : 1)).current;
     const entryOpacity = useRef(new Animated.Value(0)).current;
     const entrySlide = useRef(new Animated.Value(8)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.timing(entryOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
               Animated.timing(entrySlide, { toValue: 0, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          ]).start();

          if (animate) {
               Animated.loop(
                    Animated.sequence([
                         Animated.timing(pulse, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                         Animated.timing(pulse, { toValue: 0.4, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                    ]),
               ).start();
          }
     }, []);

     return (
          <Animated.View style={[styles.textContainer, { opacity: entryOpacity, transform: [{ translateY: entrySlide }] }]}>
               <Text style={[styles.title, titleColor ? { color: titleColor } : {}, titleStyle]}>{title}</Text>
               {subtitle && <Animated.Text style={[styles.subtitle, { opacity: pulse }, subtitleStyle]}>{subtitle}</Animated.Text>}
          </Animated.View>
     );
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface LoadingScreenProps {
     status: LoadingStatus;
     onHide?: () => void;
     hideDelay?: number;
     image?: ImageSourcePropType;
     imageSize?: number;
     ringSize?: number;
     loadingTitle?: string;
     loadingSubtitle?: string;
     successTitle?: string;
     successSubtitle?: string;
     errorTitle?: string;
     errorSubtitle?: string;
     backgroundColor?: string;
     style?: ViewStyle;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const LoadingScreen: React.FC<LoadingScreenProps> = ({
     status,
     onHide,
     hideDelay = 3000,
     image,
     imageSize = 60,
     ringSize = 88,
     loadingTitle = 'Securing your account...',
     loadingSubtitle = 'Please wait',
     successTitle = 'All done!',
     successSubtitle = 'Your account is secured',
     errorTitle = 'Something went wrong',
     errorSubtitle = 'Please try again',
     backgroundColor = colors.SecondaryColor,
     style,
}) => {
     // useRef se screenFade track karo taake closure issue na ho
     const screenFade = useRef(new Animated.Value(0)).current;
     const onHideRef = useRef(onHide);
     const hideDelayRef = useRef(hideDelay);

     // Refs hamesha latest value rakhenge — stale closure fix
     useEffect(() => {
          onHideRef.current = onHide;
     }, [onHide]);
     useEffect(() => {
          hideDelayRef.current = hideDelay;
     }, [hideDelay]);

     // Fade in on mount
     useEffect(() => {
          Animated.timing(screenFade, {
               toValue: 1,
               duration: 500,
               easing: Easing.out(Easing.ease),
               useNativeDriver: true,
          }).start();
     }, []);

     // ✅ FIX: fulfilled ya rejected pe timer start karo
     useEffect(() => {
          if (status !== 'fulfilled' && status !== 'rejected') return;

          const timer = setTimeout(() => {
               Animated.timing(screenFade, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
               }).start(() => {
                    onHideRef.current?.(); // latest onHide call hoga
               });
          }, hideDelayRef.current);

          return () => clearTimeout(timer); // cleanup agar status dobara change ho
     }, [status]); // sirf status dependency — baki refs se lete hain

     const renderContent = () => {
          if (status === 'pending' || status === 'uninitialized') {
               return (
                    <View style={styles.content}>
                         <SpinningRing size={ringSize} color={colors.PrimaryColor}>
                              {image && <Image source={image} style={{ width: imageSize, height: imageSize }} resizeMode="contain" />}
                         </SpinningRing>
                         <LoadingText key="loading" title={loadingTitle} subtitle={loadingSubtitle} animate />
                    </View>
               );
          }

          if (status === 'fulfilled') {
               return (
                    <View style={styles.content}>
                         <StaticRing size={ringSize} color={colors.PrimaryColor}>
                              <TickIcon size={imageSize} color={colors.PrimaryColor} />
                         </StaticRing>
                         <LoadingText key="success" title={successTitle} subtitle={successSubtitle} />
                    </View>
               );
          }

          return (
               <View style={styles.content}>
                    <StaticRing size={ringSize} color={colors.errorColor}>
                         <ErrorIcon size={imageSize} color={colors.errorColor} />
                    </StaticRing>
                    <LoadingText key="error" title={errorTitle} subtitle={errorSubtitle} titleColor={colors.errorColor} />
               </View>
          );
     };

     return <Animated.View style={[styles.container, { backgroundColor, opacity: screenFade }, style]}>{renderContent()}</Animated.View>;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
     container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
     content: { alignItems: 'center', gap: 20 },
     textContainer: { alignItems: 'center', gap: 6 },
     title: { fontSize: 15, fontWeight: '500', color: colors.textColor, letterSpacing: 0.1 },
     subtitle: { fontSize: 12, color: colors.SecTextColor, fontWeight: '400', letterSpacing: 0.2 },
});

export default LoadingScreen;
export { TickIcon, ErrorIcon, SpinningRing, StaticRing, LoadingText };

// ─── Usage ─────────────────────────────────────────────────────────────────────
/*
const { status } = useLoginMutation()[1]; // RTK mutation
const [visible, setVisible] = useState(true);

if (!visible) return null;

<LoadingScreen
     status={status}
     onHide={() => setVisible(false)}
     image={require('./assets/lock.png')}
     loadingTitle="Securing your account..."
     successTitle="All done!"
     errorTitle="Login failed"
     errorSubtitle="Check your credentials and try again"
/>
*/
