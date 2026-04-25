import { prisma } from "./src/app/lib/prisma";

async function check() {
  const students = await prisma.student.findMany({
    include: { user: true }
  });
  console.log(JSON.stringify(students, null, 2));
  process.exit(0);
}

check();
