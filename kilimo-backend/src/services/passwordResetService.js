// src/services/passwordResetService.js
const bcrypt = require('bcryptjs');
const { getPrisma } = require('../models/prisma');
const { createOTP, verifyOTP } = require('./otpService');
const { sendOTPEmail } = require('./emailService');

const prisma = getPrisma();

/**
 * Request password reset - sends OTP to user's email
 * @param {string} email - User email
 * @returns {Promise<Object>} User info
 */
const requestPasswordReset = async (email) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return { success: true, message: 'If email exists, reset instructions sent' };
    }

    // Create password reset OTP
    const { otpRecord, otpCode } = await createOTP(user.id, "PASSWORD_RESET");

    // Send email with OTP
    await sendOTPEmail(user.email, otpCode);

    return { success: true, message: 'Password reset OTP sent to email' };
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password using OTP
 * @param {string} userId - User ID
 * @param {string} otp - OTP code
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
const resetPassword = async (email, otp, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new Error('User not found');
    }
    // Verify OTP
    await verifyOTP(user.id, otp, "PASSWORD_RESET");

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    throw error;
  }
};

module.exports = { requestPasswordReset, resetPassword };