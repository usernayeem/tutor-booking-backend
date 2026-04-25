import { prisma } from "./src/app/lib/prisma";

async function check() {
  const sessions = await prisma.session.findMany({
    include: { payment: true }
  });
  console.log(JSON.stringify(sessions, null, 2));
  process.exit(0);
}

check();
