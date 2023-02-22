const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
router.use("/users", userRoute);
router.use("/auth", authRoute);
module.exports = router;
