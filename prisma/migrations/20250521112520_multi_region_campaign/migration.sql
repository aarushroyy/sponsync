/*
  Warnings:

  - Changed the column `region` on the `CompanyCampaign` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- 1. Rename the old column to keep the data
ALTER TABLE "CompanyCampaign" RENAME COLUMN "region" TO "region_old";

-- 2. Add the new array column
ALTER TABLE "CompanyCampaign" ADD COLUMN "regions" "Region"[]; -- or text[] if not using enum

-- 3. Migrate existing data: put the old value into a single-element array
UPDATE "CompanyCampaign" SET "regions" = ARRAY["region_old"];

-- 4. (Optional) Set NOT NULL if you want to enforce it
ALTER TABLE "CompanyCampaign" ALTER COLUMN "regions" SET NOT NULL;

-- 5. Remove the old column
ALTER TABLE "CompanyCampaign" DROP COLUMN "region_old";

