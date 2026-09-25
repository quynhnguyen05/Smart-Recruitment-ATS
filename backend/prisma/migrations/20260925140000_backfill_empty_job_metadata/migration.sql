UPDATE "job_postings"
SET "department" = 'Khác'
WHERE "department" IS NULL OR BTRIM("department") = '';

UPDATE "job_postings"
SET "location" = 'Toàn quốc'
WHERE "location" IS NULL OR BTRIM("location") = '';
