// src/services/authService.js
const bcrypt = require('bcryptjs');
const prisma = require('../models/prisma');
const { createOTP } = require('./otpService');
const { sendOTPEmail } = require('./emailService');



// @desc    Register user
// @param   {string} email - User email
// @param   {string} password - User password
const registerUser = async (email, password) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false
    },
    select: {
      id: true,
      email: true,
      isVerified: true,
      createdAt: true
    }
  });

  return user;
};

// @desc    Login user
// @param   {string} email - User email
// @param   {string} password - User password
const loginUser = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// @desc    Send OTP to user
// @param   {string} userId - User ID
// @param   {string} email - User email
const sendOTP = async (userId, email) => {
  // Create OTP in database
  const { otpRecord, otpCode } = await createOTP(userId, "VERIFICATION");

  // Send OTP via email (mock for now)
  await sendOTPEmail(email, otpCode);

  return otpRecord;
};


// @desc    Get user by ID
// @param   {string} userId - User ID
const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isVerified: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Add this to the exports at the bottom:
module.exports = { registerUser, loginUser, sendOTP, getUserById };