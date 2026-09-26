# Output #29 — Release Checklist

**Dự án:** Smart Recruitment ATS
**Phiên bản:** v1.0.0
**Mục tiêu release:** Toàn bộ 13 User Story Must (US-ATS-01 đến US-ATS-13)
**Ngày chuẩn bị:** Sprint 4 — Week 1

---

## A. Scope & Story Completion

- [ ] US-ATS-01 (Tạo Job Posting) — Done và AC pass: Create DRAFT, Publish → PUBLISHED, Close → CLOSED.
- [ ] US-ATS-02 (Nộp CV) — Done và AC pass: Upload PDF/DOCX/TXT ≤ 5MB; duplicate-apply bị block 409.
- [ ] US-ATS-03 (CV Parsing) — Done và AC pass: Parse PDF/TXT thành công; fallback INSUFFICIENT_DATA với DOCX.
- [ ] US-ATS-04 (AI CV Summary) — Done và AC pass: Summary hiển thị label "Thông tin được trích xuất tự động bởi AI"; fallback CV gốc khi AI lỗi.
- [ ] US-ATS-05 (Match Score) — Done và AC pass: matchScore + matchedSkills + missingSkills trả đúng; INSUFFICIENT_DATA với DOCX/file lỗi.
- [ ] US-ATS-06 (Duyệt CV: Pass/Reject) — Done và AC pass: Reject bắt buộc Confirmation Dialog + checkbox; AI không tự đổi trạng thái.
- [ ] US-ATS-07 (Lên lịch phỏng vấn) — Done và AC pass: Conflict check chặn trùng lịch Interviewer; application chưa SCREENING_PASSED bị block.
- [ ] US-ATS-08 (Gợi ý câu hỏi) — Done và AC pass: Câu hỏi AI gợi ý đúng context JD/CV; Interviewer sửa/bỏ được; AI lỗi → form vẫn dùng được thủ công.
- [ ] US-ATS-09 (Interviewer điền Scorecard) — Done và AC pass: Submit scorecard hợp lệ; thiếu tiêu chí bắt buộc bị chặn; read-only sau submit; sai role bị 403.
- [ ] US-ATS-10 (HM xem tổng hợp Scorecard) — Done và AC pass: Xem đủ scorecard các vòng; vòng chưa chấm hiển thị "—"; sai role bị 403.
- [ ] US-ATS-11 (Tạo Offer + Explicit Confirmation) — Done và AC pass: Phải gõ "XAC NHAN" để kích hoạt Submit; double-confirm bị chặn (OFFER_ALREADY_EXISTS); thiếu scorecard → 409.
- [ ] US-ATS-12 (Candidate xem trạng thái) — Done và AC pass: Candidate chỉ xem đúng application của mình; candidate khác bị 404.
- [ ] US-ATS-13 (Admin quản lý User + RBAC) — Done và AC pass: Tạo user + gán role; non-admin bị 403 khi truy cập /api/admin/*.

---

## B. Quality Gates

- [ ] `cd backend && npm run lint` — 0 errors.
- [ ] `tsc --noEmit` — 0 type errors.
- [ ] `python -m pytest tests/ -v` — toàn bộ test pass (TC-AUTH-01 đến TC-SEC-200).
- [ ] Playwright E2E (`npm test` ở root) — toàn bộ critical path pass.
- [ ] `npm run build:backend && npm run build:frontend` — build thành công không có lỗi.

---

## C. Database & Infrastructure

- [ ] Migration `prisma migrate deploy` đã chạy thành công trên môi trường staging.
- [ ] Migration đã chạy thành công trên môi trường production/demo.
- [ ] `prisma db seed` đã tạo đủ user demo: admin@ats.demo, recruiter@ats.demo, hm@ats.demo, interviewer@ats.demo, candidate@ats.demo (mật khẩu: Demo@123).
- [ ] Thư mục `storage/cv/` tồn tại và có quyền ghi trên server.

---

## D. Security & RBAC

- [ ] CANDIDATE không truy cập được endpoint `/api/admin/*` → kết quả 403.
- [ ] CANDIDATE không đọc được application của candidate khác → 404.
- [ ] INTERVIEWER không PATCH status của application → 403.
- [ ] CANDIDATE không truy cập `/api/applications/:id/match` → 403.
- [ ] Không có secret key nào hardcode trong source code (kiểm tra bằng `git grep -r "JWT_SECRET\|DATABASE_URL" --include="*.ts" --include="*.tsx"`).
- [ ] File `.env.example` đã cập nhật đầy đủ, không có giá trị thật.
- [ ] File `.env` (thật) đã thêm vào `.gitignore` và không có trong repository.

---

## E. AI Safety Rules

- [ ] AI Match Score không tự đổi `ApplicationStatus` — phải qua PATCH /api/applications/:id từ RECRUITER/ADMIN.
- [ ] MatchResult ghi append-only vào bảng `match_results` (không overwrite).
- [ ] AuditLog không thể xóa/sửa qua bất kỳ API nào (không có DELETE/PATCH cho /api/audit-logs).
- [ ] Label "Thông tin được trích xuất tự động bởi AI" hiển thị trên màn hình CV Summary.
- [ ] Khi AI service trả `INSUFFICIENT_DATA`, màn hình vẫn cho Recruiter xem CV gốc (fallback UI hoạt động).

---

## F. Smoke Test Production/Demo URL

- [ ] `GET /api/auth/login` với admin@ats.demo / Demo@123 → trả token.
- [ ] `GET /api/jobs` (với token) → trả danh sách job, có job "Backend Developer".
- [ ] Upload CV qua `POST /api/applications` → 201.
- [ ] `GET /api/applications/:id/match` → trả matchScore, matchedSkills, missingSkills.
- [ ] `PATCH /api/applications/:id` với status=SCREENING_PASSED → 200.
- [ ] `POST /api/interviews` → 201, có lịch phỏng vấn.
- [ ] `POST /api/offers` → 201, offer ở trạng thái DRAFT.
- [ ] `/scorecard-summary` (HM view) render đúng dữ liệu.

---

## G. Documentation & Runbook

- [ ] `docs/final_report/Output_30_Runbook.md` đã hoàn chỉnh và đã test lệnh trên clean clone.
- [ ] `docs/final_report/Output_31_ReleaseNotes.md` đã ghi đầy đủ Added/Fixed/Known Issues.
- [ ] README.md ở `/backend` và `/frontend` đã cập nhật lệnh setup mới nhất.
- [ ] Known issues và hướng rollback đã ghi trong Runbook.

---

*Tài liệu dựa trên: docs/TRACEABILITY.md, backend/prisma/schema.prisma, backend/app/api/**, tests/**. Ngày chuẩn bị: 2026-09-26.*
