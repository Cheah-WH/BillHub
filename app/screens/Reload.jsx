import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Button,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useStripe } from "@stripe/stripe-react-native";
import { useAuth } from "../../backend/AuthContext";
import axios from "axios";

const ReloadPage = () => {
  const [amount, setAmount] = useState();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user, setUser } = useAuth();

  const navigation = useNavigation();

  const back = () => {
    navigation.goBack();
  };

  const createPaymentIntent = async (amount) => {
    try {
      const response = await axios.post(
        `http://${serverIPV4}:3000/payments/intents`,
        {
          amount: amount, // amount in cents, e.g., 123 for RM 1.23
        }
      );

      // The client_secret is needed for Stripe payment confirmation
      const clientSecret = response.data.paymentIntent;

      return clientSecret;
    } catch (error) {
      console.error("Error creating payment intent:", error.message);
      Alert.alert("Payment Error", error.message);
    }
  };

  const onReload = async () => {
    if (!amount) {
      Alert.alert("Please enter or select a reload amount");
      return;
    }
    if (amount < 10) {
      Alert.alert("Reload amount must be at least RM10");
      return;
    }

    // 1. Create payment Intent
    const response = await createPaymentIntent(Math.floor(amount * 100));
    console.log("response: ", response);
    if (response.error) {
      console.log("Step 1 Error: ", response.error);
      return;
    }

    // 2. Intialize payment sheet
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "BillHub",
      paymentIntentClientSecret: response,
      paymentMethodTypes: ["card", "fpx"],
      defaultBillingDetails: {
        address: {
          country: "MY", // ISO 3166-1 alpha-2 country code (e.g., 'MY' for Malaysia)
        },
      },
    });
    if (initResponse.error) {
      console.log("Step 2 Error: ", initResponse.error);
      return;
    }

    // 3. Present Payment Page from Stripe
    const paymentResponse = await presentPaymentSheet();
    if (paymentResponse.error) {
      console.log("Step 3 error: ", paymentResponse.error);
      return;
    }

    // 4. Handle Payment Result
     try {
      const updatedUser = await updateCredit(parseFloat(amount));
      setUser(updatedUser);
      Alert.alert("Success", "Credit reloaded successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      Alert.alert("Error", errorMessage);
    }
  };

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

  return (
    <KeyboardAvoidingView
      style={styles.screenView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={styles.title}>Reload</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>Enter the amount to reload:</Text>
        <View style={styles.inputView}>
          <Text style={styles.inputValue}>RM</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reload amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
        </View>

        <Text style={styles.bodyText}>Or select an amount:</Text>
        <View style={styles.amountButtonsContainer}>
          {["50", "100", "200", "300", "500", "1000"].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => setAmount(value)}
              style={styles.amountButton}
            >
              <Text style={styles.amountButtonText}>RM {value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.noteView}>
          <Text style={styles.noteTextBold}>Note : </Text>
          <Text style={styles.noteText}>
            To ensure smooth auto-billing process, make sure your account is
            having sufficient credits
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onReload} style={styles.reloadButton}>
          <Text style={styles.reloadText}>Reload</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
  },
  body: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.greyBackground,
  },
  footer: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyBackground,
    paddingBottom:25,
  },
  reloadButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 35,
    width: "50%",
    marginBottom: 18,
  },
  reloadText: {
    fontWeight: "bold",
    fontSize: 18,
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
  bodyText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
    textDecorationLine: "underline",
  },
  noteView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  noteTextBold: {
    fontWeight: "bold",
    fontSize: 14,
  },
  noteText: {
    fontSize: 14,
    textAlign: "left",
    width: 300,
  },
  footerText: {
    fontSize: 16,
    color: "#333",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputValue: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 20,
    marginRight: 5,
  },
  input: {
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  amountButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amountButton: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  amountButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ReloadPage;
