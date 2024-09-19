import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing the icon library
import { COLORS, FONTS } from "../constant";
import CustomAlert from "../components/CustomAlert";

const BillPaymentItem = ({ bill, onPaymentAmountChange }) => {
  const {
    company,
    nickname,
    accountNumber,
    dueDate,
    outStandingAmount,
    overdueAmount,
    paymentAmount,
    status,
  } = bill;
  const imageURI = company?.ImageURL;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedDueDate = dueDate ? formatDate(dueDate) : null;
  const formattedOutstandingAmount = outStandingAmount
    ? outStandingAmount.toFixed(2)
    : "0.00";
  const overdue = overdueAmount && overdueAmount > 0;

  // Calculate the number of days before the due date
  const daysBeforeDue = dueDate
    ? Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const handleEditPress = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewPaymentAmount("");
  };

  const handleOk = () => {
    const amount = parseFloat(newPaymentAmount);
    if (
      isNaN(amount) ||
      amount <= 0 ||
      amount > 999 ||
      !/^\d+(\.\d{1,2})?$/.test(newPaymentAmount)
    ) {
      setAlertTitle("Invalid Input");
      setAlertMessage(
        "Please enter a valid amount up to 999 with 2 decimal places."
      );
      setAlertVisible(true);
      return;
    }
    // Pass the updated amount to the parent component
    onPaymentAmountChange(bill._id, amount);
    setIsModalVisible(false);
    setNewPaymentAmount("");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageURI }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.nickname}>{nickname}</Text>
        {formattedDueDate && (
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDate}>{formattedDueDate}</Text>
            {daysBeforeDue !== null && (
              <Text
                style={[
                  styles.daysBeforeDue,
                  daysBeforeDue < 0 && { color: "red" },
                ]}
              >
                ({daysBeforeDue} days)
              </Text>
            )}
          </View>
        )}
        {(status === "Approved" || status === "Active") && (
          <>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Due:</Text>
              <Text style={styles.outstandingAmount}>
                RM {formattedOutstandingAmount}
              </Text>
            </View>
            {overdueAmount && overdueAmount > 0 && (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Overdue:</Text>
                <Text style={styles.overdueAmount}>
                  RM {overdueAmount.toFixed(2)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      {(status === "Approved" || status === "Active") && (
        <View style={styles.editContainer}>
          <Text style={styles.paymentAmount}>
            RM{" "}
            {paymentAmount
              ? paymentAmount.toFixed(2)
              : formattedOutstandingAmount}
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <View style={styles.editButtonContent}>
              <Icon name="edit" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0.5)"
            barStyle="light-content"
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Payment Amount</Text>
            <Text style={styles.modalText}>
              Outstanding Amount: RM {formattedOutstandingAmount}
            </Text>
            <Text style={styles.modalText}>
              Overdue Amount: RM{" "}
              {overdueAmount ? overdueAmount.toFixed(2) : "0.00"}
            </Text>
            <TextInput
              style={styles.input}
              value={newPaymentAmount}
              onChangeText={setNewPaymentAmount}
              keyboardType="numeric"
              placeholder="Enter amount to pay"
              onFocus={() => setIsModalVisible(true)} //Ensure modal stay open
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleOk}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginVertical: 5,
    backgroundColor: COLORS.greyBackground,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 103,
    flex: 1,
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nickname: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 14,
    color: "#555",
  },
  daysBeforeDue: {
    fontSize: 12,
    color: "#555",
    marginLeft: 5,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  amountLabel: {
    fontSize: 12,
    color: "#555",
    marginRight: 5,
  },
  outstandingAmount: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  overdueAmount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  paymentAmount: {
    fontWeight: "bold",
    fontSize: 15,
  },
  editContainer: {
    alignItems: "flex-end",
  },
  editButton: {
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    marginVertical: 10,
    width: "100%",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  modalButtonCancel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "darkgrey",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default BillPaymentItem;
