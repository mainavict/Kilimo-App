// src/models/prisma.js
const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Debug: Check if OTP model exists
console.log('🔍 Prisma models available:', Object.keys(prisma));

module.exports = prisma;