import React, { useEffect, useState } from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { StatusBar } from 'react-native';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen/AnimatedSplashScreen';
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function App() {
     const [splashDone, setSplashDone] = useState(false);

     if (!splashDone) {
          return <AnimatedSplashScreen onFinish={() => setSplashDone(true)} />;
     }

     return (
          <Provider store={store}>
               <SafeAreaProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                         <StatusBar backgroundColor="#006860" translucent={false} />
                         <SafeAreaView
                              style={{ flex: 1, backgroundColor: '#1a7a6e' }} // 👈 background color match karo
                              edges={['top', 'bottom', 'left', 'right']}
                         >
                              <RootNavigation />
                         </SafeAreaView>
                    </GestureHandlerRootView>
               </SafeAreaProvider>
          </Provider>
     );
}
