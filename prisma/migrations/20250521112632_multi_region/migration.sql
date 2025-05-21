/*
  Warnings:

  - You are about to drop the column `regions` on the `CompanyCampaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyCampaign" DROP COLUMN "regions",
ADD COLUMN     "region" "Region"[];
