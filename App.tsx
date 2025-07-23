import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView 
          style={{ flex: 1 }}
          edges={['top', 'left', 'right']} 
        >
          <RootNavigation />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}