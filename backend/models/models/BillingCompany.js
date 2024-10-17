const mongoose = require("mongoose");

const BillingCompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageURL: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model("BillingCompany", BillingCompanySchema);
