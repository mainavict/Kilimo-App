// src/models/prisma.js
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client immediately (synchronously)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Force initialization (synchronous)
try {
  prisma.$connect()
    .then(() => console.log('✅ Prisma Client connected successfully'))
    .catch(err => {
      console.error('❌ Prisma Client failed to connect:', err.message);
      console.error('💡 Check DATABASE_URL in Vercel environment variables');
      process.exit(1); // Crash immediately if connection fails
    });
} catch (err) {
  console.error('❌ Critical initialization error:', err.message);
  process.exit(1);
}

// Export the initialized client
module.exports = prisma;