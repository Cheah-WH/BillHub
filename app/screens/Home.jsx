import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityBase,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const reload = () => {};

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
          <View style={styles.creditView}>
            <Text style={{ fontSize: 23 }}>{"\n"} Available Credits </Text>
            <Text style={styles.creditText}>{"\n"} Rm688.88 </Text>
            <TouchableOpacity style={styles.reloadButton} onPress={reload}>
              <Text style={styles.reloadText}>+ Reload</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ThreeView}>
            <View>
              <TouchableOpacity style={{ alignItems: "center" }}>
                <Image
                  source={require("../images/AddBill.png")}
                  style={styles.image}
                />
                <Text style={{ fontSize: 12 }}>Add Bill</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={{ alignItems: "center" }}>
                <Image
                  source={require("../images/BillAnalysis.png")}
                  style={styles.image}
                />
                <Text style={{ fontSize: 12 }}>Bill Analysis</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={{ alignItems: "center" }}>
                <Image
                  source={require("../images/AutoBilling.png")}
                  style={styles.image}
                />
                <Text style={{ fontSize: 12 }}>Auto-billing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bodyBottom}></View>
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
    paddingHorizontal: 0,
    flex: 15,
  },
  bodyTop: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    height: "35%",
  },
  bodyBottom: {
    backgroundColor: "#f5eed7",
    flex:1,
    zIndex:1,
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
  creditView: {
    alignItems: "center",
    justifyContent: "space-around",
    height: "85%",
  },
  creditText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reloadButton: {
    backgroundColor: "#cca300",
    borderRadius: 50,
    padding: 15,
    margin: 30,
  },
  reloadText: {
    color: "#000",
    fontWeight: "bold",
  },
  ThreeView: {
    flexDirection: "row",
    backgroundColor: "#cca300",
    width: "80%",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderRadius: 10,
    zIndex:2,
    //shadow
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 60,
    height: 60,
  },
});

export default HomeScreen;
