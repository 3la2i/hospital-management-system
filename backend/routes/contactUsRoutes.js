const express = require('express');
const router = express.Router();
const ContactUsController = require('../controllers/ContactUsController');

// Create a new contact entry
router.post('/creatcontact', ContactUsController.create);

// Get all contact entries
router.get('/getAllContact', ContactUsController.getAll);

// Get a single contact entry by ID
router.get('/getByIdContact/:id', ContactUsController.getById);

// Update a contact entry
router.put('/UpdateContact/:id', ContactUsController.update);

// Delete a contact entry
router.delete('/DeletContact/:id', ContactUsController.delete);

module.exports = router;