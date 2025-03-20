/*
  Warnings:

  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Metric` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `packageTier` on table `CollegeOnboarding` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_onboardingId_fkey";

-- DropForeignKey
ALTER TABLE "Metric" DROP CONSTRAINT "Metric_onboardingId_fkey";

-- AlterTable
ALTER TABLE "CollegeOnboarding" ALTER COLUMN "packageTier" SET NOT NULL;

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Metric";

-- CreateTable
CREATE TABLE "PackageConfig" (
    "id" TEXT NOT NULL,
    "tier" "PackageTier" NOT NULL,
    "onboardingId" TEXT NOT NULL,

    CONSTRAINT "PackageConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageMetric" (
    "id" TEXT NOT NULL,
    "type" "MetricType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "packageConfigId" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,

    CONSTRAINT "PackageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageFeature" (
    "id" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "packageConfigId" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,

    CONSTRAINT "PackageFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageConfig_onboardingId_tier_key" ON "PackageConfig"("onboardingId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "PackageMetric_packageConfigId_type_key" ON "PackageMetric"("packageConfigId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "PackageFeature_packageConfigId_type_key" ON "PackageFeature"("packageConfigId", "type");

-- AddForeignKey
ALTER TABLE "PackageConfig" ADD CONSTRAINT "PackageConfig_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "CollegeOnboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageMetric" ADD CONSTRAINT "PackageMetric_packageConfigId_fkey" FOREIGN KEY ("packageConfigId") REFERENCES "PackageConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageMetric" ADD CONSTRAINT "PackageMetric_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "CollegeOnboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFeature" ADD CONSTRAINT "PackageFeature_packageConfigId_fkey" FOREIGN KEY ("packageConfigId") REFERENCES "PackageConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFeature" ADD CONSTRAINT "PackageFeature_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "CollegeOnboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
