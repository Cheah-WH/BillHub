import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { AuthContext } from "../../backend/AuthContext";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const back = () => {
    navigation.goBack();
  };

  const renderField = (label, value) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.screenView}>
      <View style={styles.header}>
        <View style={styles.headerLeftView}>
          <AntDesignIcon
            style={styles.backIcon}
            name="back"
            size={28}
            color="#000"
            onPress={back}
          />
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}>My Profile</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        {renderField("Name", user.name)}
        {renderField("NRIC", user.idNumber)}
        {renderField("Phone Number", user.phoneNumber)}
        {renderField("Email", user.email)}
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenView: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    height: 40,
  },
  headerLeftView: {
    justifyContent: "center",
    flex: 1,
  },
  headerMidView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 8,
  },
  headerRightView: {
    justifyContent: "center",
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 15,
  },
  footer: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  backIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  title: {
    fontWeight: FONTS.header.fontWeight,
    fontSize: FONTS.header.fontSize,
  },
  fieldContainer: {
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize:15,
    fontWeight: "bold",
    color: COLORS.text,
  },
  fieldValue: {
    fontSize:15,
    color: COLORS.text,
  },
});

export default MyProfile;
