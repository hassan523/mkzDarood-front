import React, { useEffect, useState } from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen/AnimatedSplashScreen';

export default function App() {
     const [splashDone, setSplashDone] = useState(false);

     if (!splashDone) {
          return <AnimatedSplashScreen onFinish={() => setSplashDone(true)} />;
     }

     return (
          <Provider store={store}>
               <SafeAreaProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                         <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                              <RootNavigation />
                         </SafeAreaView>
                    </GestureHandlerRootView>
               </SafeAreaProvider>
          </Provider>
     );
}
