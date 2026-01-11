import React from 'react';
import { StyleSheet, View } from 'react-native';
import HospitalHallway from './src/scenes/HospitalHallway';

export default function App() {
  return (
    <View style={styles.container}>
      <HospitalHallway />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
