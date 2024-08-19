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

(async function () {
  try {
    await agenda.start(); // Start the agenda
    console.log("Agenda has started");

    await agenda.cancel({ name: "send email reminder" });
    console.log('Removed all "send email reminder" jobs.');

    // Schedule the job
    // await agenda.schedule('in 10 seconds', 'send email reminder', {
    //     email: 'cheah9098@gmail.com',
    //     message: 'This is a test email reminder !',
    //   });
  } catch (err) {
    console.error("Error with Agenda:", err);
  }
})();

const scheduleReminder = async () => {
  console.log("ScheduleReminder is running on Agenda.js");
  try {
    const bills = await Bill.find({ "Reminder.onOff": true });

    for (const bill of bills) {
      const { dueDate, Reminder } = bill;
      let reminderDate = new Date(dueDate);

      if (Reminder.time.onBillRelease) {
        reminderDate = new Date(dueDate);
      } else if (Reminder.time.dayBeforeDeadline) {
        reminderDate.setDate(reminderDate.getDate() - 1);
      }

      if (reminderDate > new Date()) {
        await agenda.schedule(reminderDate, "send email reminder", {
          _id: bill._id,
          email: "example@example.com", // Adjust to fetch user email dynamically
          message: `Reminder: Your bill with account number ${
            bill.accountNumber
          } is due on ${dueDate.toDateString()}`,
        });
        console.log(
          `Scheduled reminder for bill ${bill._id} at ${reminderDate}`
        );
      }
    }
  } catch (err) {
    console.error("Error scheduling reminders:", err);
  }
};

module.exports = { agenda, scheduleReminder };
