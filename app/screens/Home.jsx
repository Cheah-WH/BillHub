import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.screenView}>
      <View style={styles.header}>
        <View style={styles.headerLeftView}>
          <AntDesignIcon
            style={styles.menuIcon}
            name="menuunfold"
            size={28}
            color="#000"
            onPress={openDrawer}
          />
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}> Home </Text>
        </View>
        <View style={styles.headerRightView}>
          <Ionicons
            style={styles.notificationIcon}
            name="notifications-outline"
            size={28}
            color="#000"
          />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.text}>{"\n"} This is Home screen</Text>
          <Image
            source={require("../images/AddBill.png")}
            style={styles.image}
          />
          <Image
            source={require("../images/BillAnalysis.png")}
            style={styles.image}
          />
          <Image
            source={require("../images/AutoBilling.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.bodyBottom}>

        </View>
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenView: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "#cca300",
    flex: 1,
    alignItems: "center",
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
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 15,
  },
  bodyTop:{
    backgroundColor: "#e3e2de",
  },
  bodyBottom:{
    backgroundColor: "#faefcd",
  },
  footer: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    backgroundColor: "grey",
    flex: 1,
  },
  menuIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  notificationIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  image: {
    width: 70,
    height: 70,
  },
});

export default HomeScreen;
