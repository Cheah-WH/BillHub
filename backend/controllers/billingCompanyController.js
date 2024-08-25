const BillingCompany = require('../models/models/BillingCompany');

// Get Billing Companies List
exports.getAllBillingCompanies = async (req, res) => {
  try {
    const data = await BillingCompany.find();
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get Billing Company By ID
exports.getBillingCompanyById = async (req, res) => {
  const billingCompanyId = req.params.billingCompanyId;
  try {
    const billingCompany = await BillingCompany.findById(billingCompanyId);
    if (billingCompany) {
      res.json(billingCompany);
    } else {
      res.status(404).send("Billing company not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
