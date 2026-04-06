import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { windowWidth } from '../../utils/dimensions/dimensions';

const { width, height } = Dimensions.get('window');

const AnimatedSplash = ({ onFinish }: { onFinish: () => void }) => {
     // Logo — static, no opacity change
     const logoScale = useRef(new Animated.Value(0.85)).current;

     // Text animations
     const textTranslateY = useRef(new Animated.Value(40)).current;
     const textOpacity = useRef(new Animated.Value(0)).current;

     // Tagline (optional second line)
     const tagTranslateY = useRef(new Animated.Value(30)).current;
     const tagOpacity = useRef(new Animated.Value(0)).current;

     // Whole screen fade out at end
     const screenOpacity = useRef(new Animated.Value(1)).current;

     useEffect(() => {
          SplashScreen.hide();

          Animated.sequence([
               // Logo subtle scale in
               Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
               }),

               // Text slide up + fade in
               Animated.parallel([
                    Animated.timing(textTranslateY, {
                         toValue: 0,
                         duration: 500,
                         easing: Easing.out(Easing.cubic),
                         useNativeDriver: true,
                    }),
                    Animated.timing(textOpacity, {
                         toValue: 1,
                         duration: 500,
                         useNativeDriver: true,
                    }),
               ]),

               // Tagline slide up slightly after
               Animated.parallel([
                    Animated.timing(tagTranslateY, {
                         toValue: 0,
                         duration: 400,
                         delay: 100,
                         easing: Easing.out(Easing.cubic),
                         useNativeDriver: true,
                    }),
                    Animated.timing(tagOpacity, {
                         toValue: 1,
                         duration: 400,
                         delay: 100,
                         useNativeDriver: true,
                    }),
               ]),

               // Hold
               Animated.delay(1200),

               // Fade out
               Animated.timing(screenOpacity, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
               }),
          ]).start(() => onFinish());
     }, []);

     return (
          <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
               {/* Logo — no opacity change */}
               <Animated.Image source={require('../../assets/splashLogo.png')} style={[styles.logo, { transform: [{ scale: logoScale }] }]} resizeMode="contain" />

               {/* MKZ DAROOD text image */}
               <Animated.Image
                    source={require('../../assets/splashText.png')}
                    style={[
                         styles.textImage,
                         {
                              opacity: textOpacity,
                              transform: [{ translateY: textTranslateY }],
                         },
                    ]}
                    resizeMode="contain"
               />
          </Animated.View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#006860',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
     },

     // Decorative rings
     ringOuter: {
          position: 'absolute',
          width: 240,
          height: 240,
          borderRadius: 120,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
     },
     ringInner: {
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
     },

     // Logo
     logo: {
          width: windowWidth - 80,
          height: windowWidth - 80,
          marginBottom: 24,
     },

     // MKZ DAROOD text image
     textImage: {
          width: windowWidth - 80,
          height: 90,
          marginBottom: 10,
     },

     // Tagline
     tagline: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 13,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          marginTop: 4,
     },

     // Bottom dots
     dotsRow: {
          position: 'absolute',
          bottom: 60,
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
     },
     dot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#fff',
     },
});

export default AnimatedSplash;

// ─── Usage in App.tsx ─────────────────────────────────────────────────────────
/*
import React, { useState } from 'react';
import AnimatedSplash from './AnimatedSplash';
import MainNavigator from './navigation/MainNavigator';

const App = () => {
     const [splashDone, setSplashDone] = useState(false);

     if (!splashDone) {
          return <AnimatedSplash onFinish={() => setSplashDone(true)} />;
     }

     return <MainNavigator />;
};

export default App;
*/
