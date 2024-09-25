const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/auth");

router.put("/update", authMiddleware, profileController.updateProfile);

module.exports = router;
