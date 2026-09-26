# Output #32 — AI Usage Log (Consolidated)

**Dự án:** Smart Recruitment ATS
**Ghi chú:** File này tổng hợp từ docs/AI_USAGE_LOG.md (gốc, theo thành viên) và bổ sung mapping code thực tế với quá trình human review theo chuẩn Output #32.

---

## Bảng AI Usage Log — Toàn dự án

| ID | Task | Input/Context | AI Output | Human Verification/Decision | Code thực tế bị ảnh hưởng | Giá trị |
|---|---|---|---|---|---|---|
| **A-01** | Soạn Project Charter | Bối cảnh đề tài ATS, 5 role, workflow Job→Apply→Screen→Interview→Score→Offer/Reject | AI viết Charter đầy đủ nhưng tự thêm "hệ thống tự động xếp hạng ứng viên phù hợp nhất" — vi phạm nguyên tắc AI không tự quyết định | Phát hiện tính năng vượt scope; xóa bỏ; thay bằng chỉ số đo được "0 trường hợp AI tự đổi trạng thái Application" | Không trực tiếp (tác động lên Charter/PRD) | Loại bỏ tính năng nguy hiểm khỏi scope |
| **A-02** | Viết PRD từ requirements.md | 13 FR + 5 NFR + 3 BR đã chốt | PRD thêm Goal mới "G5: Tăng tỷ lệ ứng viên quay lại nhờ AI cá nhân hóa" — không có REQ nguồn | Phát hiện G5 không có REQ nguồn → xóa khỏi PRD | Không trực tiếp (PRD) | Giữ PRD nhất quán với requirement đã confirm |
| **A-03** | Story slicing 13 User Story | PRD đã duyệt + khung 5 Epic | AI đề xuất gộp US-ATS-09 và US-ATS-10 thành 1 story lớn 5 điểm | Phát hiện vi phạm Definition of Ready (≤3 điểm, 2 role khác nhau); ép AI tách lại | Không trực tiếp (backlog) | Stories tuân thủ DoR, dễ ước lượng |
| **A-04** | Implement kiến trúc Auth + RBAC | Yêu cầu RBAC, 5 role | AI sinh middleware requireRole() dùng JWT verify | Human xác nhận logic đúng; không phát hiện lỗi nghiêm trọng | `backend/lib/requireRole.ts` (34 dòng) | RBAC production-ready, reusable |
| **A-05** | Implement POST /api/applications | US-ATS-02 spec + BR-ATS-01 | AI sinh route handler đầy đủ RBAC, Zod validation, duplicate check | Human phát hiện mkdir+writeFile chạy TRƯỚC prisma.create() → orphan file risk (BUG-02) | `backend/app/api/applications/route.ts` (98 dòng) | Phát hiện race condition trước production |
| **A-06** | Implement GET /api/applications/:id/match | US-ATS-05 spec + ADR-001 | AI sinh keyword matching engine: normalize Unicode, stop-words EN/VI, tính matchScore | Human xác nhận logic đúng; thêm STOP_WORDS tiếng Việt không dấu (cua, cho, voi...) | `backend/app/api/applications/[id]/match/route.ts` (79 dòng) | Match score chạy không cần LLM, không hallucinate |
| **A-07** | Implement POST /api/interviews + conflict check | US-ATS-07 spec | AI sinh Promise.all() check song song: application exists + interviewer valid + conflict | Human xác nhận đúng; thêm check `interviewer.disabled === true` | `backend/app/api/interviews/route.ts` (77 dòng) | Conflict check atomic, không race giữa các check |
| **A-08** | Implement GET /api/scorecards/summary | US-ATS-10 spec | AI sinh groupBy applicationId + tính average | Human phát hiện null roundTwoScore render thành "N/A" trên frontend → BUG-01 | `backend/app/api/scorecards/summary/route.ts` (44 dòng) | Phát hiện UX bug trước release |
| **A-09** | Implement POST /api/offers + idempotency | US-ATS-11 spec + BR-ATS-03 | AI sinh OFFER_ALREADY_EXISTS check, REJECTED application guard | Human thêm yêu cầu gõ "XAC NHAN" trên Frontend (Explicit Confirmation) sau Usability Test | `backend/app/api/offers/route.ts` + Frontend Modal | Chống lỗi double-submit từ cả BE lẫn FE |
| **A-10** | Thiết kế Data Model (Prisma schema) | Architecture + Glossary + BR/NFR | AI ban đầu tạo bảng Position riêng và overwrite MatchResult mỗi lần AI chạy | Human bắt lỗi: xóa bảng Position (gộp vào JobPosting), đổi MatchResult và AuditLog thành append-only | `backend/prisma/schema.prisma` (177 dòng) | Đảm bảo audit trail không bị xóa/ghi đè |
| **A-11** | Viết API Contract | Data Model + RBAC | AI cấp quyền PUBLIC cho `/api/applications/:id/match` | Human phát hiện rò rỉ: chỉ RECRUITER/ADMIN/INTERVIEWER/HIRING_MANAGER được tính AI score | `backend/app/api/applications/[id]/match/route.ts` L43: requireRole(['ADMIN','RECRUITER','INTERVIEWER','HIRING_MANAGER']) | Chặn CANDIDATE xem AI score của ứng viên khác |
| **A-12** | Dựng UI Split-view Scorecard (US-ATS-09) | Giao diện tĩnh của Output #11 | AI tạo layout tràn viền, che mất CV ứng viên khi chấm điểm | Human bác bỏ → ép layout 60/40 Split-view để vừa nhìn CV vừa chấm điểm | `frontend/app/scorecard/page.tsx` (layout) | UX tốt hơn cho Interviewer |
| **A-13** | Modal Confirmation Offer (US-ATS-11) | Usability Test T4 — dễ click nhầm | AI sinh OK/Cancel cơ bản, màu trung tính | Human bác bỏ → yêu cầu viền đỏ (danger color) + gõ "XAC NHAN" kích hoạt Submit | `frontend/app/offer-approval/ConfirmModal.tsx` | Phòng chống lỗi UX nghiêm trọng |
| **A-14** | Fix Input Modal Offer (A-UI-08) | Test chức năng gõ "XAC NHAN" | AI dùng CSS `uppercase` nhưng quên `.toUpperCase()` trong `onChange` React | Human test tay phát hiện bug; tự sửa thêm `.toUpperCase()` vào event handler | `frontend/app/offer-approval/` (onChange handler) | Bắt được logic bug trước release |
| **A-15** | Validate file CV Frontend (US-ATS-02) | NFR — chỉ PDF/DOCX, ≤ 5MB | AI không xử lý chặt validate file type | Human tự code hàm check `selectedFile.type` + extension + size limit; thêm spinner loading | `frontend/app/apply/` (file input handler) | Frontend validation đúng NFR |
| **A-16** | Tổng hợp Usability Findings vòng 2 | Ghi chú quan sát thô từ 3 người test | AI suy diễn thêm "người dùng không thích màu đỏ của nút Reject" — không có bằng chứng quan sát | Human kiểm tra ghi chú gốc, không thấy bằng chứng → loại bỏ | Không trực tiếp (usability-test.md) | Tránh đưa hallucination AI vào finding chính thức |
| **A-17** | Q&A Benchmark Vault (Output #9) | Toàn bộ thư mục vault | AI tự suy luận cho 5 câu Unknown (VD: "Mật khẩu admin cần 8 ký tự") | Human ép AI trả lời "KHÔNG ĐỦ DỮ LIỆU" cho Q14–Q18, Q20 | Không trực tiếp (benchmark kết quả) | Loại bỏ hallucination trong grounding test |
| **A-18** | Test Q&A: Gửi Offer không qua phỏng vấn | Q12 Benchmark — BR-ATS-03 | AI trả lời "Được, nếu Match Score cao có thể linh động" — vi phạm BR | Human phát hiện hallucination; ép AI đọc lại file decision-log.md + BR-ATS-03 | `backend/app/api/offers/route.ts` (guard logic) | Xác nhận backend guard đúng business rule |

---

## Tổng kết

| Chỉ số | Giá trị |
|---|---|
| Tổng AI tasks được log | 18 |
| Lần AI output được chấp nhận nguyên vẹn | 3 (A-04, A-07, A-11 sau fix) |
| Lần Human bắt lỗi AI (logic/scope/hallucination) | 11 |
| Lần Human tự quyết định ghi đè AI hoàn toàn | 4 (A-12, A-13, A-15, A-16) |
| Bugs phát hiện nhờ Human Review (không phải AI) | BUG-01, BUG-02 + lỗi Modal Offer |
| Artifacts tái sử dụng được | requireRole(), withErrorHandler(), logAudit(), AppError hierarchy |

> **Nguyên tắc rút ra:** AI hữu ích nhất khi spec rõ ràng (story spec + Zod schema + error codes). Review con người bắt được lỗi logic (race condition, thứ tự IO) mà AI không tự phát hiện.

---
*Tổng hợp từ: docs/AI_USAGE_LOG.md + phân tích code thực tế backend/app/api/** + backend/lib/**. Ngày: 2026-09-26.*
