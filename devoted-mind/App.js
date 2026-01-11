import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as NavigationBar from 'expo-navigation-bar';
import HospitalHallway from './src/scenes/HospitalHallway';

export default function App() {
  useEffect(() => {
    // Immersive Mode: Hide Navigation Bar on Android
    async function configureImmersiveMode() {
      try {
        await NavigationBar.setPositionAsync('absolute');
        await NavigationBar.setBackgroundColorAsync('#00000000'); // Transparent
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe'); // Swipe up to show
      } catch (e) {
        console.warn('Navigation Bar config failed:', e);
      }
    }
    configureImmersiveMode();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <HospitalHallway />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
