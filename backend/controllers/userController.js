const User = require('../models/models/User');
const bcrypt = require('bcryptjs');

// User Registration
exports.registerUser = async (req, res) => {
  const { name, idNumber, phoneNumber, email, password } = req.body;
  try {
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used to register an account!" });
    }

    const existingUser2 = await User.findOne({ phoneNumber });
    if (existingUser2) {
      return res.status(400).json({ message: "Phone Number already used to register an account!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      idNumber,
      phoneNumber,
      email: normalizedEmail, 
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    let query;
    
    // Check if user with email (contains "@")
    if (identifier.includes('@')) {
      query = { email: identifier.toLowerCase() }; // Convert email to lowercase
    } else {
      query = { phoneNumber: identifier };
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: "Account not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Route to fetch user's data
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route to top up user's credit
exports.updateUserCredit = async (req, res) => {
  try {
    const userId = req.params.id;
    const { amount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User account not found");
    }
    user.credit = (user.credit + amount).toFixed(2);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).send("An error occurred while updating the user credit");
  }
};

// Route to deduct user's credit
exports.deductUserCredit = async (req, res) => {
  try {
    const userId = req.params.id;
    const { totalAmount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User account not found");
    }
    user.credit = (user.credit - totalAmount).toFixed(2);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).send("An error occurred while updating the user credit");
  }
};