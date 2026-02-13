// src/models/prisma.js
const { PrismaClient } = require('@prisma/client');

// Global Prisma instance for serverless
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to avoid creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;