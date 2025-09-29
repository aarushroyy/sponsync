/*
  Warnings:

  - Added optional event date columns to the `CollegeOnboarding` table.

*/
-- Add optional eventStartDate and eventEndDate columns
ALTER TABLE "CollegeOnboarding" ADD COLUMN "eventStartDate" TIMESTAMP(3);
ALTER TABLE "CollegeOnboarding" ADD COLUMN "eventEndDate" TIMESTAMP(3);
