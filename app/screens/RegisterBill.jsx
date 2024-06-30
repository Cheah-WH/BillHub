import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

const RegisterBill = () => {
  const navigation = useNavigation();

  const back = () => {
    navigation.goBack();
  };

  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
          <Text style={styles.title}> Register Bill </Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyFirstRow}>
          <View style={styles.inputView}>
            <TouchableOpacity onPress={focusInput}>
              <AntDesignIcon
                style={styles.searchIcon}
                name="search1"
                size={28}
                color="#000"
              />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              placeholder="Enter the name of the bill"
              w={{
                base: "75%",
                md: "25%",
              }}
            />
          </View>
          <View style={styles.filterView}>
            <TouchableOpacity>
              <AntDesignIcon
                style={styles.filterIcon}
                name="filter"
                size={33}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
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
    height: 45,
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
  footer: {
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
  bodyFirstRow: {
    flexDirection: "row",
    alignItems:"center",
  },
  inputView: {
    margin: 20,
    marginRight:0,
    paddingVertical: 10,
    backgroundColor: COLORS.greyBackground,
    flexDirection: "row",
    flex:1,
  },
  searchIcon: {
    marginHorizontal: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  filterIcon: {
    marginHorizontal: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 1,
  },
  filterView: {
    justifyContent: "center",
    marginRight:10,
  },
});

export default RegisterBill;
