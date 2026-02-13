

const express = require('express');
const router = express.Router();
const { verifyOTPController } = require('../controllers/otpController');
const { protect } = require('../middleware/auth');
const { validateOTP } = require('../middleware/validation');

// Verify OTP (requires authentication)
router.post('/verify', validateOTP, verifyOTPController);

module.exports = router;