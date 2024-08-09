import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  Button,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const BillInfo = ({ bill }) => {
  const {
    _id,
    company,
    nickname,
    accountNumber,
    dueDate,
    outStandingAmount,
    overdueAmount,
    status,
    billOwner,
  } = bill;

  const navigation = useNavigation();
  const [isEditMode, setEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [modalVisible, setModalVisible] = useState(false);

  const imageURI = company.ImageURL;

  const checkedBillOwner = billOwner ? billOwner : "-";

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "Cannot find due date";
    const date = new Date(dueDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const today = new Date();
  const formattedToday = `${today.getDate().toString().padStart(2, "0")}/${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;

  const formattedDueDate = formatDueDate(dueDate);

  const calculateDaysUntilDue = (dueDate, outstanding) => {
    if (!dueDate) {
      return "-";
    }

    if (outstanding == 0) {
      return "-";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time component to midnight
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Set the time component to midnight

    const differenceInTime = due.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays > 0 ? `${differenceInDays}` : "Due date passed";
  };

  const daysBeforeDue = calculateDaysUntilDue(dueDate);

  const formattedOutstandingAmount = outStandingAmount
    ? `RM ${outStandingAmount.toFixed(2)}`
    : "-";

  const formattedOverdueAmount = overdueAmount
    ? `RM ${overdueAmount.toFixed(2)}`
    : "-";

  const handleSaveNickname = async () => {
    setEditMode(false);
    console.log("Saving changes of bill");
    if (newNickname !== nickname) {
      if (newNickname !== "") {
        saveNickname();
      } else {
        Alert.alert("Nickname cannot be empty");
      }
    } else {
      Alert.alert("No changes have been made to the bill !");
    }
  };

  const saveNickname = async () => {
    try {
      const response = await axios.put(
        `http://${serverIPV4}:3000/bills/${_id}/nickname`,
        {
          id: _id,
          nickname: newNickname,
        }
      );

      if (response.status === 200) {
        Alert.alert("Nickname updated successfully");
        console.log("Nickname updated successfully");
      } else {
        console.log("Failed to update nickname");
        Alert.alert("Failed to update nickname");
      }
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: imageURI }} style={styles.image} />
            <View>
              <Text style={styles.infoLabel}>Company</Text>
              <Text style={styles.companyName}>{company.Name}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.rowView}>
              <Text style={styles.infoLabel}>Account Number</Text>
              <Text style={styles.infoValue}>{accountNumber}</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.rowView}>
                <Text style={styles.infoLabel}>Bill Owner</Text>
                <Text style={styles.infoValue}>{checkedBillOwner}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.rowView}>
                <Text style={styles.infoLabel}>Nickname:</Text>
                {isEditMode ? (
                  <TextInput
                    style={styles.infoValueInput}
                    value={newNickname}
                    onChangeText={setNewNickname}
                  />
                ) : (
                  <Text style={styles.infoValue}>{newNickname}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(!isEditMode)}
              >
                <FontAwesome5 name="edit" size={16} color="black" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.rowView}>
                <Text style={styles.infoLabel}>Outstanding Amount:</Text>
                <Text
                  style={
                    formattedOutstandingAmount === "-"
                      ? styles.infoValue
                      : overdueAmount
                      ? styles.infoPrimaryValue
                      : outStandingAmount
                      ? styles.infoPrimaryValue
                      : styles.infoGreenValue
                  }
                >
                  {formattedOutstandingAmount}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.rowView}>
                <Text style={styles.infoLabel}>Overdue Amount:</Text>
                <Text
                  style={
                    formattedOverdueAmount == "-"
                      ? styles.infoValue
                      : overdueAmount
                      ? styles.infoRedValue
                      : styles.infoGreenValue
                  }
                >
                  {formattedOverdueAmount}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.rowView}>
                <Text style={styles.infoLabel}>Due Date:</Text>
                <Text style={styles.infoValue}>{formattedDueDate}</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.infoLabel}>Days before due </Text>
                <Text
                  style={
                    daysBeforeDue === "-" || Number(daysBeforeDue) > 5
                      ? styles.infoValueRight
                      : styles.infoRedValue2
                  }
                >
                  {daysBeforeDue}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.rowView}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{status}</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="file-download" size={16} color="black" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={()=>navigation.navigate("BillPaymentHistory2", { billId: _id })}
            >
              <FontAwesome5 name="eye" size={16} color="black" />
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveNickname}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 35,
    paddingHorizontal: 80,
    paddingVertical: 15,
  },
  saveText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 15,
    flex: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rowView: {
    height: 45,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: "#555",
    flex: 0,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
  },
  infoValueRight: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
    marginRight: 5,
  },
  infoValueInput: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
    borderWidth: 1,
    width: 200,
  },
  infoGreenValue: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
    color: "green",
  },
  infoPrimaryValue: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
    color: COLORS.primary,
  },
  infoRedValue: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
    color: "red",
  },
  infoRedValueRight: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 2,
    color: "red",
    marginRight: 5,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    marginLeft: 4,
    fontSize: 14,
    color: "black",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "black",
  },
  rightView: {
    alignItems: "flex-end",
  },
});

export default BillInfo;
