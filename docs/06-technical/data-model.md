# Data Model

| Entity | Fields chính | Rules |
|---|---|---|
| User | id, email, password_hash, role, created_at | role ∈ ADMIN\|RECRUITER\|INTERVIEWER\|HIRING_MANAGER\|CANDIDATE |
| JobPosting | id, title, description, requirements, status, created_by | status ∈ DRAFT\|PUBLISHED\|CLOSED. Chỉ ADMIN/RECRUITER tạo. |
| Application | id, job_id, candidate_id, cv_url, status, latest_match_result_id, applied_at | status ∈ NEW\|SCORED\|SCREENING_PASSED\|REJECTED\|INTERVIEWING\|OFFERED. 1 candidate chỉ apply 1 lần/job. |
| MatchResult | id, application_id, status, match_score, matched_skills, missing_skills, explanation, created_at | status ∈ OK\|INSUFFICIENT_DATA\|ERROR. match_score (0-100) bắt buộc khi OK, NULL khi khác OK. Append-only. |
| InterviewRound | id, application_id, interviewer_id, scheduled_at, status | status ∈ SCHEDULED\|COMPLETED\|CANCELLED. Chỉ tạo khi Application đã qua Screening. |
| InterviewQuestion | id, interview_id, question_text, is_ai_generated, status | status ∈ ACCEPTED\|REJECTED\|EDITED. |
| Scorecard | id, interview_id, interviewer_id, score, notes, submitted_at | Chỉ submit sau khi InterviewRound.status = COMPLETED. 1 round = 1 scorecard. |
| Offer | id, application_id, salary, status, confirmed_by_hm, created_at | status ∈ DRAFT\|CONFIRMED\|ACCEPTED_BY_CANDIDATE\|REJECTED. |
| AuditLog | id, actor_id, action, target_type, target_id, metadata, created_at | Append-only. |
