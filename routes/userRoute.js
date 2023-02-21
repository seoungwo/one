const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/auth/email", userController.insertAuthNumberByEmail);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);

module.exports = router;
