// src/controllers/otpController.js
const { verifyOTP } = require('../services/otpService');
const { generateToken } = require('../services/jwtService');
const prisma = require('../models/prisma');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Verify OTP and complete authentication
 * @route   POST /api/otp/verify
 * @access  Private (requires user context)
 */
const verifyOTPController = async (req, res, next) => {
  try {
    const {userId, otp } = req.body;

     // Validate userId
    if (!userId) {
      return next(new ErrorResponse('User ID is required', 400));
    }
    
    // Validate OTP format (must be 6 digits)
    if (!otp || !/^\d{6}$/.test(otp)) {
      return next(new ErrorResponse('Invalid OTP format. Must be 6 digits', 400));
    }

    // Verify OTP
    await verifyOTP(userId, otp, "VERIFICATION");

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });

    // Generate JWT token
    const token = generateToken(userId);

    // Get updated user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyOTPController };