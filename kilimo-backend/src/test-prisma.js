// src/test-prisma-db.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('📡 Testing Prisma Data Platform connection...\n');
    
    // Test 1: Create user
    const user = await prisma.user.create({
      data: {
        email: 'prisma.test@example.com',
        password: 'password123'
      }
    });
    console.log('✅ Created user:', user.email);

    // Test 2: Read users
    const users = await prisma.user.findMany();
    console.log(`✅ Found ${users.length} user(s)`);

    // Test 3: Create OTP
    const otp = await prisma.oTP.create({
      data: {
        userId: user.id,
        code: 'hashed_otp_123',
        type: 'VERIFICATION',
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        attempts: 0,
        maxAttempts: 3,
        used: false
      }
    });
    console.log('✅ Created OTP record');

    // Test 4: Create form submission
    const submission = await prisma.formSubmission.create({
      data: {
        userId: user.id,
        firstName: 'Prisma',
        lastName: 'Test',
        email: 'prisma.test@example.com',
        phone: '0712345678',
        message: 'Test submission from Prisma Data Platform'
      }
    });
    console.log('✅ Created form submission');

    console.log('\n🎉 Prisma Data Platform connection successful!');
    console.log('✅ All models working: User, OTP, FormSubmission');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check DATABASE_URL in .env file');
    console.error('   2. Verify database is running in Prisma Data Platform dashboard');
    console.error('   3. Check if SSL mode is required (sslmode=require)');
    console.error('   4. Ensure pg package is installed: npm install pg');
  } finally {
    await prisma.$disconnect();
  }
}

test();