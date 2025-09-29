-- AlterTable
ALTER TABLE "CollegeOnboarding" ADD COLUMN     "eventStartDate" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 00:00:00',
ADD COLUMN     "eventEndDate" TIMESTAMP(3);
