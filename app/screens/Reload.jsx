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
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

const ReloadPage = () => {
  const [amount, setAmount] = useState(2);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

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
    console.log("ON RELOAD");
    // 1. Create payment Intent
    const response = await createPaymentIntent(Math.floor(amount * 100));
    console.log("response: ", response);
    if (response.error) {
      Alert.alert("Step 1 Error: ", response.error);
      console.log("Step 1 Error: ", response.error);
      return;
    }

    // 2. Intialize payment sheet
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "BillHub",
      paymentIntentClientSecret: response.data.paymentIntent,
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
    console.log("The payment has succesful");
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
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>Select an amount to reload:</Text>
        {/* Add your reload options here */}
        <Button
          title="Reload $10"
          onPress={() => {
            /* handle reload */
          }}
        />
        <Button
          title="Reload $20"
          onPress={() => {
            /* handle reload */
          }}
        />
        {/* Add more options as needed */}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyBackground,
  },
  reloadButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 35,
    width: "50%",
    marginBottom: 15,
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
  },
  footerText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ReloadPage;
