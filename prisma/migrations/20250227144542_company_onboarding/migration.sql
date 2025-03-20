-- CreateEnum
CREATE TYPE "CampaignPlan" AS ENUM ('QUARTERLY', 'HALF_YEARLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "CompanyCampaign" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" "CampaignPlan" NOT NULL,
    "region" "Region" NOT NULL,
    "eventTypes" TEXT[],
    "bundleSize" INTEGER NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignMetric" (
    "id" TEXT NOT NULL,
    "type" "MetricType" NOT NULL,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignFeature" (
    "id" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignBundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "collegeIds" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignBundle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMetric_campaignId_type_key" ON "CampaignMetric"("campaignId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignFeature_campaignId_type_key" ON "CampaignFeature"("campaignId", "type");

-- AddForeignKey
ALTER TABLE "CompanyCampaign" ADD CONSTRAINT "CompanyCampaign_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMetric" ADD CONSTRAINT "CampaignMetric_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "CompanyCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignFeature" ADD CONSTRAINT "CampaignFeature_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "CompanyCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBundle" ADD CONSTRAINT "CampaignBundle_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "CompanyCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
