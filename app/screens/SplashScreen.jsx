import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../backend/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constant";

const SplashScreen = () => {
  const { user, authLoading } = useContext(AuthContext); // Access user and loading in AuthContext
  const navigation = useNavigation();

  useEffect(() => {
    if (!authLoading) {
      console.log("Done checking user login state");
      if (user) {
        navigation.navigate("Drawer"); // Navigate to Home if user is authenticated
        console.log("User is logged In");
      } else {
        navigation.navigate("Login"); // Navigate to Login if user is not authenticated
        console.log("User is not logged In");
      }
    }
  }, [authLoading, user, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Loading... Please wait</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default SplashScreen;
