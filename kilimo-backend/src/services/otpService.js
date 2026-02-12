// src/services/otpService.js
const bcrypt = require('bcryptjs');
const prisma = require('../models/prisma');
const generateOTP = require('../utils/generateOTP');

const OTP_EXPIRE_MINUTES = parseInt(process.env.OTP_EXPIRE_MINUTES) || 2;

/**
 * Create and store OTP for a user
 * @param {string} userId - User ID
 * @param {string} type - OTP type ("VERIFICATION" or "PASSWORD_RESET")
 * @returns {Promise<Object>} OTP record and plain OTP code
 */
const createOTP = async (userId, type = "VERIFICATION") => {
  try {
    // Invalidate any existing unused OTPs for this user
    await prisma.oTP.updateMany({
      where: {
        userId,
        used: false,
        type
      },
      data: { used: true }
    });

    // Generate OTP using your secure crypto function
    const otpCode = generateOTP();
    
    // Hash OTP before storing in database
    const hashedOTP = await bcrypt.hash(otpCode, 10);
    
    // Calculate expiry time (default 2 minutes)
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

    // Save OTP to database
    const otpRecord = await prisma.oTP.create({
      data: {
        userId,
        code: hashedOTP,
        type,
        expiresAt,
        attempts: 0,
        maxAttempts: 3,
        used: false
      }
    });

    // Return both the record and the plain OTP code (for sending via email)
    return { otpRecord, otpCode };
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw new Error('Failed to create OTP');
  }
};

/**
 * Verify OTP code
 * @param {string} userId - User ID
 * @param {string} otpCode - OTP code to verify (6 digits)
 * @param {string} type - OTP type
 * @returns {Promise<boolean>} True if valid
 */
const verifyOTP = async (userId, otpCode, type = "VERIFICATION") => {
  try {
    // Find the most recent unused OTP for this user
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        userId,
        type,
        used: false
      },
      orderBy: { createdAt: 'desc' }
    });

    // Check if OTP record exists
    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { used: true }
      });
      throw new Error('OTP has expired');
    }

    // Check if maximum attempts reached
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { used: true }
      });
      throw new Error('Maximum OTP attempts exceeded');
    }

    // Verify the OTP code (compare with hashed version)
    const isValid = await bcrypt.compare(otpCode, otpRecord.code);

    if (!isValid) {
      // Increment failed attempts
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: {
          attempts: otpRecord.attempts + 1,
          used: otpRecord.attempts + 1 >= otpRecord.maxAttempts
        }
      });
      throw new Error('Invalid OTP code');
    }

    // Mark OTP as used (successful verification)
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { used: true }
    });

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { createOTP, verifyOTP };