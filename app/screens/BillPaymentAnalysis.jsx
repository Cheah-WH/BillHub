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
import BillPieChart from "../components/BillAnalysis/BillPieChart";
import BillLineChart from "../components/BillAnalysis/BillLineChart";

const BillPaymentAnalysis = () => {
  const navigation = useNavigation();
  const [section, setSection] = useState(0);
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0); //Total for selected month
  const [totalOfMonths, setTotalOfMonths] = useState({ //Total of each month 
    labels: [],
    values: [],
  });

  useEffect(() => {
    if (groupedHistory) {
      const labels = [];
      const values = [];

      Object.keys(groupedHistory).forEach((monthYear) => {
        labels.push(monthYear);
        const totalPayment = groupedHistory[monthYear].reduce(
          (sum, item) => sum + item.paymentAmount,
          0
        );
        values.push(totalPayment);
      });

      setTotalOfMonths({ labels, values });
    }
  }, [groupedHistory]);

  const back = () => {
    navigation.navigate("Drawer");
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
        `http://${serverIPV4}:3000/payment-history/${user._id}`
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
          <Text style={styles.title}> Bill Payment Analysis </Text>
        </View>
        <View style={styles.headerRightView}>
        <AntDesignIcon
            style={styles.backIcon}
            name="filetext1"
            size={28}
            color="#000"
            onPress={()=>{navigation.navigate("BillingAnalysis")}}
          />
        </View>
      </View>
      <View style={styles.body}>
        {(section === 0 || section === 1) && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "72%",
            }}
          >
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
            <TouchableOpacity
              style={
                section === 1
                  ? styles.selectedFooter2
                  : styles.unselectedFooter2
              }
              onPress={() => {
                if (section === 0) {
                  setSection(1);
                } else {
                  setSection(0);
                }
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 10 }}>Table</Text>

              <MaterialCommunityIcons
                name="file-table-outline"
                size={25}
                color="#000"
              />
            </TouchableOpacity>
          </View>
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
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              paddingTop: 20,
            }}
          >
            <BillLineChart data={totalOfMonths} />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={
            section === 0 || section === 1
              ? styles.selectedFooter
              : styles.unselectedFooter
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
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  unselectedFooter: {
    backgroundColor: COLORS.greyBackground,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  selectedFooter2: {
    //For button
    marginTop: 13,
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    height: 50,
  },
  unselectedFooter2: {
    //For button
    marginTop: 13,
    backgroundColor: COLORS.greyBackground,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    height: 50,
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
    marginBottom: 10,
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
    flex: 1, 
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginVertical: 10,
    resizeMode: "contain",
  },
});

export default BillPaymentAnalysis;
