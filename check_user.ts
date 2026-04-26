import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

async function checkUser() {
  const email = 'usernayeem2@gmail.com';
  const user = await prisma.user.findUnique({
    where: { email },
    include: { Student: true }
  });
  console.log('User found:', JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

checkUser();
