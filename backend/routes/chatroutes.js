const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatcontroller');

router.get('/:senderId/:receiverId', chatController.getChatHistory);
router.post('/', chatController.saveMessage);
router.get('/:doctorId', chatController.getUsersForDoctor);

module.exports = router;