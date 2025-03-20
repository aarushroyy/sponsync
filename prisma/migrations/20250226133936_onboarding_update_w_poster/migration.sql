/*
  Warnings:

  - You are about to drop the column `onboardingId` on the `PackageFeature` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingId` on the `PackageMetric` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackageConfig" DROP CONSTRAINT "PackageConfig_onboardingId_fkey";

-- DropForeignKey
ALTER TABLE "PackageFeature" DROP CONSTRAINT "PackageFeature_onboardingId_fkey";

-- DropForeignKey
ALTER TABLE "PackageFeature" DROP CONSTRAINT "PackageFeature_packageConfigId_fkey";

-- DropForeignKey
ALTER TABLE "PackageMetric" DROP CONSTRAINT "PackageMetric_onboardingId_fkey";

-- DropForeignKey
ALTER TABLE "PackageMetric" DROP CONSTRAINT "PackageMetric_packageConfigId_fkey";

-- AlterTable
ALTER TABLE "CollegeOnboarding" ADD COLUMN     "posterUrl" TEXT;

-- AlterTable
ALTER TABLE "PackageFeature" DROP COLUMN "onboardingId";

-- AlterTable
ALTER TABLE "PackageMetric" DROP COLUMN "onboardingId";

-- AddForeignKey
ALTER TABLE "PackageConfig" ADD CONSTRAINT "PackageConfig_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "CollegeOnboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageMetric" ADD CONSTRAINT "PackageMetric_packageConfigId_fkey" FOREIGN KEY ("packageConfigId") REFERENCES "PackageConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFeature" ADD CONSTRAINT "PackageFeature_packageConfigId_fkey" FOREIGN KEY ("packageConfigId") REFERENCES "PackageConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
