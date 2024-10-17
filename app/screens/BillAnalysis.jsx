import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { COLORS, FONTS } from "../constant";

const BillAnalysis = () => {
  const navigation = useNavigation();

  const back = () => {
    navigation.goBack(); // Navigate back when back button is pressed
  };

  return (
    <View style={styles.screenView}>
      {/* Header */}
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
          <Text style={styles.title}>Bill Analysis</Text>
        </View>
        <View style={styles.headerRightView} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BillPaymentAnalysis")}
        >
            <Image
            source={require("../images/BillAnalysis/BillPaymentAnalysis.png")} 
            style={styles.image}
          />
          <Text style={styles.buttonText}>Bill Payment Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BillingAnalysis")}
        >
          <Image
            source={require("../images/BillAnalysis/BillingAnalysis.png")} 
            style={styles.image2}
          />
          <Text style={styles.buttonText}>Billing Analysis</Text>
        </TouchableOpacity>
      </View>
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
    height: 43,
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
  backIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  title: {
    fontWeight: FONTS.header.fontWeight,
    fontSize: FONTS.header.fontSize,
  },
  body: {
    flex: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: "35%",
    padding: 30,
    marginVertical: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent:"space-between"
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  image:{
    height:150,
    width:150,
    borderRadius:100,
    borderWidth:1,
    borderColor:"#000"
  },
  image2:{
    height:170,
    width:170
  }
});

export default BillAnalysis;
