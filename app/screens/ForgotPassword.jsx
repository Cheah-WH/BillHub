import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../components/CustomAlert";
import axios from "axios";

const ResetPassword = () => {
  const [section, setSection] = useState(0);
  const [email, setEmail] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertCloseAction, setAlertCloseAction] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  const navigation = useNavigation();

  const handleSendOtp = () => {
    if (!email) {
      setAlertTitle("Empty Field");
      setAlertMessage("Please enter your email");
      setAlertVisible(true);
      return;
    }
    setSection(1);
  };

  const handleVerifyOtp = () => {
    if (!email || !otp) {
      setAlertTitle("Empty Field");
      setAlertMessage("Please enter email and OTP");
      setAlertVisible(true);
      return;
    }
    if (emailOTP !== otp) {
      setAlertTitle("Incorrect OTP");
      setAlertMessage("Please enter the OTP received by your email");
      setAlertVisible(true);
      return;
    } else {
      setSection(2);
    }
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/;

  const isValidPassword = (pwd) => {
    return passwordRegex.test(pwd);
  };

  const checkPasswordRequirements = (pwd) => {
    setPasswordRequirements({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      digit: /\d/.test(pwd),
      specialChar: /[@$!%*?&#_]/.test(pwd),
    });
  };

  useEffect(() => {
    checkPasswordRequirements(newPassword);
  }, [newPassword]);

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setAlertTitle("Error");
      setAlertMessage("Passwords do not match");
      setAlertVisible(true);
      return;
    }
    if (!isValidPassword(newPassword)) {
      setAlertTitle("Error");
      setAlertMessage(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      setAlertVisible(true);
      return;
    }
    updatePassword(email, newPassword);
  };

  const updatePassword = async (email, newPassword) => {
    try {
      const response = await axios.patch(
        "http://${serverIPV4}:3000/users/resetPassword",
        {
          email: email,
          newPassword: newPassword,
        }
      );

      if (response.status === 200) {
        setAlertTitle("Success");
        setAlertMessage("Password has been reset");
        setAlertVisible(true);
        setAlertCloseAction(() => () => navigation.navigate("Login"));
      } else {
        alert("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred: " + error.response.data.message);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCloseAction) {
      alertCloseAction();
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    if (section === 1) {
      const generatedOTP = generateOTP();
      setEmailOTP(generatedOTP);
    }
  }, [section]);

  useEffect(() => {
    if (section === 1 && emailOTP !== "") {
      console.log(
        `For checking purpose: The emailOTP that will be send in email is ${emailOTP}`
      );

      const sendEmail = async () => {
        const emailData = {
          to: email,
          subject: "BillHub Forgot Password",
          text: `Your OTP is: ${emailOTP}`,
          html: `<p> Your OTP for BillHub account is: ${emailOTP}</p>`,
        };

        try {
          const response = await axios.post(
            `http://${serverIPV4}:3000/send-email`,
            emailData
          );
          setAlertTitle("OTP Sent");
          setAlertMessage("Please check your email for OTP");
          setAlertVisible(true);
          setAlertCloseAction(null);
        } catch (error) {
          if (error.response) {
            console.error(
              "Server responded with non-2xx status:",
              error.response.data
            );
            setAlertTitle("Error");
            setAlertMessage("Failed to send email. Please try again later.");
            setAlertVisible(true);
            setAlertCloseAction(null);
          } else if (error.request) {
            console.error("No response received:", error.request);
            setAlertTitle("Error");
            setAlertMessage(
              "No response received from server. Please try again later."
            );
            setAlertVisible(true);
            setAlertCloseAction(null);
          } else {
            console.error("Error setting up request:", error.message);
            setAlertTitle("Error");
            setAlertMessage(
              "Failed to send email. Please check your internet connection."
            );
            setAlertVisible(true);
          }
        }
      };
      sendEmail();
    }
  }, [emailOTP]);

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
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}>
            {section !== 2 ? "Verify Email" : "Reset Password"}
          </Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {section === 0 ? (
          <View style={styles.bodyView}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        ) : section === 1 ? (
          <View style={styles.bodyView}>
            <View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                style={styles.input2}
                keyboardType="email-address"
                editable={false}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter OTP"
                  style={styles.input}
                  secureTextEntry={!showOtp}
                  keyboardType="numerical"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowOtp(!showOtp)}
                >
                  <Feather
                    name={showOtp ? "eye" : "eye-off"}
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bodyView}>
            <View>
              <View style={styles.passwordContainer}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  style={styles.input}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Feather
                    name={showNewPassword ? "eye" : "eye-off"}
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.requirements}>
                <Requirement
                  met={passwordRequirements.length}
                  text="At least 8 characters"
                />
                <Requirement
                  met={passwordRequirements.uppercase}
                  text="At least 1 uppercase letter"
                />
                <Requirement
                  met={passwordRequirements.lowercase}
                  text="At least 1 lowercase letter"
                />
                <Requirement
                  met={passwordRequirements.digit}
                  text="At least 1 digit"
                />
                <Requirement
                  met={passwordRequirements.specialChar}
                  text="At least 1 special character"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handlePasswordReset}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Alert */}
      <CustomAlert
        visible={alertVisible}
        onClose={handleAlertClose}
        title={alertTitle}
        message={alertMessage}
      />
    </KeyboardAvoidingView>
  );
};

const Requirement = ({ met, text }) => (
  <View style={styles.requirement}>
    <Feather
      name={met ? "check-circle" : "x-circle"}
      size={24}
      color={met ? COLORS.success : COLORS.error}
    />
    <Text style={styles.requirementText}>{text}</Text>
  </View>
);

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
  title: {
    fontWeight: FONTS.header.fontWeight,
    fontSize: FONTS.header.fontSize,
  },
  body: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.greyBackground,
    justifyContent: "space-between",
  },
  bodyView: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  input: {
    height: 50,
    width: 300,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  input2: {
    height: 50,
    width: 300,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000",
    textAlign: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  eyeIcon: {
    marginLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 35,
    width: "80%",
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  backIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  requirements: {
    width: "100%",
    marginBottom: 20,
    marginLeft: 10,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  requirementText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ResetPassword;
