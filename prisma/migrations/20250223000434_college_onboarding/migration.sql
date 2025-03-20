-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST');

-- CreateTable
CREATE TABLE "CollegeOnboarding" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "eventType" TEXT NOT NULL,
    "signupsMin" INTEGER,
    "signupsMax" INTEGER,
    "bannersMin" INTEGER,
    "bannersMax" INTEGER,
    "surveysMin" INTEGER,
    "surveysMax" INTEGER,
    "clicksMin" INTEGER,
    "clicksMax" INTEGER,
    "announcement" BOOLEAN NOT NULL DEFAULT false,
    "standees" BOOLEAN NOT NULL DEFAULT false,
    "backdrop" BOOLEAN NOT NULL DEFAULT false,
    "titleSponsor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollegeOnboarding_collegeId_key" ON "CollegeOnboarding"("collegeId");

-- AddForeignKey
ALTER TABLE "CollegeOnboarding" ADD CONSTRAINT "CollegeOnboarding_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "CollegeUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
