import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  StatusBar,
  Switch,
  Image,
  Alert
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../backend/AuthContext";
import axios from "axios";

const BillReminder = () => {
  const { bills, setBills, user } = useAuth();
  const navigation = useNavigation();
  const [selectedBill, setSelectedBill] = useState("All bills are selected");

  // Bills are fetched again to retrieve the changes after updating
  const fetchBills = async (userId) => {
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/bills/${userId}`
      );
      if (response.status === 200) {
        const billsData = response.data;
        const billsWithCompanyData = await Promise.all(
          billsData.map(async (bill) => {
            const companyResponse = await axios.get(
              `http://${serverIPV4}:3000/billingcompanies/${bill.billingCompanyId}`
            );
            return {
              ...bill,
              company: companyResponse.data,
            };
          })
        );
        //The retrieve bills are set to the AuthContext to keep all pages updated
        setBills(billsWithCompanyData);
      } else {
        Alert.alert("Error", "Failed to retrieve bills");
      }
    } catch (error) {
      console.error("Failed to retrieve bills", error);
      Alert.alert("Error", "An error occurred while retrieving bills");
    }
  };

  // Data to be set to bill reminder
  const [selectedBillId, setSelectedBillId] = useState("");
  const [isReminderOn, setIsReminderOn] = useState(false);
  const [reminderMethod, setReminderMethod] = useState({
    email: false,
    notification: false,
    sms: false,
  });
  const [reminderTimings, setReminderTimings] = useState({
    onBillRelease: true,
    dayBeforeDeadline: false,
  });

  // Function to send reminder data to the backend
  const saveReminderSettings = async () => {
    try {
      // Construct the reminder data object
      const reminderData = {
        onOff: isReminderOn,
        method: reminderMethod,
        time: reminderTimings,
      };

      // Send the PUT request to update the bill reminder
      console.log("Calling backend API with data passing: ", reminderData);
      const response = await axios.put(
        `http://${serverIPV4}:3000/bills/${selectedBillId}/reminder`,
        {
          Reminder: reminderData,
        }
      );

      console.log("Bill reminder updated");
      Alert.alert("The bill reminder is updated !");
      fetchBills(user._id);
    } catch (error) {
      console.error("Error updating bill reminder:", error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log(
      "The selected bill is: ",
      selectedBill,
      " ID :",
      selectedBillId
    );
  }, [selectedBill]);

  const back = () => {
    navigation.goBack();
  };

  const toggleReminder = () => {
    setIsReminderOn((previousState) => !previousState);
  };

  const toggleReminderMethod = (method) => {
    setReminderMethod((prevState) => ({
      ...prevState,
      [method.toLowerCase()]: !prevState[method.toLowerCase()],
    }));
  };

  const toggleTiming = (timing) => {
    setReminderTimings((prevState) => ({
      ...prevState,
      [timing]: !prevState[timing],
    }));
  };

  const selectBill = (billName, billId) => {
    setSelectedBill(billName);
    setSelectedBillId(billId);
    setIsModalVisible(false);
  };

  console.log("Bills:", bills);

  useEffect(() => {
    // Find the selected bill in the bills array
    const thisSelectedBill = bills.find((bill) => bill._id === selectedBillId);
  
    // If the selected bill has a Reminder object, update the state accordingly
    if (thisSelectedBill && thisSelectedBill.Reminder) {
      setIsReminderOn(thisSelectedBill.Reminder.onOff);
      setReminderMethod(thisSelectedBill.Reminder.method);
      setReminderTimings(thisSelectedBill.Reminder.time);
    } else {
      // If there's no Reminder object, set default values
      setIsReminderOn(false);
      setReminderMethod({
        email: false,
        notification: false,
        sms: false,
      });
      setReminderTimings({
        onBillRelease: true,
        dayBeforeDeadline: false,
      });
    }
  }, [selectedBillId]);
  

  return (
    <View style={styles.screenView}>
      <View style={styles.header}>
        <View style={styles.headerLeftView}>
          <AntDesign
            style={styles.backIcon}
            name="back"
            size={28}
            color="#000"
            onPress={back}
          />
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}>Bill Reminder</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>

      <View style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select bills for reminder</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedBill}</Text>
            <AntDesign name="down" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Reminder</Text>
          <View style={styles.toggleContainer}>
            <Text>OFF</Text>
            <Switch
              trackColor={{ false: "#767577", true: COLORS.primary }}
              thumbColor={isReminderOn ? COLORS.primary : "#f4f3f4"}
              onValueChange={toggleReminder}
              value={isReminderOn}
            />
            <Text>ON</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Methods</Text>
          <View style={styles.reminderMethodsContainer}>
            {["Email", "Notification", "SMS"].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.reminderMethodButton,
                  reminderMethod[method.toLowerCase()]
                    ? styles.reminderMethodButtonSelected
                    : styles.reminderMethodButtonUnselected,
                ]}
                onPress={() => toggleReminderMethod(method)}
              >
                <Text
                  style={[
                    styles.reminderMethodText,
                    reminderMethod[method.toLowerCase()]
                      ? styles.reminderMethodTextSelected
                      : styles.reminderMethodTextUnselected,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Timing</Text>
          <View style={styles.reminderTimingContainer}>
            {[
              { label: "On Bill Release", value: "onBillRelease" },
              { label: "A day before deadline", value: "dayBeforeDeadline" },
            ].map((timing) => (
              <TouchableOpacity
                key={timing.value}
                style={styles.reminderTimingItem}
                onPress={() => toggleTiming(timing.value)}
              >
                <Text style={styles.reminderTimingText}>{timing.label}</Text>
                <MaterialIcons
                  name={
                    reminderTimings[timing.value]
                      ? "check-box"
                      : "check-box-outline-blank"
                  }
                  size={24}
                  color={
                    reminderTimings[timing.value] ? COLORS.primary : "#000"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveReminderSettings}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

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
          activeOpacity={1} // Ensures the overlay captures the touch event
          onPress={() => setIsModalVisible(false)} // Closes the modal when the overlay is pressed
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
                  onPress={() => selectBill(item.nickname, item._id)}
                >
                  <Image source={{ uri: item.company.ImageURL }} style={styles.image} />
                  <Text style={styles.modalItemText}>{item.nickname}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
    height: 44,
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    flex: 15,
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#000",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
  },
  reminderMethodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reminderMethodButton: {
    padding: 10,
    borderRadius: 5,
  },
  reminderMethodButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor:"#000",
    borderWidth:0.5,
  },
  reminderMethodButtonUnselected: {
    backgroundColor: COLORS.plain,
    borderColor:"#000",
    borderWidth:0.5,
  },
  reminderMethodText: {
    fontSize: 16,
  },
  reminderMethodTextSelected: {
    color: "#fff",
  },
  reminderMethodTextUnselected: {
    color: "#000",
  },
  reminderTimingContainer: {
    flexDirection: "column",
  },
  reminderTimingItem: {
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reminderTimingText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    height:500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalItem: {
    flexDirection:"row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },
});

export default BillReminder;
