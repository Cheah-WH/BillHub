import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import axios from "axios";

// Section Components
// Section 1
const EnterMobileNumber = ({ setSection, phoneNumber, setPhoneNumber }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Enter Your Mobile Number</Text>
    <TextInput
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      placeholder="Mobile Number  (Eg: 0123456789)"
      style={styles.input}
      keyboardType="phone-pad"
    />
  </View>
);

// Section 2
const EnterOTP = ({ setSection }) => {
  const [counter, setCounter] = useState(300);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Enter OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="OTP"
        style={styles.input}
        keyboardType="number-pad"
      />
      <TouchableOpacity
        style={styles.resendButton}
        onPress={() => setCounter(180)}
        disabled={counter > 0}
      >
        <Text style={styles.resendButtonText}>
          {counter > 0 ? (
            `Resend OTP in ${counter}s`
          ) : (
            <>
              <Text style={styles.resendBoldUnderline}>Resend</Text> OTP
            </>
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Section 3
const SetupAccount = ({
  setSection,
  name,
  setName,
  id,
  setId,
  birthday,
  setBirthday,
  email,
  setEmail,
}) => (
  <ScrollView>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Setup Account</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        style={styles.input}
      />
      <TextInput
        value={id}
        onChangeText={setId}
        placeholder="NRIC Number"
        style={styles.input}
      />
      <TextInput
        value={birthday}
        onChangeText={setBirthday}
        placeholder="Birthday"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        style={styles.input}
        keyboardType="email-address"
      />
    </View>
  </ScrollView>
);

// Section 4
const VerifyEmail = ({ setSection, verificationCode, setVerificationCode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Verify Email Address</Text>
    <TextInput
      value={verificationCode}
      onChangeText={setVerificationCode}
      placeholder="Email Verification Code"
      style={styles.input}
      keyboardType="number-pad"
    />
  </View>
);

// Indicator Component
const StepIndicator = ({ currentStep }) => (
  <View style={styles.indicatorContainer}>
    {[1, 2, 3, 4].map((step) => (
      <View key={step} style={styles.indicatorContainer}>
        <View
          style={[
            styles.indicator,
            {
              backgroundColor:
                currentStep === step ? COLORS.primary : COLORS.greyBackground,
            },
          ]}
        >
          <Text style={styles.indicatorText}>{step}</Text>
        </View>
        <View>
          {step !== 4 && (
            <AntDesignIcon
              style={styles.backIcon}
              name="arrowright"
              size={20}
              color="#000"
            />
          )}
        </View>
      </View>
    ))}
  </View>
);

// Main RegisterAccount Component
const RegisterAccount = () => {
  const navigation = useNavigation();
  const [section, setSection] = useState(3);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const back = () => {
    navigation.goBack();
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const isValidEmail = (mail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
  };

  const isValidID = (id) => {
    const idRegex = /^\d{6}[0-1][0-4]\d{4}$/;
    return idRegex.test(id);
  };

  const handleNext = () => {
    if (section === 1 && !isValidPhoneNumber(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }
    if (section === 3) {
      if (!name || !id || !birthday || !email) {
        Alert.alert("Incomplete Form", "Please fill in all fields.");
        return;
      }
      if (!isValidID(id)) {
        Alert.alert("Invalid ID", "Please enter a valid NRIC number.");
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
    } else if (section === 4) {
      if (!verificationCode) {
        Alert.alert(
          "Verification Code Required",
          "Please enter the verification code."
        );
        return;
      }
    }

    setSection((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    if (section === 4) {
      const sendEmail = async () => {
        const emailData = {
          to: email,
          subject: "Email Verification",
          text: `Your OTP is: ${generateOTP()}`,
          html: `<p>Your OTP for BillHub is: ${generateOTP()}</p>`,
        };

        try {
          const response = await axios.post(
            "http://192.168.68.107:3000/send-email",
            emailData
          );
          Alert.alert("Email Sent", "Please check your email for OTP.");
        } catch (error) {
          if (error.response) {
            console.error(
              "Server responded with non-2xx status:",
              error.response.data
            );
            Alert.alert(
              "Error",
              "Failed to send email. Please try again later."
            );
          } else if (error.request) {
            console.error("No response received:", error.request);
            Alert.alert(
              "Error",
              "No response received from server. Please try again later."
            );
          } else {
            console.error("Error setting up request:", error.message);
            Alert.alert(
              "Error",
              "Failed to send email. Please check your network connection."
            );
          }
        }
      };

      sendEmail();
    }
  }, [section]);

  return (
    <KeyboardAvoidingView
      style={styles.screenView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <View style={styles.headerLeftView}>
          <TouchableOpacity>
            <AntDesignIcon
              style={styles.backIcon}
              name="close"
              size={25}
              color="#000"
              onPress={back}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}>Register Account</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <StepIndicator currentStep={section} />
      <View style={styles.body}>
        {section === 1 && (
          <EnterMobileNumber
            setSection={setSection}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        )}
        {section === 2 && <EnterOTP setSection={setSection} />}
        {section === 3 && (
          <SetupAccount
            setSection={setSection}
            name={name}
            setName={setName}
            id={id}
            setId={setId}
            birthday={birthday}
            setBirthday={setBirthday}
            email={email}
            setEmail={setEmail}
          />
        )}
        {section === 4 && (
          <VerifyEmail
            setSection={setSection}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
          />
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {section < 4 ? "Next" : "Finish"}
          </Text>
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
    height: 45,
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
    justifyContent: "flex-start",
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    marginBottom: 30,
    borderRadius: 50,
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
  section: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
  },
  resendButton: {
    marginTop: 10,
  },
  resendButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  resendBoldUnderline: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  indicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  indicatorText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default RegisterAccount;
