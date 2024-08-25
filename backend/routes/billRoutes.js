const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/', billController.registerBill);
router.get('/:userId', billController.getBillsByUserId);
router.patch('/:id', billController.updateBill);
router.patch('/:id/nickname', billController.updateBillNickname);
router.delete('/:id', billController.deleteBill);
router.patch('/:id/reminder', billController.updateBillReminder);
router.patch('/user/:userId/reminders', billController.updateAllBillReminders);

module.exports = router;
