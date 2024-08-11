import React from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS } from "../constant";

const screenWidth = Dimensions.get("window").width;

const BillLineChart = ({ data }) => {
  console.log("Data: ", data);
  return (
    <View style={styles.container}>
      {/* Line Chart */}
      <LineChart
        data={{
          labels: data.labels, // e.g., ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
          datasets: [
            {
              data: data.values, // e.g., [100, 200, 150, 300, 250, 400]
              strokeWidth: 2, // Optional
            },
          ],
        }}
        width={screenWidth - 40} // Adjust the width to fit your design
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier // Optional, makes the line curve
        style={styles.chart}
      />

      <View style={{height:25}}></View>

      {/* Table Header */}
      <View style={styles.tableHeaderContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.tableCell]}>Month</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Total</Text>
        </View>
      </View>

      {/* Scrollable Table */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          {data.labels.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              <View style={styles.tableCell}>
                <Text style={styles.tableCell}>{item}</Text>
              </View>
              <Text style={styles.tableCell}>
                RM {data.values[index].toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    flex: 1,
  },
  chart: {
    borderRadius: 16,
    borderColor: "#000",
    borderWidth: 0.5,
  },
  tableHeaderContainer: {
    width: 320,
    alignSelf: "center",
  },
  tableContainer: {
    marginTop: 0, 
    width: 320,
    alignSelf: "center",
    maxHeight: 200, 
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 1,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tableCell: {
    flex: 1,
    padding: 5,
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
  headerText: {
    fontWeight: "bold",
  },
});

export default BillLineChart;
