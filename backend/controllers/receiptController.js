
const Receipt = require("../models/models/Receipt");

exports.createReceipt = async (req, res) => {
  try {
    const { userId, paymentHistories, totalAmount, paymentDate, paymentMethod, transactionId } = req.body;
    console.log("UserID: ",userId)
    console.log("paymentHistories: ",paymentHistories)
    console.log("totalAmount:",totalAmount)
    console.log("paymentDate:",paymentDate)
    console.log("paymentMethod:",paymentMethod)
    console.log("transactionId:", transactionId)

    if (paymentHistories.length === 0) {
      return res.status(400).json({ message: "No payment histories provided." });
    }

    const receipt = new Receipt({
      userId,
      paymentDate,
      paymentMethod,
      transactionId,
      paymentHistories: paymentHistories.map(({ billId, paymentAmount }) => ({
        billId,
        paymentAmount
      })),
      totalAmount
    });

    await receipt.save();
    res.status(201).json({ message: "Receipt created successfully", receipt });
  } catch (error) {
    console.error("Error creating receipt:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReceipt = async (req, res) => {
    try {
      const { transactionId } = req.params;
      const receipt = await Receipt.findOne({ transactionId }).populate('paymentHistories.billId');
      
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
  
      res.json(receipt);
    } catch (error) {
      console.error("Error retrieving receipt:", error);
      res.status(500).json({ message: "Server error" });
    }
  };