// src/routes/otp.routes.js
const express = require('express');
const router = express.Router();
const { verifyOTPController } = require('../controllers/otpController');
const { protect } = require('../middleware/auth');

// Verify OTP (requires authentication)
router.post('/verify',verifyOTPController);

module.exports = router;