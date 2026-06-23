const express = require("express");
const router = express.Router();

const authcontroller = require ("../controller2/auth.controller");

router.post("/register",authcontroller.register);
router.post("/login",authcontroller.login);

router.post("/sendotp",authcontroller.sendOtp)
router.post("/verifyotp",authcontroller.verifyOtp)
router.post("/forgotpassword",authcontroller.forgotPassword);

module.exports = router;