
const BillingHistory = require('../models/models/BillingHistory');
const Bill = require('../models/models/Bill');
const Notification = require('../models/models/Notification');


// Create Billing History
exports.createBillingHistory = async (req, res) => {
    try {
        // Extract required fields from request body
        const { billId, billingDate, billingAmount, status } = req.body;

        // Validate input
        if (!billId || !billingDate || !billingAmount || !status) {
            return res.status(400).json({ message: "All fields are required: billId, billingDate, billingAmount, status." });
        }

        // Retrieve the Bill to get userId and billingCompanyId
        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({ message: "Bill not found." });
        }

        // Create a new BillingHistory record
        const billingHistory = new BillingHistory({
            billId: bill._id,
            userId: bill.userId,
            billingCompanyId: bill.billingCompanyId,
            billingDate: new Date(billingDate),
            billingAmount: billingAmount,
            status: status,
        });

        // Save the billing history record
        const result = await billingHistory.save();
        console.log("Result: ",result)
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating billing history:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Retrieve Billing History by User ID
exports.getBillingHistoryByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find billing histories for the user and populate the necessary fields
        const billingHistories = await BillingHistory.find({ userId })
            .populate({
                path: "billId",
                select: "accountNumber nickname",
            })
            .populate({
                path: "billingCompanyId",
                select: "Name ImageURL Category",
            });

        res.status(200).json(billingHistories);
    } catch (error) {
        console.error("Error retrieving billing histories:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Retrieve Billing History by Bill ID
exports.getBillingHistoryByBillId = async (req, res) => {
    try {
        const billId = req.params.billId;

        const billingHistories = await BillingHistory.find({ billId })
            .populate({
                path: "billId",
                select: "accountNumber nickname",
            })
            .populate({
                path: "billingCompanyId",
                select: "Name ImageURL Category",
            });

        res.status(200).json(billingHistories);
    } catch (error) {
        console.error("Error retrieving billing histories:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete Billing History
exports.deleteBillingHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBillingHistory = await BillingHistory.findByIdAndDelete(id);
        if (!deletedBillingHistory) {
            return res.status(404).json({ message: "Billing history not found" });
        }
        res.status(200).json({ message: "Billing history successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting billing history", error });
    }
};