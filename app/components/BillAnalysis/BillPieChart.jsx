import React from "react";
import { View, Text, Dimensions, StyleSheet, Image } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const BillPieChart = ({ data }) => {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map((item) => ({
    name: item.name,
    population: item.amount,
    color: getRandomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
    logo: item.logo, // Assuming 'logo' is part of your data object
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
          barPercentage: 0.5,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="85"
        absolute
        hasLegend={false} // Hides the default legend
      />
      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Image
              source={{ uri: item.logo }}
              style={styles.logo} // Added logo image
            />
            <Text style={styles.legendText}>
              {item.name} - {((item.population / totalAmount) * 100).toFixed(2)}
              %
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  colorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 15,
    color: "#7F7F7F",
    marginRight: 5, // Added some margin to the right for spacing
  },
  logo: {
    width: 15,
    height: 15, 
    marginLeft: 0, 
    marginRight:3,
    resizeMode: "contain", 
    // borderWidth: 1,
    // borderColor: "black",
  },
});

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default BillPieChart;
