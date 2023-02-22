const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/email", authController.insertAuthNumberByEmail);
router.post("/compare", authController.compareAuthNumber);
module.exports = router;
