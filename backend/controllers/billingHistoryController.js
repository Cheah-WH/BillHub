
const BillingHistory = require('../models/models/BillingHistory');
const Notification = require('../models/models/Notification');

// Create Billing History
exports.createBillingHistory = async (req, res) => {
    try {
        const billingHistory = req.body; // Expect a single billing record

        // Validate input
        if (typeof billingHistory !== 'object' || Array.isArray(billingHistory)) {
            return res.status(400).json({ message: "Input should be a single billing record." });
        }

        // Create a single billing history
        const result = await BillingHistory.create(billingHistory);

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