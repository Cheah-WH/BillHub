const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billingCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BillingCompany",
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["BillHub Credit", "Debit Card", "Online Banking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentHistory", PaymentHistorySchema);
