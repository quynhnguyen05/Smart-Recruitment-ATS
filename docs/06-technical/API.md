# API Contract

| Method | Path | Input | Output | Auth |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | `{email, password}` | `token, user_info` | `PUBLIC` |
| `POST` | `/api/jobs` | `{title, description, requirements}` | `JobPosting` | `ADMIN, RECRUITER` |
| `GET` | `/api/jobs` | `q, status` | `JobPosting[]` | `PUBLIC, CANDIDATE` |
| `GET` | `/api/jobs/:id` | `-` | `JobPosting` | `PUBLIC, CANDIDATE` |
| `PATCH` | `/api/jobs/:id/status` | `{status, confirmation_token}` | `JobPosting` | `ADMIN, RECRUITER` |
| `POST` | `/api/applications` | `{job_id, cv_file}` | `Application` | `CANDIDATE` |
| `GET` | `/api/applications` | `job_id, status, q` | `Application[]` | `ADMIN, RECRUITER, HM` |
| `GET` | `/api/applications/:id` | `-` | `Application` | `ADMIN, RECRUITER, HM, INTERVIEWER` |
| `PATCH` | `/api/applications/:id/status` | `{status, confirmation_token}` | `Application` | `RECRUITER, HM` |
| `POST` | `/api/applications/:id/ai-score` | `-` | `MatchResult` | `RECRUITER, ADMIN` |
| `GET` | `/api/applications/:id/status` | `-` | `{status}` | `CANDIDATE (của chính mình), RECRUITER, HM` |
| `POST` | `/api/interviews` | `{application_id, interviewer_id, scheduled_at}` | `InterviewRound` | `RECRUITER` |
| `GET` | `/api/interviews/:id` | `-` | `InterviewRound` | `RECRUITER, HM, INTERVIEWER (chủ interview)` |
| `POST` | `/api/interviews/:id/ai-questions` | `-` | `InterviewQuestion[]` | `INTERVIEWER` |
| `PATCH` | `/api/interviews/:id/complete` | `{confirmation_token}` | `InterviewRound` | `INTERVIEWER, RECRUITER` |
| `POST` | `/api/interviews/:id/scorecard` | `{score, notes}` | `Scorecard` | `INTERVIEWER` |
| `POST` | `/api/applications/:id/offer` | `{salary}` | `Offer (DRAFT)` | `HM` |
| `POST` | `/api/offers/:id/confirm` | `{confirmation_token}` | `Offer (CONFIRMED)` | `HM` |
