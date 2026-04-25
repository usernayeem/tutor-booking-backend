import { prisma } from '../app/lib/prisma.js';

async function main() {
  const tutorId = 'f844c22d-c6a5-4c86-8f86-f8e327892044';
  
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      user: true,
      tutorSchedules: {
        include: { schedule: true }
      }
    }
  });

  console.log('Tutor Name:', tutor?.user?.name);
  console.log('Tutor Schedules Count:', tutor?.tutorSchedules?.length);
  // console.log('Schedules:', JSON.stringify(tutor?.tutorSchedules, null, 2));

  const allSchedules = await prisma.schedule.findMany();
  console.log('Total Master Schedules:', allSchedules.length);
  
  if (allSchedules.length > 0) {
      console.log('Sample Master Schedule:', JSON.stringify(allSchedules[0], null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
