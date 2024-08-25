const express = require('express');
const router = express.Router();
const billingCompanyController = require('../controllers/billingCompanyController');

router.get('/', billingCompanyController.getAllBillingCompanies);
router.get('/:billingCompanyId', billingCompanyController.getBillingCompanyById);

module.exports = router;
