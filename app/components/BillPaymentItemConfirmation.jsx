import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constant";

const BillPaymentItemConfirmation = ({ bill }) => {
  const {
    company,
    nickname,
    dueDate,
    outStandingAmount,
    overdueAmount,
    paymentAmount,
    status,
  } = bill;
  const imageURI = company?.ImageURL;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedDueDate = dueDate ? formatDate(dueDate) : null;
  const formattedOutstandingAmount = outStandingAmount ? outStandingAmount.toFixed(2) : "0.00";
  const overdue = overdueAmount && overdueAmount > 0;

  // Calculate the number of days before the due date
  const daysBeforeDue = dueDate ? Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageURI }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.nickname}>{nickname}</Text>
        {formattedDueDate && (
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDate}>{formattedDueDate}</Text>
            {daysBeforeDue !== null && (
              <Text style={styles.daysBeforeDue}>({daysBeforeDue} days)</Text>
            )}
          </View>
        )}
        {(status === "Approved" || status === "Active") && (
          <>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Due:</Text>
              <Text style={styles.outstandingAmount}>
                RM {formattedOutstandingAmount}
              </Text>
            </View>
            {overdueAmount && overdueAmount > 0 && (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Overdue:</Text>
                <Text style={styles.overdueAmount}>
                  RM {overdueAmount.toFixed(2)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      {(status === "Approved" || status === "Active") && (
      <View style={styles.editContainer}>
        <Text style={ styles.paymentAmount}>
          RM {paymentAmount ? paymentAmount.toFixed(2) : formattedOutstandingAmount}
        </Text>
      </View>
      )}
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
    height: 103,
    flex: 1
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
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 14,
    color: "#555",
  },
  daysBeforeDue: {
    fontSize: 12,
    color: "#555",
    marginLeft: 5,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  amountLabel: {
    fontSize: 12,
    color: "#555",
    marginRight: 5,
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
  paymentAmount:{
    fontWeight:"bold",
    fontSize: 15,
  },
  editContainer: {
    alignItems: "flex-end",
  }
});

export default BillPaymentItemConfirmation;
