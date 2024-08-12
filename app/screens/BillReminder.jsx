import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  StatusBar,
  Switch
} from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const BillReminder = () => {
  const navigation = useNavigation();
  const [isReminderOn, setIsReminderOn] = useState(false);
  const [reminderMethod, setReminderMethod] = useState("Email");
  const [reminderTimings, setReminderTimings] = useState({
    onBillRelease: true,
    dayBeforeDeadline: false,
    rightBeforeOverdue: false,
  });
  const [bills, setBills] = useState([
    { id: 0, name: "All bills are selected" },
    { id: 1, name: "Electricity Bill" },
    { id: 2, name: "Water Bill" },
    { id: 3, name: "Internet Bill" },
    { id: 4, name: "Testing 4 " },
    { id: 5, name: "Testing 5555555555 Bill" },
    { id: 6, name: "6" },
  ]);
  const [selectedBill, setSelectedBill] = useState("All bills are selected");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const back = () => {
    navigation.goBack();
  };

  const toggleReminder = () => {
    setIsReminderOn((previousState) => !previousState);
  };

  const toggleTiming = (timing) => {
    setReminderTimings((prevState) => ({
      ...prevState,
      [timing]: !prevState[timing],
    }));
  };

  const selectBill = (billName) => {
    setSelectedBill(billName);
    setIsModalVisible(false);
  };

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
                  reminderMethod === method &&
                    styles.reminderMethodButtonSelected,
                ]}
                onPress={() => setReminderMethod(method)}
              >
                <Text
                  style={[
                    styles.reminderMethodText,
                    reminderMethod === method &&
                      styles.reminderMethodTextSelected,
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
        <TouchableOpacity style={styles.saveButton}>
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
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Bill</Text>
            <FlatList
              data={bills}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectBill(item.name)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
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
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
  },
  reminderMethodButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  reminderMethodText: {
    color: "#000",
  },
  reminderMethodTextSelected: {
    color: "#fff",
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
    marginBottom:15,
  },
  saveButtonText: {
    color: "#fff",
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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalItem: {
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
});

export default BillReminder;
