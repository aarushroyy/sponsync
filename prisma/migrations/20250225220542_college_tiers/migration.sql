/*
  Warnings:

  - You are about to drop the column `announcement` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `backdrop` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `bannersMax` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `bannersMin` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `clicksMax` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `clicksMin` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `signupsMax` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `signupsMin` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `standees` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `surveysMax` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `surveysMin` on the `CollegeOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `titleSponsor` on the `CollegeOnboarding` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PackageTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('SIGNUPS', 'BANNERS', 'SURVEYS', 'CLICKS');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('ANNOUNCEMENT', 'STANDEES', 'BACKDROP', 'TITLE_SPONSOR');

-- AlterTable
ALTER TABLE "CollegeOnboarding" DROP COLUMN "announcement",
DROP COLUMN "backdrop",
DROP COLUMN "bannersMax",
DROP COLUMN "bannersMin",
DROP COLUMN "clicksMax",
DROP COLUMN "clicksMin",
DROP COLUMN "signupsMax",
DROP COLUMN "signupsMin",
DROP COLUMN "standees",
DROP COLUMN "surveysMax",
DROP COLUMN "surveysMin",
DROP COLUMN "titleSponsor",
ADD COLUMN     "packageTier" "PackageTier";

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "type" "MetricType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "onboardingId" TEXT NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "onboardingId" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_onboardingId_type_key" ON "Metric"("onboardingId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_onboardingId_type_key" ON "Feature"("onboardingId", "type");

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "CollegeOnboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "CollegeOnboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
