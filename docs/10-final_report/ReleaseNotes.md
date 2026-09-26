# Output #31 — Release Notes

---

# v1.0.0 — Smart Recruitment ATS MVP

**Ngày release:** 2026-09-26
**Phạm vi:** 13 User Story (Must scope) — toàn bộ pipeline tuyển dụng từ Job Posting đến Offer
**Môi trường:** Staging → Production Demo

---

## Added (Tính năng mới)

### Core Workflow

- **Job Posting Management (US-ATS-01):** Recruiter/Admin tạo Job Posting (DRAFT), xuất bản (PUBLISHED), đóng (CLOSED). CANDIDATE chỉ xem được job PUBLISHED. Mã job `JOB-<uuid6>` sinh tự động.

- **CV Application & Upload (US-ATS-02):** Candidate nộp hồ sơ kèm file CV (PDF/DOCX/TXT, tối đa 5MB). Hệ thống chặn duplicate-apply cùng job (unique constraint `one_application_per_job_per_candidate`). File CV lưu dưới tên UUID tránh conflict.

- **CV Parsing & Fallback (US-ATS-03):** PDF và TXT được trích xuất text tự động (`pdf-parse`). DOCX và file hỏng trả `INSUFFICIENT_DATA` thay vì crash — Recruiter vẫn xem được CV gốc qua fallback UI.

- **AI CV Summary với nhãn minh bạch (US-ATS-04):** Màn hình CV Summary hiển thị label **"Thông tin được trích xuất tự động bởi AI"** ở mọi trường AI-generated. Toggle để xem PDF gốc khi giả lập AI lỗi.

- **AI Match Score (US-ATS-05):** `GET /api/applications/:id/match` trả `matchScore` (0–100), `matchedSkills[]`, `missingSkills[]`, `explanation`. Thuật toán keyword matching chuẩn hóa Unicode, loại stop-words EN/VI. AI lỗi → `INSUFFICIENT_DATA`, CV vẫn xem được.

- **Duyệt CV: Pass / Reject với Explicit Confirmation (US-ATS-06):** `PATCH /api/applications/:id` với status `SCREENING_PASSED` hoặc `REJECTED`. Reject yêu cầu Confirmation Dialog. AI không thể tự gọi endpoint này — chỉ RECRUITER/ADMIN/HIRING_MANAGER.

- **Lên lịch phỏng vấn + Conflict Check (US-ATS-07):** `POST /api/interviews` kiểm tra Interviewer không trùng lịch (exact datetime). Application phải ở trạng thái hợp lệ. Interviewer disabled bị chặn.

- **Gợi ý câu hỏi phỏng vấn (US-ATS-08):** Panel gợi ý câu hỏi theo context JD + CV. Interviewer chỉnh sửa hoặc bỏ câu hỏi AI gợi ý trước khi dùng. AI lỗi → panel ẩn, Interviewer vẫn điền câu hỏi thủ công.

- **Scorecard điểm phỏng vấn (US-ATS-09):** `POST /api/scorecards` — Interviewer nộp điểm + ghi chú. Scorecard read-only sau submit (`@unique interviewId`). Sai role → 403.

- **Tổng hợp Scorecard (US-ATS-10):** `GET /api/scorecards/summary` — Hiring Manager xem bảng điểm tổng hợp tất cả vòng, tính điểm trung bình. Chỉ ADMIN/HIRING_MANAGER có quyền.

- **Tạo Offer + Explicit Confirmation (US-ATS-11):** `POST /api/offers` — chỉ HIRING_MANAGER/ADMIN. Hệ thống chặn double-confirm (`OFFER_ALREADY_EXISTS`). UI yêu cầu gõ "XAC NHAN" để kích hoạt nút Submit (Explicit Confirmation — phòng chống lỗi click nhầm).

- **Candidate xem trạng thái pipeline (US-ATS-12):** `GET /api/applications/:id` — Candidate chỉ xem được đúng application của mình (kiểm tra `candidateId === authResult.userId`). Application của candidate khác trả 404.

- **Admin quản lý User & RBAC (US-ATS-13):** `GET/POST/PATCH /api/admin/*` — chỉ ADMIN. Tạo user, gán role, khóa/mở tài khoản. Non-admin truy cập → 403.

---

### Infrastructure & Cross-cutting

- **RBAC Middleware `requireRole()`:** JWT-based, kiểm tra `payload.role` trước mọi route handler. Trả typed error `UNAUTHORIZED (401)` hoặc `FORBIDDEN (403)`.
- **Typed Domain Errors:** `ValidationError`, `NotFoundError`, `ConflictError`, `ForbiddenError`, `UnauthorizedError` — tất cả map sang HTTP status code chuẩn qua `withErrorHandler()`.
- **AuditLog append-only:** Mọi action quan trọng (CREATE_APPLICATION, UPDATE_APPLICATION_STATUS, CREATE_INTERVIEW, CREATE_OFFER) được ghi vào bảng `audit_logs` với `actorId`, `action`, `targetType`, `targetId`, `metadata`.
- **Database Schema (Prisma + PostgreSQL/Supabase):** 7 model chính: User, JobPosting, Application, MatchResult, InterviewRound, Scorecard, Offer, AuditLog. MatchResult và AuditLog là append-only.
- **Seed data:** 6 user demo + 1 job "Backend Developer" + 1 CV mẫu sẵn sàng demo.

---

## Fixed (So với v0.1-demo)

- Sửa lỗi Modal Offer: CSS `uppercase` không đồng bộ với React `onChange` → thêm `.toUpperCase()` vào handler (A-UI-08).
- Bỏ sidebar to trong màn hình Scorecard — chuyển sang Collapsed để đủ không gian Split-view 60/40 (A-UI-04, A-UI-06).
- Sửa file validation: frontend giờ check cả `selectedFile.type` lẫn extension, thêm giới hạn 5MB với spinner loading (A-UI-09).

---

## Quality

| Metric | Kết quả |
|---|---|
| Lint errors | 0 |
| TypeScript errors | 0 |
| Unit/Integration tests pass | 200 TC (TC-AUTH-01 → TC-SEC-200) |
| Critical E2E scenarios | Thiết kế xong, chạy thủ công |
| AI không tự đổi ApplicationStatus | 0 trường hợp vi phạm |
| AuditLog mọi write action | Đã xác nhận qua Supabase dashboard |

---

## Known Issues (v1.0.0)

| ID | Mô tả | Mức độ | Kế hoạch |
|---|---|---|---|
| BUG-01 | Scorecard Summary hiển thị `null` thay vì "—" khi ứng viên chỉ 1 vòng phỏng vấn | Medium | Fix trong v1.0.1 |
| BUG-02 | Orphan CV file nếu `prisma.create()` fail sau `writeFile()` | High | Fix trong v1.0.1 |
| LIM-01 | DOCX không trích xuất được text → luôn trả `INSUFFICIENT_DATA` | Low | Thiết kế có chủ ý; có thể mở rộng bằng docx-parser trong v1.1 |
| LIM-02 | File CV lưu local filesystem, không scale trên multi-instance deployment | Medium | Migrate sang Supabase Storage trong v1.1 |

---

*Release notes chuẩn bị bởi: Smart Recruitment ATS Team | 2026-09-26*
