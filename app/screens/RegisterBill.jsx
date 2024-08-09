import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  StatusBar,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { getBillingCompanies } from "../../backend/api.js";
import CustomAlert from "../components/CustomAlert";
import { AuthContext } from "../../backend/AuthContext";
import axios from "axios";

const categories = [
  "Postpaid",
  "Water and Sewerage",
  "Electricity",
  "Internet",
  "Entertainment",
];

const RegisterBill = ({ route }) => {
  const { bills } = route.params;
  const navigation = useNavigation();
  const [billingCompanies, setBillingCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [section, setSection] = useState(1);
  const [selectedBillingCompany, setSelectedBillingCompany] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const back = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Now fetching BillingCompanies from BillHub");
      fetchBillingCompanies();
    }, [])
  );

  useEffect(() => {
    console.log("Billing Companies State: ", billingCompanies);
  }, [billingCompanies]);

  useEffect(() => {
    if (section === 1) {
      setSelectedBillingCompany(null);
      setAccountNumber("");
      setNickname("");
    }
  }, [section]);

  const fetchBillingCompanies = async () => {
    try {
      const data = await getBillingCompanies();
      const sortedData = data.sort((a, b) => a.Name.localeCompare(b.Name));
      setBillingCompanies(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const selectCompany = (selectedCompany) => {
    setSelectedBillingCompany(selectedCompany);
    setSection(2);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const filteredCompanies = billingCompanies.filter((company) => {
    const matchesSearchTerm = company.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.includes(company.Category)
        : true;
    return matchesSearchTerm && matchesCategory;
  });

  const handleInputChange = (text) => {
    setAccountNumber(text);
  };

  const handleInputChange2 = (text) => {
    setNickname(text);
  };

  const registerBillRequest = async () => {
    const userId = user._id;
    const newBill = {
      userId,
      billingCompanyId: selectedBillingCompany._id,
      accountNumber,
      nickname,
      phoneNumber: null,
      billingDate: null,
      dueDate: null,
      outStandingAmount: null,
      overdueAmount: null,
      billOwner: null,
    };

    try {
      const response = await axios.post(
        `http://${serverIPV4}:3000/registerBill`,
        newBill
      );
      if (response.status === 201) {
        // Bill created successfully
        Alert.alert("Success", "Bill registered successfully");
        navigation.navigate("Drawer");
      } else {
        // Handle unexpected response status
        Alert.alert("Error", "Failed to register the bill");
      }
    } catch (error) {
      console.error("Failed to register the bill", error);
      Alert.alert("Error", "An error occurred while registering the bill");
    }
  };

  const handleRegister = async () => {
    if (section === 2) {
      if (accountNumber.trim() === "") {
        setAlertVisible(true);
      } else {
        let foundDuplicate = false;
        bills.forEach((bill) => {
          if (bill.accountNumber === accountNumber) {
            Alert.alert(
              "The bill with this account number is already registered under your account"
            );
            foundDuplicate = true;
            return;
          }
        });
        if (!foundDuplicate){
          setSection(section + 1);
        }
      }
    }
    if (section === 3) {
      if (nickname.trim() === "") {
        setNickname(accountNumber);
      } else {
        registerBillRequest();
      }
    }
  };

  useEffect(() => {
    if (nickname === accountNumber && accountNumber !== "") {
      registerBillRequest();
    }
  }, [nickname]);

  return (
    <>
      {section === 1 && (
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
              <Text style={styles.title}> Register Bill </Text>
            </View>
            <View style={styles.headerRightView}></View>
          </View>
          <View style={styles.body}>
            <View style={styles.bodyFirstRow}>
              <View style={styles.inputView}>
                <TouchableOpacity onPress={focusInput}>
                  <AntDesignIcon
                    style={styles.searchIcon}
                    name="search1"
                    size={28}
                    color="#000"
                  />
                </TouchableOpacity>
                <TextInput
                  ref={inputRef}
                  placeholder="Enter the name of the bill"
                  onChangeText={handleSearch}
                  w={{
                    base: "75%",
                    md: "25%",
                  }}
                />
              </View>
              <View style={styles.filterView}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <AntDesignIcon
                    style={styles.filterIcon}
                    name="filter"
                    size={33}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <FlatList
                style={styles.flatList}
                data={filteredCompanies}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => selectCompany(item)}>
                    <View style={styles.bill}>
                      <Image
                        source={{ uri: item.ImageURL }}
                        style={styles.image}
                      />
                      <Text style={{ color: "black", fontSize: 14 }}>
                        {item.Name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <View style={styles.footer}></View>

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
        </View>
      )}
      {section === 2 && (
        <View style={styles.screenView2}>
          <View>
            <View style={styles.header}>
              <View style={styles.headerLeftView}>
                <AntDesignIcon
                  style={styles.backIcon}
                  name="back"
                  size={28}
                  color="#000"
                  onPress={() => setSection(1)}
                />
              </View>
              <View style={styles.headerMidView}>
                <Text style={styles.title}> Register Bill </Text>
              </View>
              <View style={styles.headerRightView}></View>
            </View>
            <View style={styles.body2}>
              <Image
                source={{ uri: selectedBillingCompany.ImageURL }}
                style={styles.image2}
              />
              <View style={styles.row}>
                <Text style={styles.label}>Selected Company: </Text>
                <Text style={styles.selectedCompanyName}>
                  {selectedBillingCompany.Name}
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter the Account / Phone Number"
                value={accountNumber}
                onChangeText={handleInputChange}
              />
            </View>
          </View>
          <View style={styles.footer2}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {section === 3 && (
        <View style={styles.screenView2}>
          <View>
            <View style={styles.header}>
              <View style={styles.headerLeftView}>
                <AntDesignIcon
                  style={styles.backIcon}
                  name="back"
                  size={28}
                  color="#000"
                  onPress={() => setSection(2)}
                />
              </View>
              <View style={styles.headerMidView}>
                <Text style={styles.title}> Register Bill </Text>
              </View>
              <View style={styles.headerRightView}></View>
            </View>
            <View style={styles.body2}>
              <Image
                source={{ uri: selectedBillingCompany.ImageURL }}
                style={styles.image2}
              />
              <View style={styles.row}>
                <Text style={styles.label}>Selected Company: </Text>
                <Text style={styles.selectedCompanyName}>
                  {selectedBillingCompany.Name}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    textAlign: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 18,
                  },
                ]}
                value={accountNumber}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Set a nickname for this bill"
                value={nickname}
                onChangeText={handleInputChange2}
              />
            </View>
          </View>
          <View style={styles.footer2}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <CustomAlert
        visible={alertVisible}
        title="Error"
        message="Account number cannot be empty."
        onConfirm={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
  body: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 15,
  },
  footer: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 1,
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
  bodyFirstRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputView: {
    margin: 20,
    marginRight: 0,
    paddingVertical: 10,
    backgroundColor: COLORS.greyBackground,
    flexDirection: "row",
    flex: 1,
  },
  searchIcon: {
    marginHorizontal: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  filterIcon: {
    marginHorizontal: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 1,
  },
  filterView: {
    justifyContent: "center",
    marginRight: 10,
  },
  flatList: {
    marginBottom: 100,
  },
  bill: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.greyBackground,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: "contain",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    marginVertical: 120,
    marginHorizontal: 50,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterChoices: {},
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  // section 2
  screenView2: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "space-between",
  },
  body2: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  footer2: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
  image2: {
    margin: 30,
    marginBottom: 20,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    width: "100%",
    height: 30,
    marginBottom: 20,
  },
  label: {
    color: COLORS.primary,
    fontSize: 15,
  },
  selectedCompanyName: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingLeft: 10,
    marginTop: 15,
    width: "75%",
    backgroundColor: COLORS.plain,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  registerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default RegisterBill;
