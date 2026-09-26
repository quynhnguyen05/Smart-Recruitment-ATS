# Output #33 — Traceability Matrix

**Dự án:** Smart Recruitment ATS v1.0.0
**Ngày cập nhật:** 2026-09-26
**Nguồn:** docs/TRACEABILITY.md + backend/app/api/** + backend/prisma/schema.prisma + tests/**

---

## Ma trận Traceability đầy đủ

| Requirement ID | Business Rule | Story ID | Tasks (Taiga) | Code thực tế | Test IDs | Release |
|---|---|---|---|---|---|---|
| **REQ-ATS-01** | — | US-ATS-01 | T-011 (Job schema + API), T-012 (JobForm UI), T-013 (Publish/Close logic) | `backend/app/api/jobs/route.ts` (GET+POST), `backend/app/api/jobs/[id]/route.ts` (PATCH status), `frontend/components/JobCard.tsx` | TC-AUTH-01..24, TC-JOB-* (unit), E2E: Tạo Job → Publish | v1.0.0 |
| **REQ-ATS-02** | — | US-ATS-02 | T-021 (Application schema + API), T-022 (Upload CV UI), T-023 (Duplicate-apply check) | `backend/app/api/applications/route.ts` (POST: Zod validate, file validate, ConflictError APPLICATION_ALREADY_EXISTS) | TC-APP-01..08 (unit+integration) | v1.0.0 |
| **REQ-ATS-03** | — | US-ATS-03 | T-031 (CV parser: pdf-parse), T-032 (lưu parsed_data), T-033 (Fallback INSUFFICIENT_DATA) | `backend/app/api/applications/[id]/match/route.ts` — hàm `readCv()`: pdf-parse cho .pdf, toString cho .txt, fallback {text:'', supported:false} cho .docx | TC-AI-03..06 (INSUFFICIENT_DATA fallback) | v1.0.0 |
| **REQ-ATS-04** | ADR-001 (AI label) | US-ATS-04 | T-041 (Prompt/schema CV Summary), T-042 (Service gọi AI), T-043 (UI label "AI-generated") | `frontend/app/cv-summary/` — label "Thông tin được trích xuất tự động bởi AI"; toggle fallback UI | TC-AI-* (summary display, fallback) | v1.0.0 |
| **REQ-ATS-05** | BR-ATS-02 (AI không quyết định) | US-ATS-05 | T-051 (MatchScore schema), T-052 (keyword matching engine), T-053 (MatchScoreBadge UI), T-054 (E2E test) | `backend/app/api/applications/[id]/match/route.ts` — hàm `keywords()` normalize NFD, STOP_WORDS EN+VI, `matchScore = matchedSkills.length / required.length * 100` | TC-AI-01..08, TC-MATCH-* | v1.0.0 |
| **REQ-ATS-06** | BR-ATS-01 (AI không tự đổi status) | US-ATS-06 | T-061 (Pass/Reject API + AuditEvent), T-062 (ConfirmDialog Reject), T-063 (Test AI không tự đổi trạng thái) | `backend/app/api/applications/[id]/route.ts` — PATCH (chỉ RECRUITER/ADMIN/HIRING_MANAGER); guard `if existing.status === 'REJECTED'` | TC-APP-*, TC-RBAC-* (CANDIDATE không PATCH) | v1.0.0 |
| **REQ-ATS-07** | — | US-ATS-07 | T-071 (Interview schema + API), T-072 (Lịch UI + conflict check) | `backend/app/api/interviews/route.ts` — POST: Promise.all([findUnique application, findUnique user, findFirst conflict]); ConflictError INTERVIEW_CONFLICT | TC-INT-* (conflict, invalid interviewer) | v1.0.0 |
| **REQ-ATS-08** | ADR-001 | US-ATS-08 | T-081 (Prompt gợi ý câu hỏi), T-082 (UI Interviewer chỉnh sửa), T-083 (Fallback khi AI lỗi) | `backend/prisma/schema.prisma` model InterviewQuestion (isAiGenerated, status: ACCEPTED/REJECTED/EDITED); `frontend/app/my-interviews/` | TC-QA-* (gợi ý đúng JD, sửa được, fallback) | v1.0.0 |
| **REQ-ATS-09** | — | US-ATS-09 | T-091 (Scorecard schema + API), T-092 (ScorecardForm UI), T-093 (Read-only sau submit) | `backend/prisma/schema.prisma` model Scorecard (@unique interviewId — enforce read-only); `frontend/app/scorecard/` (Split-view 60/40) | TC-SC-* (submit hợp lệ, thiếu tiêu chí, sai role 403) | v1.0.0 |
| **REQ-ATS-10** | — | US-ATS-10 | T-101 (API tổng hợp scorecard), T-102 (ScorecardSummaryView UI) | `backend/app/api/scorecards/summary/route.ts` — groupBy applicationId, tính average từ availableScores; requireRole(['ADMIN','HIRING_MANAGER']) | TC-SUM-* (xem đủ vòng, pending, sai role 403) | v1.0.0 |
| **REQ-ATS-11** | BR-ATS-03 (Offer phải qua phỏng vấn) | US-ATS-11 | T-111 (Offer schema + confirm API), T-112 (ConfirmDialog UI gõ XAC NHAN), T-113 (Idempotency OFFER_ALREADY_EXISTS), T-114 (E2E confirm) | `backend/app/api/offers/route.ts` — POST: guard `application.status === 'REJECTED'`, ConflictError OFFER_ALREADY_EXISTS; `backend/prisma/schema.prisma` Offer(@unique applicationId, status: DRAFT/CONFIRMED) | TC-OFF-* (confirm hợp lệ, REJECTED→409, double-confirm) | v1.0.0 |
| **REQ-ATS-12** | — | US-ATS-12 | T-121 (API xem trạng thái), T-122 (PipelineStatusStepper UI) | `backend/app/api/applications/[id]/route.ts` — GET: `if CANDIDATE && application.candidateId !== authResult.userId → throw NotFoundError`; `frontend/app/applications/` | TC-PIPE-* (xem đúng trạng thái, candidate khác 404) | v1.0.0 |
| **REQ-ATS-13** | — | US-ATS-13 | T-131 (User CRUD API + role), T-132 (Admin UI quản lý user) | `backend/app/api/admin/*/route.ts` — requireRole(['ADMIN']); `frontend/app/admin-users/` | TC-ADMIN-* (tạo user, gán role, non-admin 403) | v1.0.0 |

---

## RBAC Mapping — Ai được làm gì

| Endpoint | ADMIN | RECRUITER | HIRING_MANAGER | INTERVIEWER | CANDIDATE |
|---|---|---|---|---|---|
| GET /api/jobs | ✓ | ✓ | ✓ | ✓ | ✓ (PUBLISHED only) |
| POST /api/jobs | ✓ | ✓ | ✗ | ✗ | ✗ |
| GET /api/applications | ✓ | ✓ | ✗ | ✗ | ✓ (own only) |
| POST /api/applications | ✓ | ✓ | ✗ | ✗ | ✓ |
| PATCH /api/applications/:id | ✓ | ✓ | ✓ | ✗ | ✗ |
| GET /api/applications/:id/match | ✓ | ✓ | ✓ | ✓ | ✗ |
| POST /api/interviews | ✓ | ✓ | ✗ | ✗ | ✗ |
| GET /api/scorecards/summary | ✓ | ✗ | ✓ | ✗ | ✗ |
| POST /api/offers | ✓ | ✗ | ✓ | ✗ | ✗ |
| GET /api/offers | ✓ | ✓ | ✓ | ✗ | ✓ (own only) |
| GET /api/admin/* | ✓ | ✗ | ✗ | ✗ | ✗ |

---

## AuditLog Events Mapping

| Action (audit_logs.action) | Trigger | Actor roles |
|---|---|---|
| CREATE_APPLICATION | POST /api/applications | CANDIDATE, RECRUITER, ADMIN |
| UPDATE_APPLICATION_STATUS | PATCH /api/applications/:id | RECRUITER, HIRING_MANAGER, ADMIN |
| CREATE_INTERVIEW | POST /api/interviews | RECRUITER, ADMIN |
| UPDATE_INTERVIEW_STATUS | PATCH /api/interviews | RECRUITER, HIRING_MANAGER, ADMIN |
| CREATE_OFFER | POST /api/offers | HIRING_MANAGER, ADMIN |

---

## Trạng thái Coverage

| Requirement | Story Done | Code Exists | Tests Exist | AuditLog |
|---|---|---|---|---|
| REQ-ATS-01 | ✓ | ✓ | ✓ | ✗ |
| REQ-ATS-02 | ✓ | ✓ | ✓ | ✓ CREATE_APPLICATION |
| REQ-ATS-03 | ✓ | ✓ | ✓ | ✗ |
| REQ-ATS-04 | ✓ | ✓ (UI) | Partial | ✗ |
| REQ-ATS-05 | ✓ | ✓ | ✓ | ✗ |
| REQ-ATS-06 | ✓ | ✓ | ✓ | ✓ UPDATE_APPLICATION_STATUS |
| REQ-ATS-07 | ✓ | ✓ | ✓ | ✓ CREATE_INTERVIEW |
| REQ-ATS-08 | ✓ | ✓ (schema) | Partial | ✗ |
| REQ-ATS-09 | ✓ | ✓ | ✓ | ✗ |
| REQ-ATS-10 | ✓ | ✓ | ✓ | ✗ |
| REQ-ATS-11 | ✓ | ✓ | ✓ | ✓ CREATE_OFFER |
| REQ-ATS-12 | ✓ | ✓ | ✓ | ✗ |
| REQ-ATS-13 | ✓ | ✓ | ✓ | ✗ |

**13/13 requirements có code thực tế. 5/13 requirements có AuditLog event.**

---
*Nguồn: docs/TRACEABILITY.md, backend/app/api/**, backend/prisma/schema.prisma, backend/lib/requireRole.ts, tests/**. Ngày: 2026-09-26.*
