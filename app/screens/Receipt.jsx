import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../../backend/AuthContext";

const Receipt = ({ route }) => {
  const { paymentHistories, totalAmount } = route.params;
  const { user, bills, fetchUserData } = useAuth();
  const navigation = useNavigation();
  const [billingDetails, setBillingDetails] = useState({});

  console.log("paymentHistories:", paymentHistories);
  console.log("Bills: ", bills);

  useEffect(() => {
    if (bills && paymentHistories) fillInBillingDetails();

    //Prepare Data to be stored
    const receiptData = {
      userId: user._id,
      paymentHistories: paymentHistories.map(payment => ({
        billId: payment.billId,
        paymentAmount: payment.paymentAmount,
      })),
      totalAmount: totalAmount,
      paymentDate: paymentHistories[0].paymentDate,
      paymentMethod: paymentHistories[0].paymentMethod,
      transactionId: paymentHistories[0].transactionId,
    };
    saveReceipt(receiptData);

  }, [bills]);

  const fillInBillingDetails = async () => {
    const details = {};
    for (const payment of paymentHistories) {
      const bill = bills.find((bill) => bill._id === payment.billId);
      if (bill) {
        details[payment.billId] = {
          billingCompanyImage: bill.company.ImageURL,
          nickname: bill.nickname,
          accountNumber: bill.accountNumber,
        };
      }
    }
    setBillingDetails(details);
  };

  console.log("paymentHistories:", paymentHistories);

  const handleBackToHome = () => {
    fetchUserData(user._id);
  };

  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);

    const dateOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-GB", dateOptions);
    const formattedTime = date.toLocaleTimeString();

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatDateAndTime(
    paymentHistories[0].paymentDate
  );

  const saveReceipt = async (receiptData) => {
    try {
      const response = await axios.post(`http://${serverIPV4}:3000/receipt`, receiptData);
      console.log("Receipt saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving receipt:", error);
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
            onPress={handleBackToHome}
          />
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}>Payment Receipt</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        <View style={styles.totalAmountView}>
          <AntDesignIcon name="checkcircle" size={50} color="green" />
          <Text style={styles.totalAmountText}>
            RM {totalAmount.toFixed(2)}
          </Text>
          <Text>Paid</Text>
        </View>
        <View style={styles.receiptInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Transaction ID:</Text>
            <View style={{ width: 150, justifyContent: "flex-end" }}>
              <Text style={styles.infoText}>
                {paymentHistories[0].transactionId}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Payment Method:</Text>
            <Text style={styles.infoText}>
              {paymentHistories[0].paymentMethod}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Payment Date:</Text>
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Payment Time:</Text>
            <Text style={styles.infoText}>{formattedTime}</Text>
          </View>
        </View>
        <FlatList
          data={paymentHistories}
          renderItem={({ item }) => {
            const billDetails = billingDetails[item.billId];
            return billDetails ? (
              <View style={styles.billItem}>
                <Image
                  source={{ uri: billDetails.billingCompanyImage }}
                  style={styles.companyImage}
                />
                <View style={styles.billDetails}>
                  <View>
                    <Text style={styles.billText}>{billDetails.nickname}</Text>
                    {billDetails.nickname != billDetails.accountNumber && (
                      <Text style={styles.billText}>
                        {billDetails.accountNumber}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.amountText}>
                      RM {item.paymentAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.billItem}>
                <Text>Loading Bill Details...</Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.billId.toString()}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.buttonText}> Done </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenView: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    height: 42,
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
    flex: 0.5,
  },
  body: {
    flex: 15,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: COLORS.plain,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1,
    margin: 10,
    marginTop:15,
  },
  receiptInfo: {
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 14,
    color: COLORS.grey,
  },
  infoText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
  },
  billItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyBackground,
  },
  companyImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  billDetails: {
    flex: 1,
  },
  billText: {
    fontSize: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  totalAmountView: {
    marginVertical: 30,
    alignItems: "center",
  },
  totalAmountText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  buttonView: {
    marginTop: 10,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 25,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
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

export default Receipt;
