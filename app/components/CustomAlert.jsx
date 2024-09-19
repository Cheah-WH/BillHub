import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { COLORS, FONTS } from "../constant";

const CustomAlert = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0.5)"
          barStyle="light-content"
        />
        <View style={styles.alertBox}>
          <>
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>
          </>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertBox: {
    justifyContent: "space-between",
    width: 300,
    height: 250,
    padding: 20,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: FONTS.header.fontSize,
    fontWeight: FONTS.header.fontWeight,
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default CustomAlert;
