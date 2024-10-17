const mongoose = require("mongoose");

const BillingHistorySchema = new mongoose.Schema(
  {
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
    billingDate: {
      type: Date,
      required: true,
    },
    billingAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BillingHistory", BillingHistorySchema);
