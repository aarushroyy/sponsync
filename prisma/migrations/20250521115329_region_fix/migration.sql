/*
  Warnings:

  - You are about to drop the column `region` on the `CompanyCampaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyCampaign" DROP COLUMN "region",
ADD COLUMN     "regions" "Region"[];
