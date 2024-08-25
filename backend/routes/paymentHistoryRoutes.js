const express = require('express');
const router = express.Router();
const paymentHistoryController = require('../controllers/paymentHistoryController');

router.post('/', paymentHistoryController.createPaymentHistory);
router.get('/:userId', paymentHistoryController.getPaymentHistoryByUserId);
router.get('/bill/:billId', paymentHistoryController.getPaymentHistoryByBillId);
router.delete('/:id', paymentHistoryController.deletePaymentHistory);

module.exports = router;
