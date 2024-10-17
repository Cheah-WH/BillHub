const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  paymentHistories: [
    {
      billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: true,
      },
      paymentAmount: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Receipt", receiptSchema);
