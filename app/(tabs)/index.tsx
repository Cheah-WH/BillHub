import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import 'react-native-gesture-handler';
import Navigation from './Navigation';

export default function App() {
  return (
    <View style={styles.MainContainer}>
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    marginTop: 30,
    backgroundColor: "blue",
    flex: 1,
  },
});