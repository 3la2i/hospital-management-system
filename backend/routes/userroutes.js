const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontoller');

router.get('/:id', userController.getUserById);

module.exports = router;