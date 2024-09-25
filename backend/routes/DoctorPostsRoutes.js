const express = require('express');
const router = express.Router();
const DoctorPostsController = require('../controllers/DoctorPostsController');


router.post('/createPost', DoctorPostsController.createPost);


module.exports = router;