# Output #34 — Status Report

---

# Báo cáo Trạng thái Tuần — Sprint 4 (Final Sprint)

**Tuần:** Sprint 4 — Week 2 (Tuần cuối trước release)
**Ngày báo cáo:** 2026-09-26
**Người tổng hợp:** Smart Recruitment ATS Team
**Overall Status:** 🟡 YELLOW — Feature complete cho toàn bộ Must scope; còn 2 known bugs cần track trước khi close.

---

## Tổng quan nhanh

| Hạng mục | Trạng thái | Chi tiết |
|---|---|---|
| Must Stories (13/13) | ✅ Done | Tất cả US-ATS-01..13 đã merge |
| Backend API | ✅ Complete | 8 route groups, RBAC, AuditLog hoạt động |
| Frontend Pages | ✅ Complete | 14 page/route trong frontend/app/ |
| Database | ✅ Migrated | Schema 7 model + seed data |
| Test Suite | 🟡 200 TC thiết kế, chạy cần backend live | Cần chạy lại trên staging |
| Known Bugs | 🔴 2 bugs mở | BUG-01 (Medium), BUG-02 (High) |

---

## Done (Sprint 4, Week 1–2)

- ✅ **US-ATS-09 Scorecard** merged — Split-view 60/40, read-only sau submit, sai role 403.
- ✅ **US-ATS-10 Scorecard Summary** merged — `GET /api/scorecards/summary` groupBy applicationId, average tính từ availableScores.
- ✅ **US-ATS-11 Offer + Explicit Confirmation** merged — Modal gõ "XAC NHAN", OFFER_ALREADY_EXISTS idempotency.
- ✅ **US-ATS-12 Pipeline Status** merged — Candidate GET own application only, 404 nếu sai owner.
- ✅ **US-ATS-13 Admin User Management** merged — CRUD user + role, non-admin 403.
- ✅ **Database seed** hoàn chỉnh — 6 user demo + job Backend Developer + CV mẫu cv-01-backend-developer.txt.
- ✅ **Test suite thiết kế** — 200 TC từ TC-AUTH-01 đến TC-SEC-200 (unit, integration, UI, security).
- ✅ **docs/final_report** — Tạo 9 output báo cáo (Output #24 → #35).

---

## In Progress / Cần hoàn thành

- 🔄 **Chạy lại toàn bộ 200 TC** trên staging sau khi backend start với DB production — cần môi trường staging live.
- 🔄 **Fix BUG-01** (Scorecard Summary null → "—") — estimate 2 giờ, chỉ ảnh hưởng display layer.
- 🔄 **Fix BUG-02** (Orphan CV file) — estimate 4 giờ, cần đảo thứ tự writeFile / prisma.create.
- 🔄 **Playwright E2E** — test script thiết kế xong, cần run trên staging URL thật.

---

## Blocked / Risks

| Risk | Mức độ | Mitigation |
|---|---|---|
| BUG-02 (Orphan CV file) | 🔴 High | Fix trước release: đảo thứ tự IO → DB trước, writeFile sau |
| BUG-01 (Scorecard null display) | 🟡 Medium | Fix display layer frontend, không ảnh hưởng business logic |
| File CV lưu local filesystem | 🟡 Medium (non-blocking v1.0) | Known limitation, ghi vào Known Issues; migrate sang Supabase Storage trong v1.1 |
| DOCX không parse được text | 🟢 Low (by design) | Documented trong Known Issues + INSUFFICIENT_DATA response rõ ràng |

---

## Tuần tới (Action Items)

1. **[Priority 1]** Fix BUG-02 — đảo thứ tự writeFile + prisma.create trong `applications/route.ts`.
2. **[Priority 2]** Fix BUG-01 — thêm `roundsCount` vào `scorecards/summary/route.ts`, cập nhật Frontend render.
3. **[Priority 3]** Chạy full test suite 200 TC trên staging, thu thập pass/fail count thực tế.
4. **[Priority 4]** Chạy Playwright E2E critical paths (login → apply → screen → interview → offer).
5. **[Priority 5]** Final smoke test trên production URL, xác nhận AuditLog ghi đúng.
6. **[Release Gate]** Sau khi BUG-01 + BUG-02 fix + full test green → tạo git tag v1.0.0.

---

## Decisions Needed

- **Có release v1.0.0 với BUG-01 (display-only) không?** → Đề xuất: Release với BUG-01 ghi trong Known Issues nếu BUG-02 đã fix. BUG-01 không ảnh hưởng business logic.
- **Migrate file storage sang Supabase Storage trong v1.0 hay v1.1?** → Đề xuất: v1.1 — không block MVP demo.

---

## Metrics Sprint 4

| Metric | Giá trị |
|---|---|
| Stories completed this sprint | 5 (US-ATS-09..13) |
| Bugs found this sprint | 2 (BUG-01, BUG-02) |
| Bugs fixed this sprint | 0 (đang trong queue) |
| AI tasks logged | 18 (xem Output #32) |
| Human review overrides | 11/18 tasks |
| Code lines written (backend API) | ~650 dòng TypeScript |

---
*Báo cáo tổng hợp từ: git log, docs/TRACEABILITY.md, tests/**, backend/app/api/**. Ngày: 2026-09-26.*
