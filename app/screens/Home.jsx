import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../backend/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import BillItem from "../components/BillItem";

const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const fetchBills = async () => {
    try {
      // Fetch the bills for the logged-in user
      const response = await axios.get(
        `http://192.168.68.107:3000/bills/${user._id}`
      );
      if (response.status === 200) {
        const billsData = response.data;

        // Fetch the billing company data for each bill
        const billsWithCompanyData = await Promise.all(
          billsData.map(async (bill) => {
            const companyResponse = await axios.get(
              `http://192.168.68.107:3000/billingcompanies/${bill.billingCompanyId}`
            );
            return {
              ...bill,
              company: companyResponse.data,
            };
          })
        );

        setBills(billsWithCompanyData);
      } else {
        Alert.alert("Error", "Failed to retrieve bills");
      }
    } catch (error) {
      console.error("Failed to retrieve bills", error);
      Alert.alert("Error", "An error occurred while retrieving bills");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBills();
    }, [])
  );

  useEffect(() => {
    console.log("Bills Retrieved: ", bills);
  }, [bills]);

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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Notification");
            }}
          >
            <Ionicons
              style={styles.notificationIcon}
              name="notifications-outline"
              size={28}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.creditView}>
            <Text style={{ fontSize: 23 }}>{"\n"} Available Credits </Text>
            <Text style={styles.creditText}>{"\n"} RM 688.88 </Text>
            <TouchableOpacity style={styles.reloadButton} onPress={reload}>
              <Text style={styles.reloadText}>+ Reload</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bodyBottom}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Bills</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MyBills");
              }}
            >
              <Text style={styles.headerText2}>View All</Text>
            </TouchableOpacity>
          </View>
          {bills.length > 0 ? (
            <FlatList
              data={bills}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("BillDetail", { bill: item });
                  }}
                  activeOpacity={0.8}
                >
                  <BillItem bill={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <Text style={styles.noBillsText}>No bills available</Text>
          )}
        </View>
      </View>
      <View style={styles.bodyFloatLayer}>
        <View style={styles.ThreeView}>
          <View>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("RegisterBill", { bills });
              }}
            >
              <Image
                source={require("../images/AddBill.png")}
                style={styles.image}
              />
              <Text style={{ fontSize: 12 }}>Add Bill</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("BillAnalysis");
              }}
            >
              <Image
                source={require("../images/BillAnalysis.png")}
                style={styles.image}
              />
              <Text style={{ fontSize: 12 }}>Bill Analysis</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("AutoBilling");
              }}
            >
              <Image
                source={require("../images/AutoBilling.png")}
                style={styles.image}
              />
              <Text style={{ fontSize: 12 }}>Auto-billing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.pay}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Pay</Text>
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
    backgroundColor: COLORS.plain,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    height: "35%",
  },
  bodyBottom: {
    backgroundColor: COLORS.background,
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  footer: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pay: {
    backgroundColor: COLORS.primary,
    width: 100,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    borderRadius: 30,
  },
  menuIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  title: {
    fontWeight: FONTS.header.fontWeight,
    fontSize: FONTS.header.fontSize,
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
    fontSize: 25,
    fontWeight: "bold",
  },
  reloadButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 15,
    margin: 30,
  },
  reloadText: {
    color: "#000",
    fontWeight: "bold",
  },
  bodyFloatLayer: {
    position: "absolute",
    width: "100%",
    marginHorizontal: "10%",
    marginTop: "65%",
  },
  ThreeView: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    width: "80%",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderRadius: 10,
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
  headerText: {
    fontSize: 15,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  headerText2: {
    fontSize: 15,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
});

export default HomeScreen;
