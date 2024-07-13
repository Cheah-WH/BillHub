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

const UserSchema = new Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Models
const BillingCompany = mongoose.model("BillingCompany", BillingCompanySchema);
const User = mongoose.model("User", UserSchema);

// API Endpoints
// Get Billing Companies List
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

// User Registration
app.post("/register", async (req, res) => {
  const { name, idNumber, phoneNumber, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already used to registered an account !" });
  }

  const existingUser2 = await User.findOne({ phoneNumber});
  if (existingUser2) {
    return res.status(400).json({ message: "Phone Number already used to registered an account !" });
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
    res.status(201).json({ message: "User registered successfully", user: savedUser });
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
