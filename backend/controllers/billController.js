const Bill = require("../models/models/Bill");
const User = require("../models/models/User");
const BillingCompany = require("../models/models/BillingCompany");
const Notification = require("../models/models/Notification");
const AutoBilling = require("../models/models/AutoBilling");
const BillingHistory = require("../models/models/BillingHistory");
const PaymentHistory = require("../models/models/PaymentHistory");
const Receipt = require("../models/models/Receipt");
const { agenda } = require("../Agenda");
const { sendEmail } = require("../emailService");

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

// Bill Retrieval By User Id
exports.getBillsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const bills = await Bill.find({ userId });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bill Retrieval By Bill Id
exports.getBillsByBillId = async (req, res) => {
  console.log("Reach second place");
  const { billId } = req.params;
  try {
    const bill = await Bill.findById({ billId });
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bill Information Update (Third Party - Billing Company)
// Check if Reminder has to be sent or schedule
// Check if Auto-billing has to be run or schedule
exports.updateBill = async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBill) {
      console.log("Bill not found");
      return res.status(404).send("Bill not found");
    }

    const { billingAmount, billingDate, dueDate } = req.body;
    if (billingAmount > 0) {
      const billingHistory = new BillingHistory({
        // Create a BillingHistory record
        billingDate: billingDate,
        billingAmount: billingAmount,
        status: "Completed",
        userId: updatedBill.userId,
        billingCompanyId: updatedBill.billingCompanyId,
        billId: updatedBill._id,
      });
      await billingHistory.save();

      // Check if the bill is registered with auto-billing
      const autoBilling = await AutoBilling.findOne({
        billId: updatedBill._id,
      });
      if (autoBilling) {
        const paymentAmount =
          autoBilling.paymentAmount === "fixedAmount"
            ? autoBilling.amount
            : billingAmount > autoBilling.amount
            ? autoBilling.amount
            : billingAmount; // Ensure the billingAmount does not exceed autoBilling.amount

        // Check if the payment should be made on due date or billing date
        const isDueDate = autoBilling.autoPaymentDate === "duedate";
        const isBillingDate = autoBilling.autoPaymentDate === "billingdate";

        // Case 1: Auto-billing on Due Date
        if (isDueDate) {
          let dueDateObj = new Date(dueDate);
          console.log("Current Time:", new Date().toISOString());
          console.log("Due Date: ", dueDateObj);
          dueDateObj.setHours(dueDateObj.getHours() - 8);
          console.log(
            "Adjusted Due Date (8 hours earlier):",
            dueDateObj.toISOString()
          );
          // Define the task to be run on the due date
          const task = {
            paymentAmount: paymentAmount,
            userId: updatedBill.userId,
            billingCompanyId: updatedBill.billingCompanyId,
            billId: updatedBill._id,
            paymentMethod: "BillHub Credit",
            transactionId: `txnab_${new Date().getTime()}_${
              updatedBill.userId
            }`,
            billNickname: updatedBill.nickname,
          };

          if (dueDateObj > new Date()) {
            // Schedule the task to run on the due date
            const job = await agenda.schedule(
              dueDateObj,
              "process-auto-billing",
              task
            );

            console.log(
              `Auto-billing payment of RM${paymentAmount} scheduled for Malaysia Time ${dueDate}.`
            );
          } else {
            console.log(
              "The due date has passed ! No auto-billing will be scheduled"
            );
          }
        } else {
          console.log("Auto-billing not on due date.");
        }

        // Case 2: Auto-billing on Billing Date
        if (isBillingDate) {
          // 1. Save Payment History
          transactionIdGenerated = `txnab_${new Date().getTime()}_${
            updatedBill.userId
          }`;
          const paymentHistory = new PaymentHistory({
            paymentDate: new Date().toISOString(),
            paymentAmount: paymentAmount,
            paymentMethod: "BillHub Credit",
            billId: updatedBill._id,
            userId: updatedBill.userId,
            billingCompanyId: updatedBill.billingCompanyId,
            transactionId: transactionIdGenerated,
          });

          await paymentHistory.save();
          console.log("Payment History Saved");

          // 2. Reduce Credit on the Amount Paid
          const user = await User.findById(updatedBill.userId);
          if (user) {
            user.credit -= paymentAmount;
            await user.save();
            console.log(
              `User credit reduced by RM${paymentAmount}. New credit: RM${user.credit}.`
            );
          } else {
            console.log("User not found. Unable to reduce credit.");
          }

          console.log("Updated Bill :", updatedBill);
          // 3. Save Notification about Auto-billing Payment
          const notification = new Notification({
            billingCompanyId: updatedBill.billingCompanyId,
            userId: updatedBill.userId,
            billId: updatedBill.billId,
            transactionId: undefined,
            message: `Auto-billing Payment of RM${paymentAmount} has been made for bill: ${updatedBill.nickname}.`,
            sender: "BillHub",
            seen: false,
          });

          await notification.save();
          console.log("Notification saved");

          // 4. Save Receipt
          const receipt = new Receipt({
            userId: updatedBill.userId,
            paymentDate: new Date().toISOString(),
            paymentMethod: "BillHub Credit",
            transactionId: transactionIdGenerated,
            paymentHistories: [
              {
                billId: updatedBill._id,
                paymentAmount: paymentAmount,
              },
            ],
            totalAmount: paymentAmount,
          });
          await receipt.save();
          console.log("Receipt Generated");

          console.log(
            `Auto-billing payment of RM${paymentAmount} has been made on billing date and saved to payment history.`
          );
        } else {
          console.log("Auto-billing not on billing date.");
        }
      } else {
        // REMINDER
        if (
          updatedBill.Reminder &&
          updatedBill.Reminder.onOff &&
          updatedBill.Reminder.time.onBillRelease
        ) {
          const company = await BillingCompany.findById(
            updatedBill.billingCompanyId
          );
          if (company) {
            console.log("Company:", company);
            console.log("company.Name:", company.Name);
            if (updatedBill.Reminder.method.email) {
              const message = `
              Bill Released Reminder
              \nYour bill "${updatedBill.nickname}" with account number ${
                updatedBill.accountNumber
              } from ${company.Name} is due on ${new Date(
                updatedBill.dueDate
              ).toDateString()}.
              \nOutstanding Amount: RM ${updatedBill.outStandingAmount}
              \nOverdue Amount: RM ${updatedBill.overdueAmount}
            `;
              // Retrieve user email from database
              try {
                const user = await User.findById(updatedBill.userId);
                if (!user) {
                  console.log("User not found");
                  return;
                }
                await sendEmail({
                  to: user.email,
                  subject: "BillHub Reminder",
                  text: message,
                  html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
                });
                console.log(
                  `Email sent to ${user.email} with message: ${message}`
                );
              } catch (error) {
                console.error("Error sending email:", error.message);
              }
            }
            if (updatedBill.Reminder.method.notification) {
              const message = `Reminder: Your bill ${
                updatedBill.nickname
              } with account number ${updatedBill.accountNumber} from ${
                company.name
              } is due on ${new Date(
                updatedBill.dueDate
              ).toDateString()}. For your information, the latest outstanding amount is RM ${
                updatedBill.outStandingAmount
              } and the overdue amount is RM ${updatedBill.overdueAmount}
            `;
              try {
                const notification = new Notification({
                  billingCompanyId: updatedBill.billingCompanyId,
                  userId: updatedBill.userId,
                  billId: updatedBill._id,
                  message: message,
                  sender: "BillHub",
                  seen: false,
                });

                await notification.save();
                console.log(
                  `Notification saved for user ${updatedBill.userId} with message: ${message}`
                );
              } catch (error) {
                console.error("Error saving notification:", error.message);
              }
            }
          }
        }
      }
    }

    res.json(updatedBill);
  } catch (err) {
    console.error("An error occurred while updating the bill:", err);
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

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      { nickname },
      { new: true }
    );
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
