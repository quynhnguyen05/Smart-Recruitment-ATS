ALTER TABLE "job_postings"
  ADD COLUMN "department" TEXT NOT NULL DEFAULT 'Khác',
  ADD COLUMN "location" TEXT NOT NULL DEFAULT 'Toàn quốc';

UPDATE "job_postings"
SET "department" = 'Khác', "location" = 'Toàn quốc'
WHERE "department" IS NULL OR "location" IS NULL;
