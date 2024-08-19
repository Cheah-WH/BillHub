const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credit: { type: Number, default: 0 },
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
});

module.exports = mongoose.model("User", UserSchema);
