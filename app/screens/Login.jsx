import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ImageSlider from "../components/ImageSlider";
import { COLORS, FONTS } from "../constant";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";

const images = [
  { id: 1, uri: require("../images/login1.png") },
  { id: 2, uri: require("../images/login2.png") },
  { id: 3, uri: require("../images/login3.png") },
  { id: 4, uri: require("../images/login4.jpg") },
  { id: 5, uri: require("../images/login5.jpg") },
];

const LoginScreen = () => {
  const [section, setSection] = useState(0);
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (section === 0) {
      setIdentifier("");
      setPassword("");
      setShowPassword(false);
    }
  }, [section]);

  useFocusEffect(
    React.useCallback(() => {
      setSection(0);
    }, [])
  );

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.68.107:3000/login", {
        identifier,
        password,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Login successful");
        navigation.navigate("Home");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "An error occurred during login");
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password is Clicked");
    // Navigate to Forgot Password screen
    // navigation.navigate("ForgotPassword");
  };

  return (
    <>
      {section === 0 && (
        <View style={styles.screenView}>
          <View style={styles.bodyFloatLayer}>
            <Image
              source={require("../images/logo.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.body}>
            <ImageSlider images={images} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => {
                navigation.navigate("RegisterAccount");
              }}
            >
              <Text style={styles.ButtonText}>Sign Up Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => {
                setSection(1);
              }}
            >
              <Text style={styles.ButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {section === 1 && (
        <View style={styles.screenView}>
          <View style={styles.screenView}>
            <View style={styles.header}>
              <View style={styles.headerLeftView}>
                <AntDesignIcon
                  style={styles.backIcon}
                  name="back"
                  size={28}
                  color="#000"
                  onPress={() => setSection(0)}
                />
              </View>
              <View style={styles.headerMidView}>
                <Text style={styles.title}> User Login </Text>
              </View>
              <View style={styles.headerRightView}></View>
            </View>
            <View style={styles.body2}>
              <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <View style={styles.content}>
                  <View style={styles.contentView1}>
                    <Image
                      source={require("../images/logo.png")}
                      style={styles.logo}
                    ></Image>
                    <Text style={styles.appName}>BillHub</Text>
                  </View>

                  <View style={styles.contentView3}>
                    <TextInput
                      value={identifier}
                      onChangeText={setIdentifier}
                      placeholder="Phone Number or Email"
                      style={styles.input}
                      keyboardType="email-address"
                    />
                    <View style={styles.passwordContainer}>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        style={styles.input2}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Feather
                          name={showPassword ? "eye" : "eye-off"}
                          size={24}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.footer2}>
                  <TouchableOpacity style={styles.Button} onPress={handleLogin}>
                    <Text style={styles.ButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // section 0
  screenView: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  bodyFloatLayer: {
    position: "absolute",
    width: "80%",
    marginHorizontal: "8%",
    marginTop: "8%",
    zIndex: 10,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 8,
  },
  body: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    backgroundColor: COLORS.primary,
    padding: 20,
    margin: 10,
    width: "65%",
    alignItems: "center",
    borderRadius: 25,
  },
  ButtonText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  // section 1
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
  body2: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 15,
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
  appName: {
    fontSize: 50,
    fontWeight: "bold",
  },
  logo: {
    height: 100,
    width: 100,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flex: 20,
    justifyContent: "space-between",
  },
  contentView1: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 100,
  },
  contentView3: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.greyBackground,
    marginBottom: 20,
    borderRadius: 5,
  },
  input2: {
    padding: 10,
    width: "88%",
  },
  forgotPasswordText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
    marginTop: 10,
  },
  footer2: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.greyBackground,
    borderRadius: 5,
    marginBottom: 20,
  },
  eyeIcon: {
    marginRight: 15,
  },
});

export default LoginScreen;
