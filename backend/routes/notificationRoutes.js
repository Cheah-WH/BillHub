const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.createNotification);
router.patch('/:id/seen', notificationController.updateNotificationSeen);
router.get('/:userId', notificationController.getNotificationsByUserId);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
