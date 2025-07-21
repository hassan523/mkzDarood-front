import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigation />
    </GestureHandlerRootView>
  );
}
