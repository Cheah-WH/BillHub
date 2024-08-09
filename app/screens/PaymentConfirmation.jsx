import React from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import BillItem3 from "../components/BillItem3";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useAuth } from "../../backend/AuthContext";

const PaymentConfirmation = ({ route }) => {
  const { selectedBillData } = route.params;
  const [paymentMethod, setPaymentMethod] = React.useState("BillHub Credit");
  const navigation = useNavigation();
  const { user } = useAuth();

  const back = () => {
    navigation.goBack();
  };

  const totalAmount = selectedBillData.reduce(
    (sum, bill) => sum + (bill.paymentAmount || bill.outStandingAmount),
    0
  );

  const handlePay = async () => {
    try {
      const paymentHistories = selectedBillData.map((bill) => ({
        transactionId: `txn_${Date.now()}_${bill._id}`,
        billId: bill._id,
        userId: user._id,
        billingCompanyId: bill.company._id,
        paymentDate: new Date().toISOString(),
        paymentAmount: bill.paymentAmount || bill.outStandingAmount,
        paymentMethod: paymentMethod,
        status: "Completed", // Completed, Pending Or Failed
      }));

      const response = await axios.post(
        `http://${serverIPV4}:3000/savePaymentHistory`,
        paymentHistories,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Payment histories saved successfully.");
        // Navigate to another screen or perform any other actions as needed
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving payment histories:", error);
      Alert.alert("Error", "Failed to save payment histories.");
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
          <Text style={styles.title}>Payment Confirmation</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <FlatList
            data={selectedBillData}
            renderItem={({ item }) => <BillItem3 bill={item} />}
            keyExtractor={(item) => item._id.toString()}
          />
        </View>
        <View style={styles.bodyMiddle}></View>
        <View style={styles.bodyBottom}>
          <View style={styles.bottomRow1}>
            <Text style={styles.boldText}>Total Amount</Text>
            <Text style={styles.boldText}>RM {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.bottomRow2}>
            <Text>{selectedBillData.length} bills are selected to be paid</Text>
          </View>
          <View style={styles.bottomRow3}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="BillHub Credit" value="BillHub Credit" />
              <Picker.Item label="Online Banking" value="Online Banking" />
              <Picker.Item label="Debit Card" value="Debit" />
              <Picker.Item label="TnG eWallet" value="TNG" />
            </Picker>
          </View>
          <View style={styles.bottomRow4}>
            <TouchableOpacity style={styles.payButton} onPress={handlePay}>
              <Text style={styles.payText}>Pay</Text>
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
    flex: 0.5,
  },
  body: {
    flex: 15,
    justifyContent: "space-between",
  },
  bodyTop: {
    padding: 10,
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
    flex: 7,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: COLORS.plain,
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
    marginHorizontal: 5,
  },
  bottomRow2: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomRow3: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomRow4: {
    flexDirection: "row",
    justifyContent: "center",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  picker: {
    height: 4,
    width: 280,
    backgroundColor: COLORS.greyBackground,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 20,
  },
  payText: {
    fontWeight: "bold",
    fontSize: 20,
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

export default PaymentConfirmation;
