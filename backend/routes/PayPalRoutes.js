
// C:\Users\Orange\Desktop\Hospital-project-\backend\routes\PayPalRoutes.js

const express = require('express');
const router = express.Router();
const PayPalController = require('../controllers/PayPalController');

router.post('/create-order', PayPalController.createOrder);
router.post('/capture-order', PayPalController.captureOrder);

module.exports = router;