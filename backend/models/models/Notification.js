const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  billingCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BillingCompany",
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    required: false,
  },
  transactionId: {
    type: String,
    required: false,
    unique: false,
  },
  sender:{
    type: String,
    default: "BillHub",
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Export the Notification model
const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
