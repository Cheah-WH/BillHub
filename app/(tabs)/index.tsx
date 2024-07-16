import React from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import Navigation from './Navigation';
import { AuthProvider } from '../../backend/AuthContext';
import SplashScreen from "../screens/SplashScreen";

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.MainContainer}>
        <Navigation />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    marginTop: 30,
    backgroundColor: "blue",
    flex: 1,
  },
});
