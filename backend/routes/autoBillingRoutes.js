
const express = require('express');
const router = express.Router();
const autoBillingController = require('../controllers/autoBillingController');

router.post('/', autoBillingController.createAutoBilling);
router.get('/user/:userId', autoBillingController.getAutoBillingByUser);
router.put('/:id', autoBillingController.updateAutoBilling);
router.delete('/:id', autoBillingController.deleteAutoBilling);

module.exports = router;
