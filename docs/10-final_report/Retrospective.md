# Output #35 — Retrospective & AI Metrics

**Dự án:** Smart Recruitment ATS v1.0.0
**Sprint:** Retrospective cuối dự án (Sprint 4)
**Ngày:** 2026-09-26
**Tham dự:** Quỳnh (BA/PM), Quỳnh Như (Frontend), Tâm Như (QA/Vault), Tuyết Sương (BA/Story), Thảo (Architecture/Backend)

---

## 1. AI Metrics — Kết quả đo đếm thực tế

| Metric | Kết quả | Ý nghĩa |
|---|---|---|
| Requirements-to-Story traceability | 13/13 requirements mapped | Không có Must requirement nào mồ côi — toàn bộ có story, task, code thực tế |
| User Stories completed (Must scope) | 13/13 | 100% Must scope delivered |
| AI tasks được log trong AI_USAGE_LOG | 18 tasks | Mọi lần dùng AI đều có context + human decision ghi lại |
| AI output được chấp nhận nguyên vẹn | 3/18 (17%) | AI hữu ích nhất khi scaffold boilerplate; logic business cần human review |
| AI output được chỉnh sửa đáng kể | 11/18 (61%) | Human phát hiện lỗi scope, logic, security, UX |
| Human ghi đè hoàn toàn AI | 4/18 (22%) | Layout UX, file validation frontend, usability findings |
| Bugs phát hiện trước merge (Human Review) | 2 bugs chính (BUG-01, BUG-02) + 3 lỗi nhỏ | Review + test tạo giá trị thực, không chỉ generation |
| AI tự đổi ApplicationStatus | 0 vi phạm | BR-ATS-01 hoạt động — AI không bypass được RBAC |
| AI tự ghi Offer không qua phỏng vấn | 0 vi phạm | BR-ATS-03 hoạt động — guard ở cả API lẫn DB |
| AuditLog coverage cho write actions | 5/13 requirements | CREATE_APPLICATION, UPDATE_APPLICATION_STATUS, CREATE_INTERVIEW, UPDATE_INTERVIEW_STATUS, CREATE_OFFER |
| Reusable code artifacts | 5 | requireRole(), withErrorHandler(), logAudit(), AppError hierarchy, Zod schema pattern |
| Test cases thiết kế | 200 TC (TC-AUTH-01 → TC-SEC-200) | Phủ unit, integration, UI, security, RBAC, AI fallback |

---

## 2. Phân tích AI-Assisted Implementation

### Thời gian ước tính tiết kiệm được (6 tasks tracked)

| Task | Ước tính không có AI | Ước tính với AI | Tiết kiệm |
|---|---|---|---|
| RBAC middleware `requireRole()` | 3 giờ | 1.5 giờ | ~50% |
| `withErrorHandler()` + AppError hierarchy | 2 giờ | 0.5 giờ | ~75% |
| Zod schema validation toàn bộ routes | 4 giờ | 1.5 giờ | ~63% |
| Keyword matching engine (match/route.ts) | 5 giờ | 2 giờ | ~60% |
| Prisma schema design (7 models) | 6 giờ | 2.5 giờ | ~58% |
| Test suite 200 TC scaffold | 8 giờ | 3 giờ | ~63% |
| **Tổng** | **28 giờ** | **11 giờ** | **~61% giảm** |

> Lưu ý: Tiết kiệm cao nhất ở boilerplate và scaffold. Review + fix lỗi AI chiếm khoảng 30% thời gian AI-assisted — không tính vào tiết kiệm.

---

## 3. Quality Benchmark

### AI Safety Rules (Business Critical)

| Rule | Test | Kết quả |
|---|---|---|
| BR-ATS-01: AI không tự đổi ApplicationStatus | CANDIDATE không thể PATCH /api/applications/:id | PASS — 403 |
| BR-ATS-01: AI không tự đổi ApplicationStatus | AI match score không trigger status change | PASS — không có trigger |
| BR-ATS-02: Match Score là hỗ trợ, không quyết định | CANDIDATE không đọc được match score | PASS — 403 |
| BR-ATS-03: Offer phải qua process phỏng vấn | REJECTED application không tạo được offer | PASS — 409 |
| ADR-001: Mọi AI-generated content có label | Label "Thông tin trích xuất tự động bởi AI" | PASS — hiển thị màn hình CV Summary |
| ADR-001: AI lỗi không lock UI | Fallback CV gốc khi AI lỗi | PASS — toggle fallback hoạt động |
| AuditLog append-only | Không có DELETE/PATCH endpoint cho audit_logs | PASS — không tồn tại endpoint xóa |

**AI Safety Score: 7/7 rules pass — 0 vi phạm.**

---

## 4. Keep — Những điều nên tiếp tục

- **Story Spec + Zod Schema trước khi coding:** Khi AI nhận đủ story spec, Zod schema, và danh sách error codes → output ít sai hướng hơn nhiều (giảm sai lần 1). Thấy rõ ở `requireRole()`, `withErrorHandler()`, và match score engine.
- **Typed Domain Errors:** Pattern `AppError → ValidationError / NotFoundError / ConflictError` giúp error mapping nhất quán toàn API mà AI tạo không cần hướng dẫn lại mỗi route.
- **Human Review bắt buộc trước merge:** Tất cả 2 bug production-risk (BUG-01, BUG-02) đều phát hiện qua code review, không phải test — khẳng định review không thể bỏ.
- **AI Usage Log thực chiến:** Ghi context → AI output → human decision ngay trong sprint giúp retrospective có số liệu thực, không nhớ lại sau.

---

## 5. Improve — Những điều cần cải thiện

- **Benchmark AI fallback với DOCX:** Test suite hiện tại thiếu test case DOCX với content thật (TC-AI-05 chỉ test image-based PDF). Cần thêm DOCX test fixture thật.
- **E2E automation chưa chạy được trên CI:** Playwright tests thiết kế xong nhưng cần backend live trên staging. Cần setup CI/CD pipeline với staging database.
- **Scorecard Summary thiếu context metadata:** BUG-01 phát sinh vì API không trả `roundsCount` — thiếu thiết kế response schema trước khi code. Nên dùng TypeScript interface đầy đủ trước khi AI implement.
- **File storage không scale:** Lưu CV trên local filesystem không dùng được trên multi-instance. Nên quyết định Supabase Storage từ Sprint 1 thay vì để lại Known Limitation.

---

## 6. Stop — Những điều nên dừng lại

- **Cho AI sửa nhiều module cùng lúc:** Lần AI đề xuất đổi cả schema Prisma + API Contract + Frontend component một lần → diff quá lớn, khó review, dễ bỏ sót lỗi. Quy tắc: mỗi AI task chỉ chạm ≤ 2 file.
- **Dùng AI viết Usability Finding không có bằng chứng:** A-16 (AI thêm finding "không thích màu đỏ" không có nguồn) → loại bỏ khỏi finding chính thức. AI không được suy diễn từ dữ liệu quan sát.
- **Copy-paste AI output mà không đọc:** BUG-02 (orphan file) và lỗi Modal Offer (CSS uppercase không đồng bộ onChange) đều là lỗi mà human đọc code 5 phút sẽ thấy ngay.

---

## 7. Next Experiment (v1.1)

- Thêm eval set 30 utterances cho AI Q&A (benchmark Vault) — gồm conflict cases, không chỉ factual cases.
- Tích hợp Supabase Storage để lưu CV file — loại bỏ LIM-02.
- Thêm `roundsCount` vào `GET /api/scorecards/summary` response — fix BUG-01 chính thức.
- Setup CI pipeline: `npm run lint` + `tsc --noEmit` + `pytest tests/` tự động mỗi PR.
- Thử docx-parser cho DOCX files để loại bỏ LIM-01 (INSUFFICIENT_DATA với DOCX).

---

## 8. Lời kết

Dự án Smart Recruitment ATS v1.0.0 chứng minh được giá trị của AI-assisted development khi:
- Spec rõ ràng (Story Spec, Zod schema, error codes) → AI scaffold đúng hướng.
- Human review bắt buộc → phát hiện lỗi logic, security, race condition mà AI không tự thấy.
- AI Safety Rules cứng (RBAC, AuditLog, Explicit Confirmation) → 0 vi phạm trong toàn bộ Must scope.

**Tổng giá trị AI-assisted:** ~61% giảm thời gian trên 6 tracked tasks; 2 production-risk bugs bắt được trước release; 5 reusable artifacts tái dùng cho story tiếp theo.

---
*Retrospective chuẩn bị từ: docs/AI_USAGE_LOG.md, backend/app/api/**, tests/**, docs/TRACEABILITY.md. Ngày: 2026-09-26.*
