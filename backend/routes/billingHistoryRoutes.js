const express = require('express');
const router = express.Router();
const billingHistoryController = require('../controllers/billingHistoryController');

router.post('/create', billingHistoryController.createBillingHistory);
router.get('/user/:userId', billingHistoryController.getBillingHistoryByUserId);
router.get('/bill/:billId', billingHistoryController.getBillingHistoryByBillId);
router.delete('/delete/:id', billingHistoryController.deleteBillingHistory);

module.exports = router;
