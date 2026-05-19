// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;

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
