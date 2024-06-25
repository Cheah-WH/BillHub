import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const LoginScreen = () => {
  return (
    <View>
      <View name="header">
        <Text style={{ color: "black" }}>Login</Text>
      </View>
      <View name="body">
        <Text style={{ color: "black" }}> {"\n"}This is Login screen</Text>
      </View>
      <View name="footer"></View>
    </View>
  );
};

export default LoginScreen;
