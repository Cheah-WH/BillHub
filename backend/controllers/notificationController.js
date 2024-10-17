const Notification = require("../models/models/Notification");

// Post notification to the user
exports.createNotification = async (req, res) => {
  try {
    const { billingCompanyId, userId, billId, transactionId, sender, message } =
      req.body;

    const notification = new Notification({
      billingCompanyId: billingCompanyId || undefined,
      userId,
      billId: billId || undefined,
      transactionId: transactionId || undefined,
      sender,
      message,
      seen: false,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update notification seen status
exports.updateNotificationSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

// Get notifications for a user
exports.getNotificationsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const notifications = await Notification.find({ userId })
        .populate("billingCompanyId", "Name ImageURL")
        .populate("billId", "accountNumber nickname status")
        .populate(
          "transactionId",
          "paymentAmount paymentDate paymentMethod status"
        )
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  
      res.status(200).json(notifications);
    } catch (err) {
      console.error("Failed to retrieve notifications:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  };
  

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};
