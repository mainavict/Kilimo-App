// src/controllers/passwordResetController.js
const { requestPasswordReset, resetPassword } = require('../services/passwordResetService');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Request password reset (send OTP to email)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse('Please provide email', 400));
    }

    const result = await requestPasswordReset(email);

    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPasswordController = async (req, res, next) => {
  try {
    const { userId, otp, newPassword } = req.body;

    // Validation
    if (!userId || !otp || !newPassword) {
      return next(new ErrorResponse('Please provide userId, otp, and newPassword', 400));
    }

    if (newPassword.length < 8) {
      return next(new ErrorResponse('Password must be at least 8 characters', 400));
    }

    const result = await resetPassword(userId, otp, newPassword);

    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { forgotPassword, resetPasswordController };