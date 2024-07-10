const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const nodemailer = require("nodemailer");

// Sending Email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "cheahwh3@gmail.com", // Your Gmail address
    pass: "ihsh louk iovh aysl", // Your Gmail password or application-specific password
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint to send email
app.post("/send-email", async (req, res) => {
  console.log("Testing 123 /send email is called");
  const { to, subject, text, html } = req.body;

  // Email options
  const mailOptions = {
    from: "cheahwh3@gmail.com",
    to,
    subject,
    text,
    html,
  };

  // Send email
  try {
    console.log("Sending email to:", to);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
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

// Schemas
const Schema = mongoose.Schema;
const BillingCompanySchema = new Schema({
  name: String,
  category: String,
});

const BillPayerSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account_status: { type: String, default: "active" },
});

// Models
const BillingCompany = mongoose.model("BillingCompany", BillingCompanySchema);
const BillPayer = mongoose.model("BillPayer", BillPayerSchema);

// API Endpoints
app.get("/billingcompanies", async (req, res) => {
  console.log("server.js running APP .get billingcompanies");
  try {
    const data = await BillingCompany.find();
    console.log("Fetched Data from MongoDB: ", data); // Log fetched data
    res.json(data);
  } catch (err) {
    console.log("Error:" + err);
    res.status(500).send(err);
  }
});

// BillPayer Registration
app.post("/register", async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newBillPayer = new BillPayer({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    await newBillPayer.save();
    res.status(201).json({ message: "BillPayer registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "BillPayer registration failed", error: err });
  }
});

// BillPayer Login
app.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const billPayer = await BillPayer.findOne({ phoneNumber });
    if (billPayer && (await bcrypt.compare(password, billPayer.password))) {
      const token = jwt.sign({ billPayerId: billPayer._id }, "your_jwt_secret");
      res.json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid phone number or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
