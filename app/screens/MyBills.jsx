import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StatusBar,
} from "react-native";
import { COLORS, FONTS } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import BillItem from "../components/BillItem";
import { useAuth } from "../../backend/AuthContext";
import { CheckBox } from "react-native-elements";

const categories = [
  "Postpaid",
  "Water and Sewerage",
  "Electricity",
  "Internet",
  "Entertainment",
];

const MyBills = ({ route }) => {
  const { bills } = useAuth();
  const [localBills, setLocalBills] = useState(bills);
  const [filteredBills, setFilteredBills] = useState(bills);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSorted, setIsSorted] = useState(false); // Track sorting state
  const navigation = useNavigation();

  useEffect(() => {
    const { billData } = route.params || {};
    if (billData) {
      setLocalBills(billData);
    } else {
      setLocalBills(bills); // Set local bills from context if no route params
    }
  }, [route.params, bills]);

  useEffect(() => {
    filterBills();
  }, [selectedCategories, localBills]);

  const back = () => {
    navigation.goBack();
  };

  const navigateToBillDetail = (bill) => {
    navigation.navigate("BillDetail", { bill });
  };

  const sortBills = () => {
    let sortedBills;
    if (isSorted) {
      // Revert to original order
      sortedBills = bills;
    } else {
      // Sort by outstanding amount
      sortedBills = [...localBills].sort((a, b) => {
        if (a.outStandingAmount === undefined || a.outStandingAmount === null) return 1;
        if (b.outStandingAmount === undefined || b.outStandingAmount === null) return -1;
        return b.outStandingAmount - a.outStandingAmount;
      });
    }
    setLocalBills(sortedBills);
    setFilteredBills(sortedBills);
    setIsSorted(!isSorted);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const filterBills = () => {
    const filtered = localBills.filter((bill) => {
      return selectedCategories.length > 0
        ? selectedCategories.includes(bill.company.Category)
        : true;
    });
    setFilteredBills(filtered);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.screenView}>
        <View style={styles.header}>
          <View style={styles.headerLeftView}>
            <TouchableOpacity onPress={back}>
              <AntDesignIcon
                style={styles.backIcon}
                name="back"
                size={28}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerMidView}>
            <Text style={styles.title}> My Bills </Text>
          </View>
          <View style={styles.headerRightView}>
            <TouchableOpacity onPress={sortBills}>
              <FontAwesome5Icon
                style={styles.backIcon}
                name="sort-amount-down"
                size={25}
                color="#000"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <AntDesignIcon
                style={styles.backIcon}
                name="filter"
                size={28}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <FlatList
            data={filteredBills}
            keyExtractor={(bill) => bill._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToBillDetail(item)}>
                <BillItem bill={item} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalView} activeOpacity={1}>
            <Text style={styles.modalTitle}>Select Categories</Text>
            <View style={styles.filterChoices}>
              {categories.map((category) => (
                <View key={category} style={styles.checkboxContainer}>
                  <CheckBox
                    checked={selectedCategories.includes(category)}
                    onPress={() => toggleCategory(category)}
                  />
                  <Text style={styles.label}>{category}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    marginVertical: 150,
    marginHorizontal: 60,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterChoices: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  screenView: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    flex: 1,
    alignItems: "center",
  },
  headerLeftView: {
    justifyContent: "center",
    flex: 2,
  },
  headerMidView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 8,
  },
  headerRightView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 2,
  },
  body: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 15,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
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

export default MyBills;
