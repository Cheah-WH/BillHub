const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
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
  accountNumber: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  billingDate: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  outStandingAmount: {
    type: Number,
    default: null,
  },
  overdueAmount: {
    type: Number,
    default: null,
  },
  billOwner: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "Pending",
  },
  Reminder: {
    onOff: {
      type: Boolean,
      default: false,
    },
    method: {
      email: {
        type: Boolean,
        default: false,
      },
      notification: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
    time: {
      onBillRelease: {
        type: Boolean,
        default: true,
      },
      dayBeforeDeadline: {
        type: Boolean,
        default: false,
      },
    },
  },
});

module.exports = mongoose.model("Bill", BillSchema);
