import React from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import Navigation from './Navigation';
import { AuthProvider } from '../../backend/AuthContext';
import SplashScreen from "../screens/SplashScreen";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {

const STRIPE_PUBLISHABLE_KEY = "pk_test_51PtFfiE9Am30zOrlksf2oUYivCUw1EHkPonwFzyrootjUE2b1chVVXNj6wWWGvyzb2JMHks4vSXZD6g1wwbZgiIU00mlF8Unfd" 

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <View style={styles.MainContainer}>
          <Navigation />
        </View>
      </AuthProvider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    marginTop: 30,
    backgroundColor: "blue",
    flex: 1,
  },
});
