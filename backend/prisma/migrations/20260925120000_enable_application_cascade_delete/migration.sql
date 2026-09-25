ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "applications_job_id_fkey";
ALTER TABLE "match_results" DROP CONSTRAINT IF EXISTS "match_results_application_id_fkey";
ALTER TABLE "interview_rounds" DROP CONSTRAINT IF EXISTS "interview_rounds_application_id_fkey";
ALTER TABLE "interview_questions" DROP CONSTRAINT IF EXISTS "interview_questions_interview_id_fkey";
ALTER TABLE "scorecards" DROP CONSTRAINT IF EXISTS "scorecards_interview_id_fkey";
ALTER TABLE "offers" DROP CONSTRAINT IF EXISTS "offers_application_id_fkey";

ALTER TABLE "applications"
  ADD CONSTRAINT "applications_job_id_fkey"
  FOREIGN KEY ("job_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "match_results"
  ADD CONSTRAINT "match_results_application_id_fkey"
  FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interview_rounds"
  ADD CONSTRAINT "interview_rounds_application_id_fkey"
  FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interview_questions"
  ADD CONSTRAINT "interview_questions_interview_id_fkey"
  FOREIGN KEY ("interview_id") REFERENCES "interview_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "scorecards"
  ADD CONSTRAINT "scorecards_interview_id_fkey"
  FOREIGN KEY ("interview_id") REFERENCES "interview_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "offers"
  ADD CONSTRAINT "offers_application_id_fkey"
  FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
