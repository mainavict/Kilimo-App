// src/services/passwordResetService.js
const bcrypt = require('bcryptjs');
const prisma = require('../models/prisma');
const { createOTP, verifyOTP } = require('./otpService');
const { sendOTPEmail } = require('./emailService');

const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { success: true, message: 'If email exists, reset instructions sent' };

  const { otpRecord, otpCode } = await createOTP(user.id, "PASSWORD_RESET");
  await sendOTPEmail(user.email, otpCode);
  return { success: true, message: 'Password reset OTP sent to email' };
};

const resetPassword = async (email, otp, newPassword) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new Error('User not found');

  await verifyOTP(user.id, otp, "PASSWORD_RESET");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
  return { success: true, message: 'Password reset successfully' };
};

module.exports = { requestPasswordReset, resetPassword };