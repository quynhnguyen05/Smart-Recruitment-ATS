# Output #13 - Epics và 12 User Stories
| Epic | Capability | Story | Title | Pts |
| :--- | :--- | :--- | :--- | :--- |
| EP1 | Job & Application | US-ATS-01 | Recruiter tạo và publish Job Posting | 2 |
| EP1 | Job & Application | US-ATS-02 | Candidate Apply vào Job kèm Upload CV | 2 |
| EP2 | AI Screening | US-ATS-03 | Hệ thống Parse CV thành dữ liệu có cấu trúc | 3 |
| EP2 | AI Screening | US-ATS-04 | AI sinh CV Summary cho Recruiter | 3 |
| EP2 | AI Screening | US-ATS-05 | AI tính Match Score kèm Matched/Missing Skills và lý do | 3 |
| EP2 | AI Screening | US-ATS-06 | Recruiter Pass/Reject Application dựa trên gợi ý AI | 2 |
| EP3 | Interview | US-ATS-07 | Recruiter lên lịch Interview Round | 2 |
| EP3 | Interview | US-ATS-08 | AI gợi ý câu hỏi phỏng vấn theo JD/CV | 3 |
| EP3 | Interview | US-ATS-09 | Interviewer điền và Submit Interview Scorecard | 2 |
| EP4 | Decision | US-ATS-10 | Hiring Manager xem tổng hợp Scorecard | 2 |
| EP4 | Decision | US-ATS-11 | Hiring Manager xác nhận Offer/Reject | 3 |
| EP5 | Candidate & Admin | US-ATS-12 | Candidate xem trạng thái Application Pipeline | 2 |
| EP5 | Candidate & Admin | US-ATS-13 | Admin quản lý User, Role và Permission | 2 |

# Output #14 - User Story Specifications

## EPIC 1 — JOB & APPLICATION

### US-ATS-01 — Tạo và publish Job Posting

**User Story**

> As a Recruiter, I want to create and publish a job posting with a clear description and requirements, so that candidates can discover and apply to the right roles.

**Context:** Covers REQ-ATS-01.

#### Acceptance Criteria

- **AC1:** Given I am logged in as Recruiter or Admin, when I fill in title, description, requirements and submit, then a new Job is created with status `DRAFT`.
- **AC2:** Given a Job is in `DRAFT` status, when I click "Publish", then the Job status changes to `OPEN` and it appears in the public job list.
- **AC3:** Given a Job is `OPEN`, when I change its status to `CLOSED`, then it no longer accepts new Applications but existing Applications are unaffected.
- **AC4:** Given required fields (title, description) are missing, when I try to submit, then the system blocks submission and shows which fields are missing.

**Out of Scope**

- Duyệt nội dung Job bởi cấp trên trước khi publish.
- Template JD có sẵn.

**Dependencies:** Không có.

**Estimate:** 2 pts

**Owner:** Product/BA

---

### US-ATS-02 — Candidate apply và upload CV

**User Story**

> As a Candidate, I want to apply to a job by uploading my CV, so that I can be considered for the position.

**Context:** Covers REQ-ATS-02.

#### Acceptance Criteria

- **AC1:** Given a Job has status `OPEN`, when I submit an application with a CV file, then an Application record is created with status `APPLIED`, linked to my `candidate_id` and the `job_id`.
- **AC2:** Given I have already applied to this Job before, when I try to apply again, then the system prevents a duplicate application and shows my existing application instead.
- **AC3:** Given the uploaded file is not a supported format (not PDF/DOCX) or exceeds the size limit, when I submit, then the system rejects it with a clear error message and no Application is created.
- **AC4:** Given a Job has status `CLOSED`, when I try to apply, then the system blocks submission and explains the job is no longer accepting applications.

**Out of Scope**

- CV builder tích hợp sẵn trong hệ thống.
- Lưu nhiều phiên bản CV cho 1 candidate.

**Dependencies:** US-ATS-01

**Estimate:** 2 pts

**Owner:** Engineering

---

## EPIC 2 — AI SCREENING

### US-ATS-03 — Parse CV thành dữ liệu có cấu trúc

**User Story**

> As a Recruiter, I want the system to automatically extract structured data (skills, experience, education) from a candidate's CV, so that the AI summary and match score can be generated from clean, consistent data.

**Context:** Covers REQ-ATS-03.

#### Acceptance Criteria

- **AC1:** Given a candidate uploads a supported CV file (PDF/DOCX), when parsing runs, then extracted skills, years of experience and education are stored linked to the CV record.
- **AC2:** Given parsing succeeds only partially (e.g., education field not found), when viewed, then the available fields are shown and missing ones are clearly marked — never guessed or filled with placeholder data.
- **AC3:** Given parsing fails completely (corrupted file or unsupported internal format), when Recruiter opens the Application, then the raw CV file is still viewable and Recruiter can proceed with manual screening.
- **AC4:** Given a CV with non-standard formatting (e.g., table-based layout) produces uncertain/possibly incorrect extraction, when Recruiter views it, then they can always open the raw CV to verify — parsed data is never presented as guaranteed ground truth.

**Out of Scope**

- OCR cho CV dạng ảnh scan.
- Parsing đa ngôn ngữ ngoài tiếng Việt/Anh.

**Dependencies:** US-ATS-02

**Estimate:** 3 pts

**Owner:** AI/Vault

---

### US-ATS-04 — AI sinh CV Summary

**User Story**

> As a Recruiter, I want to see an AI-generated summary of a candidate's CV, so that I can quickly grasp the key points without reading the entire document.

**Context:** Covers REQ-ATS-04.

#### Acceptance Criteria

- **AC1:** Given a CV has been parsed successfully, when Recruiter opens the Application, then a short AI-generated summary (key skills, experience highlights) is displayed alongside a clearly visible option to view the original CV.
- **AC2:** Given the AI service is unavailable, when Recruiter opens the Application, then the summary section shows a clear error state, and the raw CV remains fully accessible.
- **AC3:** Given a summary is generated, when displayed, then it is explicitly labeled `AI-generated summary — please verify` and never presented as a verified fact.
- **AC4:** Given the parsed data is incomplete, when the summary is generated, then it states what information is missing rather than inventing plausible-sounding details.

**Out of Scope**

- Tóm tắt so sánh nhiều CV cùng lúc trong 1 màn hình.

**Dependencies:** US-ATS-03

**Estimate:** 3 pts

**Owner:** AI/Vault

---

### US-ATS-05 — AI tính Match Score kèm lý do

**User Story**

> As a Recruiter, I want to see an AI-generated match score with explanation for each CV against the job requirements, so that I can screen candidates faster without blindly trusting AI.

**Context:** Covers REQ-ATS-05, BR-ATS-02.

**Important:** Score is advisory only, not a decision.

#### Acceptance Criteria

- **AC1:** Given a parsed CV and an active Job with requirements, when Recruiter opens the Application, then a match score (0–100) is shown together with the list of matched skills and missing skills.
- **AC2:** Given the AI service is unavailable, when Recruiter opens the Application, then the CV data is still viewable manually and an error state is shown for the score section instead of a fabricated number.
- **AC3:** Given a match score is shown, when Recruiter reads it, then it is never presented as a pass/fail decision — only as a suggestion, clearly labeled.
- **AC4:** Given a CV has missing required fields needed for scoring, when scoring runs, then the system flags `insufficient data` instead of guessing a score.

**Out of Scope**

- So sánh nhiều ứng viên cùng lúc.
- Tự động xếp hạng toàn bộ danh sách ứng viên.

**Dependencies:** US-ATS-03, US-ATS-04

**Estimate:** 3 pts

**Owner:** AI/Vault

---

### US-ATS-06 — Recruiter quyết định Pass/Reject dựa trên gợi ý AI

**User Story**

> As a Recruiter, I want to review the AI-generated CV summary and match score, then decide to pass or reject the candidate myself, so that AI only assists me and never makes the hiring decision on its own.

**Context:** Covers REQ-ATS-06, BR-ATS-01.

#### Acceptance Criteria

- **AC1:** Given an Application has a completed CV summary and match score, when I open it, then both are clearly labeled as `AI suggestion` alongside the option to view the original CV.
- **AC2:** Given I click `Pass`, when the action completes, then the Application status changes to `SCREENING_PASS` and an AuditEvent is recorded with my user id.
- **AC3:** Given I click `Reject`, when I confirm the action in the confirmation dialog, then the Application status changes to `REJECTED` and an AuditEvent is recorded.
- **AC4:** Given the AI has not finished generating the summary/score (or the AI service failed), when I open the Application, then I can still view the raw CV and make a Pass/Reject decision manually.
- **AC5:** Given no explicit Pass/Reject action has been taken, when the Application is viewed, then its status remains unchanged — the AI never changes it automatically.

**Out of Scope**

- Bulk screening nhiều ứng viên cùng lúc.
- Auto-reject theo threshold điểm số.

**Dependencies:** US-ATS-03, US-ATS-04, US-ATS-05

**Estimate:** 2 pts

**Owner:** Product/BA

---

## EPIC 3 — INTERVIEW

### US-ATS-07 — Lên lịch Interview Round

**User Story**

> As a Recruiter, I want to schedule an interview round for a candidate who passed screening, so that the hiring process moves forward in an organized, trackable way.

**Context:** Covers REQ-ATS-07.

#### Acceptance Criteria

- **AC1:** Given an Application has status `SCREENING_PASS`, when Recruiter schedules an interview with a date/time and assigns an Interviewer, then an Interview record is created linked to that Application.
- **AC2:** Given an Interview is scheduled, when the assigned Interviewer views their schedule, then they see the interview along with the candidate's CV and job details.
- **AC3:** Given a scheduling conflict exists (same interviewer, overlapping time slot), when Recruiter tries to schedule, then the system warns about the conflict before allowing confirmation.
- **AC4:** Given an Application has not passed screening (still `APPLIED` or already `REJECTED`), when Recruiter tries to schedule an interview for it, then the system prevents the action.

**Out of Scope**

- Tự động tìm khung giờ trống qua tích hợp lịch (calendar integration).
- Gửi lời mời phỏng vấn qua email thật.

**Dependencies:** US-ATS-06

**Estimate:** 2 pts

**Owner:** Engineering

---

### US-ATS-08 — AI gợi ý câu hỏi phỏng vấn

**User Story**

> As an Interviewer, I want the system to suggest interview questions based on the job description and the candidate's CV, so that I can conduct a more relevant and standardized interview.

**Context:** Covers REQ-ATS-08.

#### Acceptance Criteria

- **AC1:** Given an Interview is scheduled, when the Interviewer opens the interview preparation screen, then a list of AI-suggested questions relevant to the JD/CV is displayed.
- **AC2:** Given the suggested questions are displayed, when the Interviewer edits, removes, or adds questions, then the final list used during the interview is the interviewer's edited version — not automatically the AI's original list.
- **AC3:** Given the AI service is unavailable, when the Interviewer opens the preparation screen, then they can still write questions manually from scratch — the feature degrades gracefully, it does not block the interview.
- **AC4:** Given a specific JD/CV pair, when questions are suggested, then each question must be traceable to a specific JD requirement or CV detail — not a generic question unrelated to the role.

**Out of Scope**

- Tự động chấm điểm câu trả lời phỏng vấn bằng AI trong lúc phỏng vấn.

**Dependencies:** US-ATS-03, US-ATS-07

**Estimate:** 3 pts

**Owner:** AI/Vault (đồng sở hữu UX/UI phần UI chỉnh sửa câu hỏi)

---

### US-ATS-09 — Interviewer điền Scorecard

**User Story**

> As an Interviewer, I want to fill out a structured scorecard after an interview, so that my evaluation is consistent, comparable and traceable to the interview it came from.

**Context:** Covers REQ-ATS-09.

#### Acceptance Criteria

- **AC1:** Given an Interview has taken place, when the Interviewer opens the scorecard form, then they can rate at least one criterion (e.g., technical skill, communication) with a numeric score and free-text notes.
- **AC2:** Given a Scorecard is submitted, when viewed later, then it becomes read-only — any correction must be a tracked update, not a silent overwrite, to preserve evaluation integrity.
- **AC3:** Given required criteria are left blank, when the Interviewer tries to submit, then the system blocks submission and highlights the missing fields.
- **AC4:** Given an Interviewer who is not assigned to this particular Interview tries to access its scorecard form, then access is denied (permission check).

**Out of Scope**

- Tự động tính điểm tổng hợp cuối cùng thay Hiring Manager quyết định.

**Dependencies:** US-ATS-07

**Estimate:** 2 pts

**Owner:** UX/UI

---

## EPIC 4 — DECISION

### US-ATS-10 — Hiring Manager xem tổng hợp Scorecard

**User Story**

> As a Hiring Manager, I want to see all scorecards from every interview round for a candidate in one place, so that I can make a well-informed final decision.

**Context:** Covers REQ-ATS-10.

#### Acceptance Criteria

- **AC1:** Given an Application has completed one or more Interview Rounds with submitted Scorecards, when I open the Application, then I see all Scorecards listed with round name, interviewer, criteria scores and notes.
- **AC2:** Given an Interview Round has no submitted Scorecard yet, when I view the Application, then that round is clearly marked as `pending` rather than omitted or shown as complete.
- **AC3:** Given multiple Scorecards exist, when I view them, then I see them individually (not silently auto-averaged into one hidden number) so I can judge nuance between interviewers.
- **AC4:** Given I am not the assigned Hiring Manager for this Application, when I try to access it, then the system denies access (permission check).

**Out of Scope**

- Tự động tính điểm trung bình cuối cùng thay người.
- So sánh nhiều ứng viên trong cùng màn hình.

**Dependencies:** US-ATS-09

**Estimate:** 2 pts

**Owner:** Product/BA

---

### US-ATS-11 — Xác nhận Offer (Explicit Confirmation)

**User Story**

> As a Hiring Manager, I want to review the aggregated scorecards and then explicitly confirm an offer decision, so that no offer is ever created without proper evaluation and clear accountability.

**Context:** Covers REQ-ATS-11, BR-ATS-03.

> **Business-critical story:** Đây là story business-critical nhất về mặt kỹ thuật, cần test kỹ nhất.

#### Acceptance Criteria

- **AC1:** Given an Application has at least one completed Scorecard, when I click `Create Offer` and confirm in the confirmation dialog, then an Offer record is created with `confirmed_by` and `confirmed_at` set, and the Application status changes to `OFFERED`.
- **AC2:** Given an Application has no completed Scorecard, when I try to create an Offer, then the system rejects the action (e.g., HTTP 409) and explains why.
- **AC3:** Given the confirmation dialog is shown, when I close it without confirming, then no Offer is created and the Application status remains unchanged.
- **AC4:** Given a user without the Hiring Manager role attempts to call the offer-confirm action directly (e.g., via API, bypassing the UI), then the system denies the request (HTTP 403).
- **AC5:** Given an Offer has already been confirmed for an Application, when a duplicate confirm action is attempted (e.g., double-click, retried request), then the system prevents creating a second Offer (idempotent behavior).

**Out of Scope**

- Gửi offer letter qua email thật.
- Ký nhận offer điện tử.
- Thương lượng lương qua hệ thống.

**Dependencies:** US-ATS-09, US-ATS-10

**Estimate:** 3 pts

**Owner:** QA/Release

---

## EPIC 5 — CANDIDATE & ADMIN

### US-ATS-12 — Candidate xem trạng thái pipeline

**User Story**

> As a Candidate, I want to see the current status of my application, so that I know where I stand in the hiring process without needing to contact the company.

**Context:** Covers REQ-ATS-12.

#### Acceptance Criteria

- **AC1:** Given I have an Application, when I log in and view `My Applications`, then I see the current pipeline stage (`Applied` / `Screening` / `Interview` / `Offered` / `Rejected`).
- **AC2:** Given the Application status changes (e.g., Recruiter passes screening), when I refresh or reopen the page, then the updated status is reflected without unusual delay.
- **AC3:** Given I have multiple Applications to different jobs, when viewing my list, then each shows its own independent status.
- **AC4:** Given I try to view another candidate's application status (e.g., by guessing a URL/ID), then access is denied (permission check).

**Out of Scope**

- Thông báo đẩy (push notification) qua email/SMS khi trạng thái đổi.

**Dependencies:** US-ATS-02

**Estimate:** 2 pts

**Owner:** UX/UI

---

### US-ATS-13 — Admin quản lý user và phân quyền

**User Story**

> As an Admin, I want to manage user accounts and assign roles, so that the right people have the right access to the system.

**Context:** Covers REQ-ATS-13.

#### Acceptance Criteria

- **AC1:** Given I am logged in as Admin, when I create a new user with an email and select a role (`Recruiter` / `Hiring Manager` / `Interviewer` / `Candidate` / `Admin`), then the user account is created with that role.
- **AC2:** Given an existing user's role needs to change, when I update it, then the user's access permissions reflect the new role from the next login onward.
- **AC3:** Given I want to deactivate a user, when I disable the account, then that user can no longer log in, but their historical records (e.g., past scorecards, past actions) remain intact for audit purposes.
- **AC4:** Given a non-Admin user attempts to access user-management endpoints directly, then access is denied (permission check).

**Out of Scope**

- Single sign-on (SSO) integration.
- Bulk import user từ file Excel.

**Dependencies:** Không có (đây là nền tảng auth, làm sớm).

**Estimate:** 2 pts

**Owner:** Engineering
