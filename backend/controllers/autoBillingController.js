
const AutoBilling = require("../models/models/AutoBilling");

// Create a new AutoBilling record
exports.createAutoBilling = async (req, res) => {
  try {
    const { billId, userId, autoPaymentDate, paymentAmount, amount } = req.body;

    if (amount === undefined || amount === null) {
      return res
        .status(400)
        .json({ error: "Amount is required to automate payment." });
    }

    // Check if an AutoBilling record with the same billId already exists
    const existingAutoBilling = await AutoBilling.findOne({ billId, userId });
    if (existingAutoBilling) {
      return res
        .status(400)
        .json({ error: "AutoBilling already set for this bill." });
    }

    const newAutoBilling = new AutoBilling({
      billId,
      userId,
      autoPaymentDate,
      paymentAmount,
      amount,
    });

    await newAutoBilling.save();
    res.status(201).json(newAutoBilling);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Server Error:", error);
  }
};


// Get AutoBilling records for a specific user
exports.getAutoBillingByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const autoBillings = await AutoBilling.find({ userId: userId }).populate(
      "billId"
    );
    res.status(200).json(autoBillings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve Auto-Billing records." });
  }
};

// Update an AutoBilling record
exports.updateAutoBilling = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate that amount is provided if paymentAmount is 'fixedAmount'
    if (updatedData.amount === undefined || updatedData.amount === null) {
      return res
        .status(400)
        .json({ error: "Amount is required." });
    }

    const updatedAutoBilling = await AutoBilling.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedAutoBilling);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Auto-Billing record." });
  }
};

// Delete an AutoBilling record
exports.deleteAutoBilling = async (req, res) => {
  try {
    const { id } = req.params;
    await AutoBilling.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Auto-Billing for this bill has been removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to unregister Auto-Billing." });
  }
};
