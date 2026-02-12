// src/services/authService.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      createdAt: true
    }
  });

  return user;
};

module.exports = { registerUser };