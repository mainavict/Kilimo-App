// src/models/prisma.js
const { PrismaClient } = require('@prisma/client');

let prisma;

// Initialize Prisma Client only once
const initPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    });
    
    // Add connection test
    prisma.$connect()
      .then(() => console.log('✅ Prisma Client connected successfully'))
      .catch(err => {
        console.error('❌ Prisma Client failed to connect:', err.message);
        console.error('💡 Check DATABASE_URL in Vercel environment variables');
      });
  }
  return prisma;
};

// Export a function that returns the initialized client
module.exports = {
  getPrisma: initPrisma
};