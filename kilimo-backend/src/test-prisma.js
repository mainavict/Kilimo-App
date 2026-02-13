// src/test-prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('📡 Testing SQLite database...\n');
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    console.log('✅ Created user:', user);

    // Read all users
    const users = await prisma.user.findMany();
    console.log('\n✅ All users:', users);

    console.log('\n🎉 SQLite + Prisma is working!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();