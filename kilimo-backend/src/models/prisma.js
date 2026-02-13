// src/models/prisma.js
const { PrismaClient } = require('@prisma/client');

// Singleton pattern for serverless environments
let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), create a fresh instance per cold start
  prisma = new PrismaClient();
} else {
  // In development, reuse instance to prevent connection pool exhaustion
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;