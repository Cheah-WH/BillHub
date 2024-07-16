import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../constant";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    {
      label: "At least 8-12 characters",
      isValid: password.length >= 8 && password.length <= 12,
    },
    { label: "At least 1 uppercase", isValid: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase", isValid: /[a-z]/.test(password) },
    { label: "At least 1 number", isValid: /[0-9]/.test(password) },
    {
      label: "At least 1 special character",
      isValid: /[!@#$%^&*(),._?":{}|<>]/.test(password),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={{fontWeight:"bold",marginBottom:10,fontSize:15}}> Your password must follow these rules : </Text>
      {criteria.map((criterion, index) => (
        <View key={index} style={styles.criterion}>
          <FontAwesome
            name={criterion.isValid ? "check" : "close"}
            size={18}
            color={criterion.isValid ? COLORS.primary : COLORS.secondary}
          />
          <Text style={styles.label}>{criterion.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  label:{
    fontSize:25,
  },
  criterion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default PasswordCriteria;
