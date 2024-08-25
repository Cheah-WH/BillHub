const PaymentHistory = require('../models/models/PaymentHistory');
const Notification = require('../models/models/Notification');

// Create Payment History
exports.createPaymentHistory = async (req, res) => {
    try {
      const paymentHistories = req.body; // Expect an array of payment records
  
      // Validate input
      if (!Array.isArray(paymentHistories)) {
        return res
          .status(400)
          .json({ message: "Input should be an array of payment records." });
      }
  
      // Create multiple payment histories
      const result = await PaymentHistory.insertMany(paymentHistories);
  
      console.log("Result returned after saving payment history: ", result);
  
      const notifications = result.map(async (history) => {
        // Populate the related documents for additional details
        const paymentHistory = await PaymentHistory.findById(history._id)
          .populate('billingCompanyId', 'Name')
          .populate('billId', 'nickname accountNumber')
          .populate('transactionId', 'paymentAmount paymentDate');
  
        // Construct the notification message
        const message = `
          RM ${history.paymentAmount.toFixed(2)} payment for ${paymentHistory.billId.nickname} has been received and will be reflected to the respective billing companies within 3 hours. Please be patient while we processing the payment.

          Nickname: ${paymentHistory.billId.nickname || 'N/A'}
          Account: ${paymentHistory.billId.accountNumber}
          Amount Paid: RM ${history.paymentAmount.toFixed(2)}
          Payment Date: ${new Date(history.paymentDate).toLocaleDateString()}
        `;
  
        return {
          billingCompanyId: paymentHistory.billingCompanyId._id,
          userId: paymentHistory.userId,
          billId: paymentHistory.billId._id,
          transactionId: history._id,
          sender: "BillHub",
          message: message.trim(),
        };
      });
  
      // Wait for all async operations to complete
      const resolvedNotifications = await Promise.all(notifications);
  
      // Save notifications
      await Notification.insertMany(resolvedNotifications);
  
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating payment history:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  

// Retrieve Payments History by User ID 
exports.getPaymentHistoryByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find payment histories for the user and populate the necessary fields
      const paymentHistories = await PaymentHistory.find({ userId })
        .populate({
          path: "billId",
          select: "accountNumber nickname",
        })
        .populate({
          path: "billingCompanyId",
          select: "Name ImageURL Category",
        });
  
      res.status(200).json(paymentHistories);
    } catch (error) {
      console.error("Error retrieving payment histories:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

// Retrieve the bill payment history based on billId
exports.getPaymentHistoryByBillId = async (req, res) => {
    try {
      const billId = req.params.billId;
  
      const paymentHistories = await PaymentHistory.find({ billId })
        .populate({
          path: "billId",
          select: "accountNumber nickname",
        })
        .populate({
          path: "billingCompanyId",
          select: "Name ImageURL Category",
        });
  
      res.status(200).json(paymentHistories);
    } catch (error) {
      console.error("Error retrieving payment histories:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

// Delete Payment History
exports.deletePaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPaymentHistory = await PaymentHistory.findByIdAndDelete(id);
    if (!deletedPaymentHistory) {
      return res.status(404).json({ message: "Payment history not found" });
    }
    res.status(200).json({ message: "Payment history successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment history", error });
  }
};
