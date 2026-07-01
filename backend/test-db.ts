import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
    // Try to perform a simple query
    await prisma.$queryRawUnsafe('SELECT 1');
    console.log('Database query successful!');
  } catch (error) {
    console.error('Failed to connect to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
