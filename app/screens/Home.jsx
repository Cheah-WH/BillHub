import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../backend/AuthContext";
import BillItem from "../components/BillItem";
import axios from "axios";

const HomeScreen = () => {
  const { bills, user, setUser, fetchBills } = useAuth();
  const navigation = useNavigation();
  const [credit, setCredit] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const isFocused = useIsFocused(); // Hook to get focus status

  useEffect(() => {
    console.log("user:", user);
    if (user && user.credit !== undefined) {
      setCredit(user.credit);
    }
  }, [user]);

  const updateCredit = async (amount) => {
    try {
      const response = await axios.patch(
        `http://${serverIPV4}:3000/users/${user._id}/credit`,
        { amount }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (isFocused && user && user._id) {
      fetchBills(user._id);
    }
  }, [isFocused]);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const reload = async () => {
    navigation.navigate("Reload");
    // try {
    //   const updatedUser = await updateCredit(parseFloat(100));
    //   setUser(updatedUser);
    //   Alert.alert("Success", "Credit reloaded successfully");
    // } catch (error) {
    //   const errorMessage =
    //     error.response?.data?.message || error.message || "An error occurred";
    //   Alert.alert("Error", errorMessage);
    // }
  };

  // Pull To Refresh Bills
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBills(user._id); // Use fetchBills from AuthContext
    } catch (error) {
      console.error("Failed to refresh bills", error);
      Alert.alert("Error", "An error occurred while refreshing bills");
    }
    setRefreshing(false);
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/notifications/${user._id}`
      );
      if (response.data.length === 0) {
        setNotificationCount(0);
      } else {
        const unseenCount = response.data.reduce((count, notification) => {
          return notification.seen === false ? count + 1 : count;
        }, 0);
        setNotificationCount(unseenCount);
      }
    } catch (err) {
      console.log("Error loading notification count: ", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

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
            {notificationCount > 0 && (
              <View style={styles.notificationCountView}>
                <Text>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.creditView}>
            <Text style={{ fontSize: 23 }}>{"\n"} Available Credits </Text>
            <Text style={styles.creditText}>
              {"\n RM "}
              {credit.toFixed(2)}
            </Text>
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
                navigation.navigate("MyBills", { billData: bills });
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
                navigation.navigate("BillPaymentAnalysis");
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
        <TouchableOpacity
          style={styles.pay}
          onPress={() => {
            navigation.navigate("Payment", { billData: bills });
          }}
        >
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
    width: 150,
    height: 55,
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
  notificationCountView: {
    flex: 1,
    jusitifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: 18,
    width: 17,
    marginLeft: 18,
    backgroundColor: COLORS.background,
    borderRadius: 50,
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
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 2 },
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
  noBillsText: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.text,
  },
});

export default HomeScreen;
