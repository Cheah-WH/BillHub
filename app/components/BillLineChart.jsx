import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS } from "../constant";

const screenWidth = Dimensions.get("window").width;

const BillLineChart = ({ data }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    value: null,
    index: null,
  });

  useEffect(() => {
    console.log("Received data: ", data);
  }, [data]);

  // Shorten the labels
  const shortenedLabels = data.labels.map((label) => {
    const [month, year] = label.split(" ");
    return month.slice(0, 3) + year.slice(-2);
  });

  // Handle data point click
  const handleDataPointClick = (data) => {
    const { x, y, value, index } = data;
    setTooltip({
      visible: true,
      x,
      y,
      value,
      index,
    });
  };

  return (
    <View style={styles.container}>
      {/* Line Chart */}
      <LineChart
        data={{
          labels: shortenedLabels,
          datasets: [
            {
              data: data.values,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        fromZero={true}
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
          decimalPlaces: 0,
        }}
        style={styles.chart}
        onDataPointClick={handleDataPointClick}
      />

      {tooltip.visible && (
        <View
          style={[
            styles.tooltip,
            { top: tooltip.y - 30, left: tooltip.x - 50 },
          ]}
        >
          <Text style={styles.tooltipText}>
            {`Value: RM ${tooltip.value.toFixed(2)}`}
          </Text>
        </View>
      )}

      <View style={{ height: 25 }}></View>

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
          {shortenedLabels.map((item, index) => (
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
              <Text
                style={
                  tooltip.value !== null &&
                  data.values[index].toFixed(2) === tooltip.value.toFixed(2)
                    ? styles.tableCellSelected
                    : styles.tableCell
                }
              >
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
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 5,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
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
  tableCellSelected: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 16,
    color: COLORS.primary,
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
