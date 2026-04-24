-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_tutorId_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "tutor_schedules" DROP CONSTRAINT "tutor_schedules_scheduleId_fkey";

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tutorId_scheduleId_fkey" FOREIGN KEY ("tutorId", "scheduleId") REFERENCES "tutor_schedules"("tutorId", "scheduleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_schedules" ADD CONSTRAINT "tutor_schedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
