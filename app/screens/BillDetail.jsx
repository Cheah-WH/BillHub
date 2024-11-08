import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import BillInfo from "../components/BillInfo";
import axios from "axios";
import ConfirmationModal from "../components/ConfirmationModal";
import CustomAlert from "../components/CustomAlert";

const BillDetail = ({ route }) => {
  const { bill } = route.params;
  const navigation = useNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const deleteBill = async (billId) => {
    try {
      const response = await axios.delete(
        `http://${serverIPV4}:3000/bills/${billId}`
      );
      console.log("Bill deleted", response.data);
    } catch (error) {
      console.log(
        "Error delete error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const back = () => {
    navigation.goBack();
  };

  const handleDelete = () => {
    deleteBill(bill._id);
    setDeleteModalVisible(false);
    setAlertTitle("Deleted");
    setAlertMessage("The selected bill is successfully deleted");
    setAlertVisible(true);
    navigation.navigate("Drawer");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={styles.title}>Bill Detail</Text>
        </View>
        <View style={styles.headerRightView}>
          <AntDesignIcon
            style={styles.backIcon}
            name="delete"
            size={28}
            color="#000"
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>
      </View>
      <View style={styles.body}>
        <BillInfo bill={bill} />
      </View>
      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this bill?"
      />
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
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
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyBackground,
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

export default BillDetail;
