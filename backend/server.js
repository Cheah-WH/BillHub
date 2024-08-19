const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const { scheduleReminder, agenda } = require("./Agenda");

const { sendEmail } = require("./emailService");

// Import Models
const Bill = require("./models/models/Bill");
const BillingCompany = require("./models/models/BillingCompany");
const PaymentHistory = require("./models/models/PaymentHistory");
const User = require("./models/models/User");

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

// API Endpoints
// Get Billing Companies List
app.get("/billingcompanies", async (req, res) => {
  //console.log("server.js running APP .get billingcompanies");
  try {
    const data = await BillingCompany.find();
    //console.log("Fetched Billing Companies from MongoDB: ", data);
    res.json(data);
  } catch (err) {
    console.log("Error:" + err);
    res.status(500).send(err);
  }
});

// Get Billing Company By ID
app.get("/billingcompanies/:billingCompanyId", async (req, res) => {
  //console.log("server.js running APP .get billingcompanies by ID");
  const billingCompanyId = req.params.billingCompanyId;

  try {
    // Find the billing company by ID
    const billingCompany = await BillingCompany.findById(billingCompanyId);

    if (billingCompany) {
      //console.log("Fetched User's bills from MongoDB: ", billingCompany);
      res.json(billingCompany);
    } else {
      res.status(404).send("Billing company not found");
    }
  } catch (err) {
    console.log("Error:" + err);
    res.status(500).send(err);
  }
});

// User Registration
app.post("/register", async (req, res) => {
  const { name, idNumber, phoneNumber, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email already used to registered an account !" });
  }

  const existingUser2 = await User.findOne({ phoneNumber });
  if (existingUser2) {
    return res.status(400).json({
      message: "Phone Number already used to registered an account !",
    });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    idNumber,
    phoneNumber,
    email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  try {
    // Check if the user exists using email or phone number
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // If login is successful, you can generate a token (e.g., JWT) or return user data
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Route to fetch user's data
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update user's credit
app.put("/users/:id/credit", async (req, res) => {
  try {
    const userId = req.params.id;
    const { amount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.credit = (user.credit + amount).toFixed(2);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Failed to update user credit", err);
    res.status(500).send("An error occurred while updating the user credit");
  }
});

// Bill Registration
app.post("/registerBill", async (req, res) => {
  const { userId, billingCompanyId, accountNumber, nickname } = req.body;

  //Validation
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
});

// Bill Retrieval
app.get("/bills/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const bills = await Bill.find({ userId });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bill Information Update (Third Party Company)
app.put("/bills/:id", async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBill) {
      return res.status(404).send("Bill not found");
    }
    res.json(updatedBill);
  } catch (err) {
    console.error("Failed to update bill", err);
    res.status(500).send("An error occurred while updating the bill");
  }
});

// Bill nickname update (User)
app.put("/bills/:id/nickname", async (req, res) => {
  try {
    const { nickname } = req.body; // Extract nickname from request body

    // Validate nickname (optional, add validation logic here)
    if (!nickname || nickname.trim().length === 0) {
      return res.status(400).send("Nickname cannot be empty");
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      { nickname }, // Update only the nickname field
      { new: true } // Return the updated document
    );

    if (!updatedBill) {
      return res.status(404).send("Bill not found");
    }

    res.json(updatedBill);
  } catch (err) {
    console.error("Failed to update bill nickname", err);
    res.status(500).send("An error occurred while updating the nickname");
  }
});

// Bill Deletion
app.delete("/bills/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the bill by ID
    const deletedBill = await Bill.findByIdAndDelete(id);

    // Check if the bill was found and deleted
    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Bill successfully deleted" });
  } catch (error) {
    console.error("Failed to delete bill", error);
    res.status(500).json({ message: error.message });
  }
});

// Add Bill Payment History
app.post("/savePaymentHistory", async (req, res) => {
  try {
    const paymentHistories = req.body; // Expect an array of payment records

    // Validate input
    if (!Array.isArray(paymentHistories)) {
      return res
        .status(400)
        .json({ message: "Input should be an array of payment records." });
    }

    // Create multiple payment histories
    const result = await PaymentHistory.insertMany(paymentHistories);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Retrieve the bill payments history of a user
app.get("/paymentHistory/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find payment histories for the user and populate the necessary fields
    const paymentHistories = await PaymentHistory.find({ userId })
      .populate({
        path: "billId",
        select: "accountNumber nickname",
      })
      .populate({
        path: "billingCompanyId",
        select: "Name ImageURL Category",
      });

    res.status(200).json(paymentHistories);
  } catch (error) {
    console.error("Error retrieving payment histories:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Retrieve the bill payment history based on billId
app.get("/paymentHistory2/:billId", async (req, res) => {
  try {
    const billId = req.params.billId;

    const paymentHistories = await PaymentHistory.find({ billId })
      .populate({
        path: "billId",
        select: "accountNumber nickname",
      })
      .populate({
        path: "billingCompanyId",
        select: "Name ImageURL Category",
      });

    res.status(200).json(paymentHistories);
  } catch (error) {
    console.error("Error retrieving payment histories:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update Bill Reminder by BillId
app.put("/bills/:id/reminder", async (req, res) => {
  console.log("Backend updating bill reminder...");
  try {
    // Extract reminder data from the request body
    const { onOff, method, time } = req.body.Reminder;

    // Update the bill with the new reminder information
    console.log("Bill ID to be update: ", req.params.id);
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
    console.log("Bill Reminder updated at backend");
  } catch (err) {
    console.error("Failed to update bill reminder", err);
    res.status(500).send("An error occurred while updating the bill reminder");
  }
});

// Update Bill Reminders for All Bills of a User
app.put("/bills/reminder/:userId", async (req, res) => {
  console.log("Backend updating reminders for all bills of a user...");
  try {
    // Extract reminder data from the request body
    const { onOff, method, time } = req.body.Reminder;

    // Find and update all bills associated with the provided userId
    console.log("User ID to update reminders for: ", req.params.userId);
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
    console.log("Reminders updated for all bills of the user");
  } catch (err) {
    console.error("Failed to update bill reminders", err);
    res.status(500).send("An error occurred while updating bill reminders");
  }
});

// Trigger job scheduling for reminders
app.post("/schedule-reminders", async (req, res) => {
  const { user, bills } = req.body;
  console.log("Bills received from Frontend: ", bills);
  console.log("User received from Frontend: ",user);
  try {
    //await scheduleReminder();
  } catch (err) {
    console.log("Error scheduling reminders: ", err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
