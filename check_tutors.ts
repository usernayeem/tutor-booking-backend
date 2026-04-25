import { prisma } from "./src/app/lib/prisma";

async function check() {
  const tutors = await prisma.tutor.findMany({
    include: { user: true }
  });
  console.log(JSON.stringify(tutors, null, 2));
  process.exit(0);
}

check();
