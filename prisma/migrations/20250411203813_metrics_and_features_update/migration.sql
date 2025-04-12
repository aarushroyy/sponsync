/*
  Warnings:

  - The values [ANNOUNCEMENT,BACKDROP,TITLE_SPONSOR] on the enum `FeatureType` will be removed. If these variants are still used in the database, this will fail.
  - The values [BANNERS,SURVEYS,CLICKS] on the enum `MetricType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeatureType_new" AS ENUM ('STALLS', 'TITLE_RIGHTS', 'MAIN_STAGE_BACKDROP', 'STANDEES', 'OTHER');
ALTER TABLE "PackageFeature" ALTER COLUMN "type" TYPE "FeatureType_new" USING ("type"::text::"FeatureType_new");
ALTER TABLE "CampaignFeature" ALTER COLUMN "type" TYPE "FeatureType_new" USING ("type"::text::"FeatureType_new");
ALTER TYPE "FeatureType" RENAME TO "FeatureType_old";
ALTER TYPE "FeatureType_new" RENAME TO "FeatureType";
DROP TYPE "FeatureType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MetricType_new" AS ENUM ('SIGNUPS', 'MARKETING_BANNERS', 'DIGITAL_MARKETING_VIEWS', 'CUSTOMER_SURVEYS', 'KEYNOTE_SPEAKING', 'ENGAGEMENT_ACTIVITY', 'ANNOUNCEMENTS', 'LOGO_ON_POSTERS');
ALTER TABLE "PackageMetric" ALTER COLUMN "type" TYPE "MetricType_new" USING ("type"::text::"MetricType_new");
ALTER TABLE "CampaignMetric" ALTER COLUMN "type" TYPE "MetricType_new" USING ("type"::text::"MetricType_new");
ALTER TYPE "MetricType" RENAME TO "MetricType_old";
ALTER TYPE "MetricType_new" RENAME TO "MetricType";
DROP TYPE "MetricType_old";
COMMIT;

-- AlterTable
ALTER TABLE "CampaignFeature" ADD COLUMN     "valueOption" TEXT;

-- AlterTable
ALTER TABLE "CampaignMetric" ADD COLUMN     "rangeOption" TEXT;

-- AlterTable
ALTER TABLE "PackageFeature" ADD COLUMN     "valueOption" TEXT;

-- AlterTable
ALTER TABLE "PackageMetric" ADD COLUMN     "rangeOption" TEXT;
