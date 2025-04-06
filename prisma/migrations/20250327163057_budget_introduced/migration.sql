-- AlterTable
ALTER TABLE "CampaignBundle" ADD COLUMN     "totalValue" INTEGER;

-- AlterTable
ALTER TABLE "CollegeOnboarding" ADD COLUMN     "totalBudgetGoal" INTEGER;

-- AlterTable
ALTER TABLE "CompanyCampaign" ADD COLUMN     "budgetLimit" INTEGER;

-- AlterTable
ALTER TABLE "PackageConfig" ADD COLUMN     "estimatedAmount" INTEGER;
