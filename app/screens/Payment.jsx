import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Checkbox from "expo-checkbox";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import BillPaymentItem from "../components/BillPaymentItem";
import { useAuth } from "../../backend/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Payment = ({ route }) => {
  const { bills } = useAuth();
  const [localBills, setLocalBills] = useState(bills);
  const [selectedBills, setSelectedBills] = useState([]);
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);

  useEffect(() => {
    const { billData } = route.params || {};
    if (billData) {
      setLocalBills(billData);
    } else {
      setLocalBills(bills); // Set local bills from context if no route params
    }
  }, [route.params, bills]);

  const navigation = useNavigation();

  const back = () => {
    navigation.goBack();
  };

  const updatePaymentAmount = (billId, newAmount) => {
    const updatedBills = localBills.map((bill) =>
      bill._id === billId ? { ...bill, paymentAmount: newAmount } : bill
    );
    setLocalBills(updatedBills);
    calculateTotalAmount(updatedBills, selectedBills);
  };

  const calculateTotalAmount = (bills, selectedBills) => {
    const total = bills
      .filter((bill) => selectedBills.includes(bill._id))
      .reduce(
        (total, bill) =>
          total + (bill.paymentAmount || bill.outStandingAmount || 0),
        0
      );
    setTotalSelectedAmount(total);
  };

  const handleCheckboxChange = (bill) => {
    const newSelectedBills = [...selectedBills];
    const index = newSelectedBills.indexOf(bill._id);

    if (index > -1) {
      newSelectedBills.splice(index, 1);
    } else {
      newSelectedBills.push(bill._id);
    }

    setSelectedBills(newSelectedBills);
    calculateTotalAmount(localBills, newSelectedBills);
  };

  const handlePayNow = () => {
    const selectedBillData = localBills.filter((bill) =>
      selectedBills.includes(bill._id)
    );

    // Validate payment amounts
    for (const bill of selectedBillData) {
      if (
        (bill.paymentAmount && bill.paymentAmount < 1) ||
        (!bill.paymentAmount && bill.outStandingAmount < 1)
      ) {
        Alert.alert(
          "Invalid Amount",
          "Please ensure all payment amounts are at least RM 1.00",
          [{ text: "OK" }]
        );
        return;
      }
    }

    navigation.navigate("PaymentConfirmation", { selectedBillData });
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
          <Text style={styles.title}> Payment </Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
        <KeyboardAvoidingView behavior="padding">
          <FlatList
            data={localBills}
            keyExtractor={(bill) => bill._id}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <BillPaymentItem
                  bill={item}
                  onPaymentAmountChange={updatePaymentAmount} // Pass the function as a prop
                />
                <View style={styles.checkboxView}>
                  {(item.status === "Active" || item.status === "Approved") && (
                    <Checkbox
                      value={selectedBills.includes(item._id)}
                      onValueChange={() => handleCheckboxChange(item)}
                      color={
                        selectedBills.includes(item._id)
                          ? COLORS.primary
                          : undefined
                      }
                    />
                  )}
                </View>
              </View>
            )}
          />
          </KeyboardAvoidingView>
        </View>
        <View style={styles.bodyMiddle}></View>
        <View style={styles.bodyBottom}>
          <View style={styles.bottomRow1}>
            <Text style={styles.boldText}>Total Amount</Text>
            <Text style={styles.boldText}>
              RM {totalSelectedAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.bottomRow2}>
            <Text style={styles.shadowText}>
              {selectedBills.length} bills are selected
            </Text>
          </View>
          <View style={styles.bottomRow3}>
            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <Text style={styles.payText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "space-between",
  },
  bodyTop: {
    paddingTop: 10,
    paddingBottom: 31,
    flex: 14,
    backgroundColor: COLORS.plain,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1,
  },
  bodyMiddle: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bodyBottom: {
    flex: 4,
    padding: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.plain,
    paddingTop: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1,
  },
  bottomRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomRow2: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  bottomRow3: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  shadowText: {
    color: "grey",
    fontSize: 17,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  payText: {
    fontWeight: "bold",
    fontSize: 15,
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
  checkboxView: {
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Payment;
