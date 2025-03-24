-- AlterTable
ALTER TABLE "SpocUser" ADD COLUMN     "assignedCollegeId" TEXT,
ADD COLUMN     "collegeRollNumber" TEXT,
ADD COLUMN     "idCardUrl" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SpocAssignment" (
    "id" TEXT NOT NULL,
    "spocId" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verificationPhotos" TEXT[],
    "report" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpocAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpocUser" ADD CONSTRAINT "SpocUser_assignedCollegeId_fkey" FOREIGN KEY ("assignedCollegeId") REFERENCES "CollegeUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpocAssignment" ADD CONSTRAINT "SpocAssignment_spocId_fkey" FOREIGN KEY ("spocId") REFERENCES "SpocUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
