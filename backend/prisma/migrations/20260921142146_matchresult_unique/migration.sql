/*
  Warnings:

  - You are about to drop the `match_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "match_results" DROP CONSTRAINT "match_results_application_id_fkey";

-- DropTable
DROP TABLE "match_results";

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "matchScore" INTEGER,
    "matchedSkills" JSONB,
    "missingSkills" JSONB,
    "confidence" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_applicationId_key" ON "MatchResult"("applicationId");

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
