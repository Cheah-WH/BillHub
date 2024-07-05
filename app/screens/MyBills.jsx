import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { getBillingCompanies } from "../../backend/api.js";

const MyBills = () => {
  const navigation = useNavigation();
  const [billingCompanies, setBillingCompanies] = useState([]);

  const back = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Now fetching BillingCompanies from BillHub");
      fetchBillingCompanies();
    }, [])
  );

  useEffect(() => {
    console.log("Billing Companies State: ", billingCompanies);
  }, [billingCompanies]);

  const fetchBillingCompanies = async () => {
    try {
      const data = await getBillingCompanies();
      setBillingCompanies(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.screenView}>
      <View style={styles.header}>
        <View style={styles.headerLeftView}>
          <TouchableOpacity>
            <AntDesignIcon
              style={styles.backIcon}
              name="back"
              size={28}
              color="#000"
              onPress={back}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}> My Bills </Text>
        </View>
        <View style={styles.headerRightView}>
          <TouchableOpacity>
            <AntDesignIcon
              style={styles.backIcon}
              name="filter"
              size={28}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        {/* <Button
          title="consoleLog testing"
          onPress={() => {
            console.log("Now printing smtg");
          }}
        /> */}
        <FlatList
          data={billingCompanies}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <Text style={{ color: "black" }}>{item.Name}</Text>
              <Text style={{ color: "black" }}>{item.Category}</Text>
            </View>
          )}
        />
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
});

export default MyBills;
