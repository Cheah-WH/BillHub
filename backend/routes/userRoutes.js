const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:userId', userController.getUserById);
router.patch('/:id/credit', userController.updateUserCredit);
router.patch('/:id/deduct', userController.deductUserCredit);

module.exports = router;
