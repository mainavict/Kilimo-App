// src/services/authService.js
const bcrypt = require('bcryptjs');
const prisma = require('../models/prisma');
const { createOTP } = require('./otpService');
const { sendOTPEmail } = require('./emailService');

const registerUser = async (email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) throw new Error('User with this email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
     data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false
    },
    select: { id: true, email: true, isVerified: true, createdAt: true }
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  return user;
};

const sendOTP = async (userId, email) => {
  const { otpRecord, otpCode } = await createOTP(userId, "VERIFICATION");
  await sendOTPEmail(email, otpCode);
  return otpRecord;
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, isVerified: true }
  });
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { registerUser, loginUser, sendOTP, getUserById };