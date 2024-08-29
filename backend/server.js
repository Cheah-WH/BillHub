const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
//const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const { scheduleReminder, agenda } = require("./Agenda");

const { sendEmail } = require("./emailService");

// Import Models
// const Bill = require("./models/models/Bill");
// const BillingCompany = require("./models/models/BillingCompany");
// const PaymentHistory = require("./models/models/PaymentHistory");
// const User = require("./models/models/User");
// const Notification = require("./models/models/Notification");

// Import Routes
const userRoutes = require('./routes/userRoutes');
const billingCompanyRoutes = require('./routes/billingCompanyRoutes');
const billRoutes = require('./routes/billRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentHistoryRoutes = require('./routes/paymentHistoryRoutes');
const autoBillingRoutes = require('./routes/autoBillingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint to send email
app.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send email: " + error.message);
  }
});

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/BillHub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use('/users', userRoutes);
app.use('/billing-companies', billingCompanyRoutes);
app.use('/bills', billRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payment-history', paymentHistoryRoutes);
app.use('/auto-billing', autoBillingRoutes);
app.use('/payments',paymentRoutes);

// Trigger job scheduling for reminders
app.post("/schedule-reminders", async (req, res) => {
  const { user, bills } = req.body;
  try {
    await scheduleReminder(user, bills);
  } catch (err) {
    console.log("Error scheduling reminders: ", err);
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
