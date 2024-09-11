import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { useAuth } from "../../backend/AuthContext";

const SingleBillPaymentHistory = ({ route }) => {
  const { billId } = route.params;
  const navigation = useNavigation();
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [groupedPaymentHistory, setGroupedPaymentHistory] = useState({});
  const [groupedBillingHistory, setGroupedBillingHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("Payment History: ", paymentHistory);
    console.log("Billing History: ", billingHistory);
  }, [paymentHistory, billingHistory]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/payment-history/bill/${billId}`
      );
      setPaymentHistory(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error retrieving payment history:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBillingHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/billing-history/bill/${billId}`
      );
      setBillingHistory(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error retrieving billing history:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (billId) {
      fetchPaymentHistory();
      fetchBillingHistory();
    }
  }, [billId]);

  useEffect(() => {
    if (paymentHistory.length) {
      const grouped = paymentHistory.reduce((acc, item) => {
        const date = new Date(item.paymentDate);
        const monthYear = date.toLocaleString("en-GB", {
          month: "long",
          year: "numeric",
        });
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push({ ...item, type: "payment" });
        return acc;
      }, {});
      setGroupedPaymentHistory(grouped);
    }
  }, [paymentHistory]);

  useEffect(() => {
    if (billingHistory.length) {
      const grouped = billingHistory.reduce((acc, item) => {
        const date = new Date(item.billingDate);
        const monthYear = date.toLocaleString("en-GB", {
          month: "long",
          year: "numeric",
        });
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push({ ...item, type: "billing" });
        return acc;
      }, {});
      setGroupedBillingHistory(grouped);
    }
  }, [billingHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPaymentHistory();
    fetchBillingHistory();
  }, []);

  const back = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        item.type === "billing" ? { marginLeft: 3 } : { marginRight: 3 },
      ]}
      key={item._id}
    >
      <View>
        <Image
          source={{ uri: item.billingCompanyId.ImageURL }}
          style={styles.companyImage}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={{ fontSize: 11, color: "grey", fontWeight: "bold" }}>
          Name
        </Text>
        <Text style={styles.itemText}>
          {item.billId.nickname
            ? item.billId.nickname
            : item.billId.accountNumber}
        </Text>

        <Text style={{ fontSize: 11, color: "grey", fontWeight: "bold" }}>
          Date
        </Text>
        <Text style={styles.itemText}>
          {new Date(item.paymentDate || item.billingDate).toLocaleDateString(
            "en-GB"
          )}
        </Text>
      </View>
      <View>
        <Text
          style={
            item.type === "billing" ? styles.billingLabel : styles.paymentLabel
          }
        >
          {item.type === "billing" ? "Bill Issued" : "Payment"}
        </Text>
        <Text
          style={
            item.type === "billing"
              ? styles.billingAmount
              : styles.paymentAmount
          }
        >
          RM {item.paymentAmount || item.billingAmount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMonthSection = ({ item }) => (
    <View key={item.monthYear}>
      <Text style={styles.monthText}>{item.monthYear}</Text>
      {item.data.map((bill) => renderItem({ item: bill }))}
    </View>
  );

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
          <Text style={styles.title}>Bill History</Text>
        </View>
        <View style={styles.headerRightView}>
          <TouchableOpacity>
            {/* <AntDesignIcon
              style={styles.backIcon}
              name="filter"
              size={28}
              color="#000"
            /> */}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        {loading ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text>Loading...</Text>
          </View>
        ) : paymentHistory.length === 0 && billingHistory.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              padding: 20,
            }}
          >
            <Text>No billing/payment history found.</Text>
            <Text>Start to make payment to view payment history.</Text>
          </View>
        ) : (
          <FlatList
            data={[
              ...Object.entries(groupedPaymentHistory).map(
                ([monthYear, data]) => ({
                  monthYear,
                  data,
                })
              ),
              ...Object.entries(groupedBillingHistory).map(
                ([monthYear, data]) => ({
                  monthYear,
                  data,
                })
              ),
            ]}
            renderItem={renderMonthSection}
            keyExtractor={(item) => item.monthYear}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenView: {
    backgroundColor: COLORS.greyBackground,
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
    marginBottom: 15,
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
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    marginHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  companyImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: "contain",
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  billingLabel: {
    textAlign: "right",
    color: COLORS.primary,
    fontWeight: "bold",
  },
  paymentLabel: {
    textAlign: "right",
    color: "#108f10",
    fontWeight: "bold",
  },
  billingAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#108f10",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 15,
  },
});

export default SingleBillPaymentHistory;
