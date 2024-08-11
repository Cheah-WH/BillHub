import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, FONTS, serverIPV4 } from "../constant";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useAuth } from "../../backend/AuthContext";
import { Picker } from "@react-native-picker/picker";
import BillPieChart from "../components/BillPieChart";
import BillLineChart from "../components/BillLineChart";

const BillAnalysis = () => {
  const navigation = useNavigation();
  const [section, setSection] = useState(0);
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0); // State for total payment amount

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","July","Aug","Sep","Oct"],
    values: [100, 200, 150, 300, 250, 400,500, 600,700,800,900],
  };

  const back = () => {
    navigation.goBack();
  };

  useEffect(() => {
    console.log("Payment History: ", paymentHistory);
  }, [paymentHistory]);

  useEffect(() => {
    console.log("BillPieChart Data: ", pieChartData);
  }, [pieChartData]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/paymentHistory/${user._id}`
      );
      setPaymentHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving payment history:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User id: ", user._id);
    fetchPaymentHistory();
  }, [user]);

  useEffect(() => {
    if (paymentHistory.length) {
      const grouped = paymentHistory.reduce((acc, item) => {
        const date = new Date(item.paymentDate);
        const monthYear = date.toLocaleString("en-GB", {
          month: "long",
          year: "numeric",
        });
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(item);
        return acc;
      }, {});
      setGroupedHistory(grouped);
    }
  }, [paymentHistory]);

  useEffect(() => {
    if (groupedHistory) {
      const availableMonths = Object.keys(groupedHistory);
      setMonths(availableMonths);
      setSelectedMonth(availableMonths[0]); // Update default month
    }
  }, [groupedHistory]);

  useEffect(() => {
    if (selectedMonth && groupedHistory[selectedMonth]) {
      console.log("History of the month:", groupedHistory[selectedMonth]);
      const updatedPieChartData = groupedHistory[selectedMonth].map((item) => {
        const name = item.billId.nickname || item.billId.accountNumber;
        const amount = item.paymentAmount;
        const logo = item.billingCompanyId.ImageURL;
        return { name, amount, logo };
      });
      setPieChartData(updatedPieChartData);

      // Calculate total payment amount for the selected month
      const totalAmount = updatedPieChartData.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      setTotalPaymentAmount(totalAmount); // Update the total payment amount
    }
  }, [selectedMonth, groupedHistory]);

  return (
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
          <Text style={styles.title}> Bill Analysis </Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        {(section === 0 || section === 1 )
          && (
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          )}
        {section === 0 && (
          <View style={styles.section0View}>
            <BillPieChart data={pieChartData} />
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountText}>
                Total: RM {totalPaymentAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        {section === 1 && (
          <View style={styles.section1View}>
            <ScrollView style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>
                    Bill
                  </Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>
                    Payment
                  </Text>
                </View>
                {pieChartData.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0
                        ? styles.tableRowEven
                        : styles.tableRowOdd,
                    ]}
                  >
                    <View style={styles.logoNameContainer}>
                      <Image source={{ uri: item.logo }} style={styles.image} />
                      <Text style={styles.tableCell}>{item.name}</Text>
                    </View>

                    <Text style={styles.tableCell}>
                      {" "}
                      RM {item.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountText}>
                Total: RM {totalPaymentAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        {section === 2 && (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1, paddingTop:20 }}
          >
            <BillLineChart data={lineChartData} />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={
            section === 0 ? styles.selectedFooter : styles.unselectedFooter
          }
          onPress={() => {
            setSection(0);
          }}
        >
          <Text style={{ fontWeight: "bold" }}> Month </Text>
          <MaterialCommunityIcons name="chart-pie" size={50} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={
            section === 1 ? styles.selectedFooter : styles.unselectedFooter
          }
          onPress={() => {
            setSection(1);
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Table</Text>

          <MaterialCommunityIcons
            name="file-table-outline"
            size={50}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={
            section === 2 ? styles.selectedFooter : styles.unselectedFooter
          }
          onPress={() => {
            setSection(2);
          }}
        >
          <Text style={{ fontWeight: "bold" }}> Year </Text>

          <MaterialCommunityIcons name="chart-line" size={50} color="#000" />
        </TouchableOpacity>
      </View>
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
    flex: 1,
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
    flex: 12,
    alignItems: "center",
  },
  footer: {
    paddingVertical: 0,
    paddingHorizontal: 30,
    flex: 3,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  selectedFooter: {
    backgroundColor: COLORS.primary,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  unselectedFooter: {
    backgroundColor: COLORS.greyBackground,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
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
  // Section 0
  section0View: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  picker: {
    width: 200,
    backgroundColor: COLORS.greyBackground,
    marginTop: 15,
  },
  totalAmountContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.plain,
    padding: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 10, // Adds rounded corners
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android elevation
    elevation: 5,
    width: 280,
  },

  totalAmountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  // Section 1
  section1View: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  tableContainer: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
  },
  tableHeader: {
    backgroundColor: COLORS.primary,
    color: "#fff",
    fontWeight: "bold",
  },
  tableRowOdd: {
    backgroundColor: "#f2f2f2",
  },
  tableRowEven: {
    backgroundColor: "#fff",
  },
  logoNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allow it to take up space as needed
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 10, // Add some margin to the right of the image
    marginVertical: 10,
    resizeMode: "contain",
  },
});

export default BillAnalysis;
