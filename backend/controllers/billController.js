const Bill = require('../models/models/Bill');

// Bill Registration
exports.registerBill = async (req, res) => {
  const { userId, billingCompanyId, accountNumber, nickname } = req.body;

  // Validation
  if (!userId || !billingCompanyId || !accountNumber || !nickname) {
    return res.status(400).json({ message: "Missing Credential Information." });
  }

  try {
    const newBill = new Bill({
      userId,
      billingCompanyId,
      accountNumber,
      nickname,
      phoneNumber: null,
      billingDate: null,
      dueDate: null,
      outStandingAmount: null,
      overdueAmount: null,
      billOwner: null,
    });

    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bill Retrieval
exports.getBillsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const bills = await Bill.find({ userId });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bill Information Update (Third Party - Billing Company)
exports.updateBill = async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBill) {
      return res.status(404).send("Bill not found");
    }
    res.json(updatedBill);
  } catch (err) {
    res.status(500).send("An error occurred while updating the bill");
  }
};

// Bill nickname update (User)
exports.updateBillNickname = async (req, res) => {
  try {
    const { nickname } = req.body;
    if (!nickname || nickname.trim().length === 0) {
      return res.status(400).send("Nickname cannot be empty");
    }

    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, { nickname }, { new: true });
    if (!updatedBill) {
      return res.status(404).send("Bill not found");
    }

    res.json(updatedBill);
  } catch (err) {
    res.status(500).send("An error occurred while updating the nickname");
  }
};

// Bill Deletion
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.status(200).json({ message: "Bill successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Bill Reminder by BillId
exports.updateBillReminder = async (req, res) => {
  try {
    const { onOff, method, time } = req.body.Reminder;
    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "Reminder.onOff": onOff,
          "Reminder.method": method,
          "Reminder.time": time,
        },
      },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).send("Bill not found");
    }
    res.json(updatedBill);
  } catch (err) {
    res.status(500).send("An error occurred while updating the bill reminder");
  }
};

// Update Bill Reminders for All Bills of a User
exports.updateAllBillReminders = async (req, res) => {
  try {
    const { onOff, method, time } = req.body.Reminder;
    const updatedBills = await Bill.updateMany(
      { userId: req.params.userId },
      {
        $set: {
          "Reminder.onOff": onOff,
          "Reminder.method": method,
          "Reminder.time": time,
        },
      },
      { new: true }
    );

    if (updatedBills.matchedCount === 0) {
      return res.status(404).send("No bills found for this user");
    }

    res.json({ message: "Bill reminders updated successfully", updatedBills });
  } catch (err) {
    res.status(500).send("An error occurred while updating bill reminders");
  }
};

