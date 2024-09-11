const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

router.post('/', receiptController.createReceipt);
router.get('/:transactionId', receiptController.getReceipt);

module.exports = router;
