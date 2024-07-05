import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ImageSlider from "../components/ImageSlider";
import { COLORS, FONTS } from "../constant";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

const images = [
  { id: 1, uri: require("../images/login1.png") },
  { id: 2, uri: require("../images/login2.png") },
  { id: 3, uri: require("../images/login3.png") },
  { id: 4, uri: require("../images/login4.jpg") },
  { id: 5, uri: require("../images/login5.jpg") },
];

const back = () => {
  navigation.goBack();
};

const LoginScreen = () => {
  const [section, setSection] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setSection(0);
    }, [])
  );

  return (
    <>
      {section === 0 && (
        <View style={styles.screenView}>
          <View style={styles.bodyFloatLayer}>
            <Image
              source={require("../images/logo.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.body}>
            <ImageSlider images={images} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.Button}>
              <Text style={styles.ButtonText}>Sign Up Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => {
                setSection(1);
              }}
            >
              <Text style={styles.ButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {section === 1 && (
        <View style={styles.screenView}>
          <View style={styles.screenView}>
            <View style={styles.header}>
              <View style={styles.headerLeftView}>
                <AntDesignIcon
                  style={styles.backIcon}
                  name="back"
                  size={28}
                  color="#000"
                  onPress={()=>setSection(0)}
                />
              </View>
              <View style={styles.headerMidView}>
                <Text style={styles.title}> User Login </Text>
              </View>
              <View style={styles.headerRightView}></View>
            </View>
            <View style={styles.body2}></View>
            <View style={styles.footer2}></View>
          </View>
        </View>
      )}
      {section === 2 && (
        <View style={styles.screenView}>
          <Text>This is section 2</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // section 0
  screenView: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  bodyFloatLayer: {
    position: "absolute",
    width: "80%",
    marginHorizontal: "8%",
    marginTop: "8%",
    zIndex: 10,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 8,
  },
  body: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    backgroundColor: COLORS.primary,
    padding: 20,
    margin: 10,
    width: "65%",
    alignItems: "center",
    borderRadius: 25,
  },
  ButtonText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  // section 1
  header: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
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
  body2: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 15,
  },
  footer2: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default LoginScreen;
