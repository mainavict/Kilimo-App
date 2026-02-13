// src/services/otpService.js
const bcrypt = require('bcryptjs');
const prisma = require('../models/prisma');
const generateOTP = require('../utils/generateOTP');

const OTP_EXPIRE_MINUTES = parseInt(process.env.OTP_EXPIRE_MINUTES) || 2;

const createOTP = async (userId, type = "VERIFICATION") => {
  try {
    await prisma.oTP.updateMany({
      where: { userId, used: false, type },
      data: { used: true }
    });

    const otpCode = generateOTP();
    const hashedOTP = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

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

    return { otpRecord, otpCode };
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw new Error('Failed to create OTP');
  }
};

const verifyOTP = async (userId, otpCode, type = "VERIFICATION") => {
  try {
    const otpRecord = await prisma.oTP.findFirst({
      where: { userId, type, used: false },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) throw new Error('Invalid or expired OTP');
    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.update({ where: { id: otpRecord.id }, data: { used: true } });
      throw new Error('OTP has expired');
    }
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await prisma.oTP.update({ where: { id: otpRecord.id }, data: { used: true } });
      throw new Error('Maximum OTP attempts exceeded');
    }

    const isValid = await bcrypt.compare(otpCode, otpRecord.code);
    if (!isValid) {
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { 
          attempts: otpRecord.attempts + 1,
          used: otpRecord.attempts + 1 >= otpRecord.maxAttempts
        }
      });
      throw new Error('Invalid OTP code');
    }

    await prisma.oTP.update({ where: { id: otpRecord.id }, data: { used: true } });
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { createOTP, verifyOTP };