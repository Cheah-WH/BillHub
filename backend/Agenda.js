const Agenda = require("agenda");

// MongoDB URI
const mongoURI = "mongodb://localhost:27017/BillHub"; // Replace with your MongoDB URI

const agenda = new Agenda({
  db: { address: mongoURI },
});

// Define jobs
agenda.define("send email reminder", async (job) => {
  const { email, message } = job.attrs.data;
  // Your email sending logic here
  console.log(`Sending email to ${email} with message: ${message}`);
});

agenda.define("send notification reminder", async (job) => {
    const { email, message } = job.attrs.data;
    // Your email sending logic here
    console.log(`Sending notification to ${email} with message: ${message}`);
  });

  agenda.define("send sms reminder", async (job) => {
    const { phoneNumber, message } = job.attrs.data;
    // Your email sending logic here
    console.log(`Sending sms to ${phoneNumber} with message: ${message}`);
  });

(async function () {
  try {
    await agenda.start(); // Start the agenda
    console.log("Agenda has started");

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

const scheduleReminder = async (user, bills) => {
    try {
      for (const bill of bills) {
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
          // onBillRelease reminder scheduling
          if (Reminder.time.onBillRelease) {
            let releaseReminderDate = new Date(billingDate);
            if (releaseReminderDate > new Date()) {
              const existingReminders = await agenda.jobs({
                "data._id": bill._id,
                nextRunAt: releaseReminderDate,
              });
  
              if (existingReminders.length === 0) {
                await agenda.schedule(releaseReminderDate, "send email reminder", {
                  _id: bill._id,
                  email: user.email,
                  message: `
                    Reminder: Your bill from ${company.Name} has released on ${billingDate} and will be due on ${dueDate.toDateString()}.
                    Nickname: ${nickname || "N/A"}
                    Account Number: ${accountNumber}
                    Outstanding Amount: RM${outStandingAmount}
                    Overdue Amount: RM${overdueAmount != null ? overdueAmount : "0"}
                  `,
                });
                console.log(`Scheduled release reminder for bill ${bill._id} with account number ${accountNumber} at ${releaseReminderDate}`);
              } else {
                console.log(`Release reminder for bill ${bill._id} is already scheduled.`);
              }
            }
          }
  
          // dayBeforeDeadline reminder scheduling
          if (Reminder.time.dayBeforeDeadline) {
            let deadlineReminderDate = new Date(dueDate);
            deadlineReminderDate.setDate(deadlineReminderDate.getDate() - 1);
            if (deadlineReminderDate > new Date()) {
              const existingReminders = await agenda.jobs({
                "data._id": bill._id,
                nextRunAt: deadlineReminderDate,
              });
  
              if (existingReminders.length === 0) {
                await agenda.schedule(deadlineReminderDate, "send email reminder", {
                  _id: bill._id,
                  email: user.email,
                  message: `
                    Reminder: Your bill with account number ${accountNumber} from ${company.Name} is due on ${dueDate.toDateString()}.
                    Nickname: ${nickname || "N/A"}
                    Outstanding Amount: ${outStandingAmount}
                    Overdue Amount: ${overdueAmount}
                  `,
                });
                console.log(`Scheduled deadline reminder for bill ${bill._id} with account number ${accountNumber} at ${deadlineReminderDate}`);
              } else {
                console.log(`Deadline reminder for bill ${bill._id} is already scheduled.`);
              }
            }
          }
        } else if (Reminder && !Reminder.onOff) {
          // Cancel existing reminders if Reminder.onOff is false
          const canceledJobs = await agenda.cancel({ "data._id": bill._id });
          if (canceledJobs > 0) {
            console.log(`Canceled ${canceledJobs} reminder(s) for bill ${bill._id} with account number ${bill.accountNumber}`);
          } else {
            console.log(`No existing reminders to cancel for bill ${bill._id} with account number ${bill.accountNumber}`);
          }
        }
      }
    } catch (err) {
      console.error("Error scheduling or canceling reminders:", err);
    }
  };
  

module.exports = { agenda, scheduleReminder };
