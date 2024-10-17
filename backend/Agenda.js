const Agenda = require("agenda");
const User = require("./models/models/User");
const Notification = require("./models/models/Notification");
const PaymentHistory = require("./models/models/PaymentHistory");
const Receipt = require("./models/models/Receipt");
const { sendEmail } = require("./emailService");

// MongoDB URI
const mongoURI = "mongodb://localhost:27017/BillHub"; // Replace with your MongoDB URI

const agenda = new Agenda({
  db: { address: mongoURI },
});

// Define jobs
agenda.define("send email reminder", async (job) => {
  const { email, message } = job.attrs.data;
  console.log("The message sent to email: ", message);
  // Actual Email Sending
  try {
    await sendEmail({
      to: email,
      subject: "BillHub Payment Reminder",
      text: "BillHub Payment Reminder",
      html: `<p>${message}</p>`,
    });
  } catch (error) {
    console.error(`Failed to send email reminder:`, error);
  }
});

agenda.define("send notification reminder", async (job) => {
  const { userId, billId, companyId, message } = job.attrs.data;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return;
    }

    // Create and save the notification
    const notification = new Notification({
      billingCompanyId: companyId, 
      userId: userId,
      billId: billId,
      message: message,
      sender: "BillHub",
      seen: false,
    });

    await notification.save();
    console.log(`Notification saved for user ${userId} with message: ${message}`);
  } catch (error) {
    console.error("Error saving notification:", error.message);
  }
});

agenda.define("send sms reminder", async (job) => {
  const { phoneNumber, message } = job.attrs.data;
  // Your email sending logic here
  console.log(`Sending sms to ${phoneNumber} with message: ${message}`);
});

agenda.define("process-auto-billing", async (job) => {
  console.log("Scheduled Auto-Billing Executing...");
  const {
    paymentAmount,
    userId,
    billingCompanyId,
    billId,
    paymentMethod,
    transactionId,
    billNickname,
  } = job.attrs.data;

  // 1. Save Payment History
  const paymentHistory = new PaymentHistory({
    paymentDate: new Date().toISOString(),
    paymentAmount: paymentAmount,
    paymentMethod: paymentMethod,
    billId: billId,
    userId: userId,
    billingCompanyId: billingCompanyId,
    transactionId: transactionId,
  });

  await paymentHistory.save();
  console.log("Payment History Saved");

  // 2. Reduce Credit on the Amount Paid
  const user = await User.findById(userId);
  if (user) {
    user.credit -= paymentAmount;
    await user.save();
    console.log(
      `User credit reduced by RM${paymentAmount}. New credit: RM${user.credit}.`
    );
  } else {
    console.log("User not found. Unable to reduce credit.");
  }

  // 3. Save Notification about Auto-billing Payment
  const notification = new Notification({
    billingCompanyId: billingCompanyId,
    userId: userId,
    billId: billId,
    transactionId: transactionId,
    message: `Auto-billing Payment of RM${paymentAmount} has been made for bill ${billNickname}.`,
    sender: "BillHub",
    seen: false,
  });

  await notification.save();
  console.log("Notification saved");

  // 4. Save Receipt
  const receipt = new Receipt({
    userId: userId,
    paymentDate: new Date().toISOString(),
    paymentMethod: paymentMethod,
    transactionId: transactionId,
    paymentHistories: [
      {
        billId: billId,
        paymentAmount: paymentAmount,
      },
    ],
    totalAmount: paymentAmount,
  });
  await receipt.save();
  console.log("Receipt Generated");
});

(async function () {
  try {
    await agenda.start(); // Start the agenda
    console.log("Agenda has started");
    console.log("Agenda Time:", new Date().toISOString());

    // await agenda.cancel({ name: "send email reminder" });
    // console.log('Removed all "send email reminder" jobs.');

    // Schedule the job
    // await agenda.schedule('in 10 seconds', 'send email reminder', {
    //     email: 'cheah9098@gmail.com',
    //     message: 'This is a test email reminder !',
    //   });
  } catch (err) {
    console.error("Error with Agenda:", err);
  }
})();

// Schedule
const scheduleReminder = async (user, bills) => {
  console.log("Checking Bill to Schedule Reminder...");
  try {
    let counter = 1;
    for (const bill of bills) {
      console.log("Bill No ", counter);
      counter = counter + 1;
      const dueDate = new Date(bill.dueDate);
      const billingDate = new Date(bill.billingDate);

      const {
        Reminder,
        company,
        nickname,
        accountNumber,
        outStandingAmount,
        overdueAmount,
      } = bill;

      if (Reminder && Reminder.onOff) {
        if (Reminder.time.onBillRelease) {
          // Do nothing
        }

        // dayBeforeDeadline reminder scheduling
        if (Reminder.time.dayBeforeDeadline) {
          let deadlineReminderDate = new Date(dueDate);
          deadlineReminderDate.setDate(deadlineReminderDate.getDate() - 1); // Subtract 1 day to remind user 1 day earlier
          deadlineReminderDate.setHours(deadlineReminderDate.getHours() - 8); // Subtract 8 hours to follow UTC time
          if (deadlineReminderDate > new Date()) {
            console.log("Current Date Time: ", new Date());
            console.log("Deadline Reminder Date Time: ", deadlineReminderDate);
            const existingReminders = await agenda.jobs({
              "data._id": bill._id,
              nextRunAt: deadlineReminderDate,
            });

            if (existingReminders.length === 0) {
              if (Reminder.method.email) {
                await agenda.schedule(
                  deadlineReminderDate,
                  "send email reminder",
                  {
                    _id: bill._id,
                    email: user.email,
                    message: `
                    Reminder: Your bill ${nickname} with account number ${accountNumber} from ${
                      company.Name
                    } is due on ${dueDate.toDateString()}. For your information, 
                   the latest outstanding amount is RM ${outStandingAmount} and the 
                    overdue amount is RM ${overdueAmount}. 
                  `,
                  }
                );
                console.log(
                  `Scheduled deadline reminder for bill ${bill._id} with account number ${accountNumber} at ${deadlineReminderDate}`
                );
              }
              if (Reminder.method.notification){
                await agenda.schedule(
                  deadlineReminderDate,
                  "send notification reminder",
                  {
                    billId: bill._id,
                    userId: user._id,
                    companyId: company._id,
                    message: `Reminder: Your bill ${nickname} with account number ${accountNumber} from ${company.Name} is due on ${dueDate.toDateString()}.\nFor your information, the latest outstanding amount is RM ${outStandingAmount} and the overdue amount is RM ${overdueAmount}.`,
                  }
                );
                console.log(`Scheduled notification reminder for bill ${bill._id} with account number ${accountNumber} at ${deadlineReminderDate}`);
              
              }
            } else {
              console.log(
                `Deadline reminder for bill ${bill._id} is already scheduled.`
              );
            }
          }
        }
      } else if (Reminder && !Reminder.onOff) {
        // Cancel existing reminders if Reminder.onOff is false
        const canceledJobs = await agenda.cancel({ "data._id": bill._id });
        if (canceledJobs > 0) {
          console.log(
            `Canceled ${canceledJobs} reminder(s) for bill ${bill._id} with account number ${bill.accountNumber}`
          );
        } else {
          console.log(
            `No existing reminders to cancel for bill ${bill._id} with account number ${bill.accountNumber}`
          );
        }
      }
    }
  } catch (err) {
    console.error("Error scheduling or canceling reminders:", err);
  }
};

module.exports = { agenda, scheduleReminder };
