import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const allTutors = await prisma.tutor.findMany({
    include: { user: true, tutorSchedules: true }
  });
  
  console.log('--- ALL TUTORS ---');
  allTutors.forEach(t => {
      console.log(`Name: ${t.user.name}, ID: ${t.id}, UserID: ${t.userId}, Schedules: ${t.tutorSchedules.length}`);
  });

  const allSchedules = await prisma.schedule.findMany();
  console.log('--- MASTER SCHEDULES ---');
  allSchedules.forEach(s => {
      console.log(`ID: ${s.id}, Start: ${s.startTime}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
