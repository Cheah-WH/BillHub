import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constant";

const BillItem = ({ bill }) => {
  const {
    company,
    nickname,
    accountNumber,
    dueDate,
    outStandingAmount,
    overdueAmount,
    status,
  } = bill;
  const imageURI = company.ImageURL;

  // Check if dueDate is not null and format the date
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : null;

  const formattedOutstandingAmount = outStandingAmount
    ? outStandingAmount.toFixed(2)
    : "0.00";

  // Determine if the bill is overdue
  const overdue = overdueAmount && overdueAmount > 0;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageURI }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.accountNumber}>{accountNumber}</Text>
        {formattedDueDate && (
          <Text style={styles.dueDate}>Due Date: {formattedDueDate}</Text>
        )}
      </View>
      <Text>
        {(status === "Approved") ? (
          <Text style={overdue ? styles.overdueAmount : styles.outstandingAmount}>
            RM {formattedOutstandingAmount}
          </Text>
        ) : (
          <Text style={styles.outstandingAmount}>{status}</Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginVertical: 5,
    backgroundColor: COLORS.greyBackground,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 80,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nickname: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accountNumber: {
    fontSize: 12,
  },
  dueDate: {
    fontSize: 14,
    color: "#555",
  },
  outstandingAmount: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  overdueAmount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
});

export default BillItem;
