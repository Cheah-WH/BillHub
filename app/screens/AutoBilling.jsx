import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useAuth } from "../../backend/AuthContext";

const AutoBilling = () => {
  const navigation = useNavigation();
  const { bills } = useAuth();
  const [section, setSection] = useState(0);
  const [selectedBill, setSelectedBill] = useState(null);
  const [autoPaymentDate, setAutoPaymentDate] = useState("release");
  const [paymentAmount, setPaymentAmount] = useState("fixedAmount");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [autoBills, setAutoBills] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setAutoPaymentDate("release");
    setPaymentAmount("fixedAmount");
    setInputValue("");
  }, [section]);

  useEffect(() => {
    setInputValue("");
  }, [paymentAmount]);

  const back = () => {
    if (section === 1) {
      setSection(0);
    } else {
      navigation.goBack();
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleBillSelect = (bill) => {
    setSelectedBill(bill);
    setSection(1);
    closeModal();
  };

  const handleSave = () => {
    // Logic to save AutoBilling details to the database
    setSection(0); // Switch back to Section 0 after saving
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
            <Text style={styles.title}>Auto-Billing</Text>
          </View>
          <View style={styles.headerRightView}></View>
        </View>

        {section === 0 ? (
          <View style={styles.body}>
            <TouchableOpacity style={styles.addButton} onPress={openModal}>
              <View></View>
              <Text style={styles.addButtonText}>
                Add bill for auto-billing{" "}
              </Text>
              <AntDesignIcon name="down" size={16} color="#000" />
            </TouchableOpacity>
            <Text style={styles.autoBillsHeader}>Auto-billing bills</Text>
            {autoBills.length !== 0 ? (
              <FlatList
                data={autoBills}
                renderItem={({ item }) => (
                  <View style={styles.billItem}>
                    <Text>{item.billName}</Text>
                    <Text>{item.autoPaymentDate}</Text>
                    <Text>{item.paymentAmount}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.billList}
              />
            ) : (
              <View style={styles.noBillView}>
                <Text>
                  No bill is registered with Auto-Billing, start now by adding a
                  bill
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.body1}>
            <ScrollView>
              <Text style={styles.label}>Selected Bill:</Text>
              <View style={styles.billInfoView}>
                <Image
                  source={{ uri: selectedBill.company.ImageURL }}
                  style={styles.image2}
                />
                <Text style={styles.modalItemText}>
                  {selectedBill.nickname && selectedBill.nickname.length > 25
                    ? `${selectedBill.nickname.substring(0, 50)}...`
                    : selectedBill.nickname || selectedBill.accountNumber}
                </Text>
              </View>
              <Text style={styles.label}>Auto Payment Date:</Text>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  autoPaymentDate === "release" && styles.optionButtonSelected,
                ]}
                onPress={() => setAutoPaymentDate("release")}
              >
                <Text
                  style={
                    autoPaymentDate === "release"
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  Release Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  autoPaymentDate === "duedate" && styles.optionButtonSelected,
                ]}
                onPress={() => setAutoPaymentDate("duedate")}
              >
                <Text
                  style={
                    autoPaymentDate === "duedate"
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  Due Date
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Payment Amount:</Text>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  paymentAmount === "fixedAmount" &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => setPaymentAmount("fixedAmount")}
              >
                <Text
                  style={
                    paymentAmount === "fixedAmount"
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  Fixed Amount
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  paymentAmount === "outstandingAmount" &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => setPaymentAmount("outstandingAmount")}
              >
                <Text
                  style={
                    paymentAmount === "outstandingAmount"
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  Outstanding Amount
                </Text>
              </TouchableOpacity>

              {paymentAmount === "fixedAmount" && (
                <View>
                  <Text style={styles.label}>Payment Amount:</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        marginBottom: 17,
                        marginRight: 10,
                        fontWeight: "bold",
                      }}
                    >
                      RM
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={inputValue}
                      onChangeText={setInputValue}
                      keyboardType="numeric"
                      placeholder="Enter fixed payment amount"
                    />
                  </View>
                </View>
              )}
              {paymentAmount === "outstandingAmount" && (
                <View>
                  <Text style={styles.label}>Upper Limit:</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        marginBottom: 17,
                        marginRight: 10,
                        fontWeight: "bold",
                      }}
                    >
                      RM
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={inputValue}
                      onChangeText={setInputValue}
                      keyboardType="numeric"
                      placeholder="Enter upper limit"
                    />
                  </View>
                </View>
              )}
            </ScrollView>
            <View style={styles.bottomView}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Modal for selecting bills */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0.5)"
            barStyle="light-content"
          />
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          >
            <View
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Select Bill</Text>
              <FlatList
                data={bills}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleBillSelect(item)}
                  >
                    <Image
                      source={{ uri: item.company.ImageURL }}
                      style={styles.image}
                    />
                    <Text style={styles.modalItemText}>
                      {item.nickname && item.nickname.length > 25
                        ? `${item.nickname.substring(0, 25)}...`
                        : item.nickname || item.accountNumber}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
    height:42,
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
  backIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  title: {
    fontWeight: FONTS.header.fontWeight,
    fontSize: FONTS.header.fontSize,
  },
  body: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 15,
  },
  body1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 15,
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: COLORS.greyBackground,
    flexDirection: "row",
    padding: 15,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: 15,
    marginBottom: 5,
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: COLORS.plain,
  },
  optionText: {},
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionTextSelected: {
    fontWeight: "bold",
    color: "white",
  },
  bottomView: {
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginVertical: 20,
    alignItems: "center",
    width: "60%",
  },
  saveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 18,
    width: "80%",
  },
  billItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    height: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 16,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },
  autoBillsHeader: {
    color: COLORS.primary,
    borderBottomWidth: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
  noBillView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  billInfoView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.plain,
    padding: 10,
  },
  image2: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
});

export default AutoBilling;
