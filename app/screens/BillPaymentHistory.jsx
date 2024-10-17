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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BillPaymentHistory = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/payment-history/${user._id}`
      );
      const sortedHistory = response.data.sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );
      setPaymentHistory(sortedHistory);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error retrieving payment history:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user]);

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
        acc[monthYear].push(item);
        return acc;
      }, {});
      setGroupedHistory(grouped);
    }
  }, [paymentHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPaymentHistory();
  }, []);

  const back = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        key={item._id}
        onPress={() => {
          navigation.navigate("ReceiptReview", {
            receiptId: item.transactionId,
          });
        }}
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
            Payment Date
          </Text>
          <Text style={styles.itemText}>
            {new Date(item.paymentDate).toLocaleDateString("en-GB")}
          </Text>
        </View>
        <View>
          <Text
            style={
              item.status === "Completed" ? styles.itemText2 : styles.itemText3
            }
          >
            RM {item.paymentAmount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.title}>Payment History</Text>
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
        {loading ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text>Loading...</Text>
          </View>
        ) : Object.keys(groupedHistory).length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 550,
            }}
          >
            <MaterialCommunityIcons
              name="note-alert-outline"
              size={100}
              color={COLORS.primary}
            />
            <Text style={styles.noBillsText}>
              No histories found. 
            </Text>
            <Text style={styles.noBillsText}>
              Make Payment Now !
            </Text>
          </View>
        ) : (
          <FlatList
            data={Object.entries(groupedHistory).map(([monthYear, data]) => ({
              monthYear,
              data,
            }))}
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
  itemText2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#108f10",
  },
  itemText3: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10,
  },
  noBillsText:{
    fontWeight:"bold",
  }
});

export default BillPaymentHistory;
