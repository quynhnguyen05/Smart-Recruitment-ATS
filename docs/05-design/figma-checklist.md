# Danh Mục Kiểm Tra Cấu Trúc Tệp Figma (Figma File Structure Checklist) — Smart Recruitment ATS

**Phiên bản (Version):** 1.3 (Chuẩn hóa đồng bộ 100% với Cơ cấu 14 User Stories & 4 Điểm Vàng Kỹ Thuật)  
**Cập nhật lần cuối (Last updated):** 2026-10-16  
**Người phụ trách (Owner):** UX/UI & Engineering  
**Tệp Figma chính thức (Figma File):** [Liên kết dự án Figma — Lưu trữ trong hồ sơ thiết kế đồ án]  

> 💡 **Mục đích:** Danh mục kiểm tra này đảm bảo các khung thiết kế Figma phản ánh chính xác cấu trúc trang, thành phần giao diện, luồng nghiệp vụ và 4 điểm vàng kỹ thuật đã được hiện thực hóa trong mã nguồn Frontend Next.js và Backend Prisma/PostgreSQL của hệ thống HireFlow AI.

---

## 1. Cấu Trúc Các Trang Bắt Buộc (Mandatory Pages Structure)

### Trang 1: 📐 Nền Tảng Thiết Kế (Foundations)
- [ ] **Kiểu màu sắc (Color Styles):** Đầy đủ các mã màu token ngữ nghĩa: `Primary (#1D4ED8)`, `Success (#059669)`, `Warning (#D97706)`, `Danger (#DC2626)`, `Neutral-50/100/200/600/900`.
- [ ] **Kiểu chữ (Text Styles):** Phông chữ hệ thống chuẩn Inter từ Google Fonts với các cấp độ cỡ chữ: `heading-lg`, `heading-md`, `heading-sm`, `body-base (14px)`, `body-sm`, `caption`.
- [ ] **Khung khoảng cách (Spacing frame):** Hướng dẫn tỷ lệ khoảng cách theo thang đo chuẩn 8px (`4, 8, 12, 16, 20, 24, 32, 40px`).
- [ ] **Hướng dẫn bo góc & đổ bóng (Border Radius & Shadows):** Bo góc chuẩn `radius.md (6-8px)`, bóng mờ nhẹ `elevation.1` và `elevation.2` cho thẻ Card và Modal.

---

### Trang 2: 🧩 Danh Mục Thành Phần Giao Diện (Components)
- [ ] **`MatchScoreBadge` (Huy hiệu điểm phù hợp):** Thể hiện tỷ lệ phần trăm (0 - 100%) hoặc trạng thái `N/A` khi chưa đủ dữ liệu (`INSUFFICIENT_DATA`).
- [ ] **`DecisionButton` (Cặp nút duyệt hồ sơ):** Nút **"Đạt (Pass)"** màu xanh dương `#1D4ED8` và nút **"Từ chối (Reject)"** viền đỏ.
- [ ] **`RejectModal` (Hộp thoại xác nhận từ chối - M01):** Modal cảnh báo ghi Audit Log kèm cặp nút Hủy / Xác nhận màu đỏ, không thể hoàn tác (`REJECTED`).
- [ ] **`OfferConfirmationModal` (Hộp thoại chốt Offer - M02):** Modal Human Confirmation có ô nhập yêu cầu bắt buộc gõ token **"XAC NHAN"** để kích hoạt nút Chốt Offer.
- [ ] **`ScorecardSubmitModal` (Hộp thoại nộp điểm thành công - M03):** Modal dấu tích xanh thông báo hoàn tất chấm điểm kèm nút quay về danh sách.
- [ ] **`AISummaryToggle` (Nút chuyển đổi tóm tắt):** Nút bấm *"✨ Tóm tắt CV (AI)"* và *"Hoàn tác (Xem CV Gốc)"*.
- [ ] **`ScorecardInput` (Ô nhập điểm chuyên môn):** Ô nhập số nguyên **Thang điểm 1 - 10** (`min="1" max="10"`) kèm ô ghi chú đánh giá nhiều dòng.
- [ ] **`ApplicationStatusBadge` (Huy hiệu trạng thái hồ sơ):** Đầy đủ 6 trạng thái cơ sở dữ liệu: `NEW`, `SCORED`, `SCREENING_PASSED`, `REJECTED`, `INTERVIEWING`, `OFFERED`.
- [ ] **`Sidebar` (Thanh điều hướng bên trái):** Logo HireFlow AI, phân nhóm menu theo vai trò (Tổng quan, Tuyển dụng, Hồ sơ ứng viên, Phỏng vấn & đánh giá, Offer & quản trị).

---

### Trang 3: 🗺️ Các Luồng Thao Tác Người Dùng (User Flows)
- [ ] **Luồng Sàng lọc CV (`/cv-review`):** Giao diện chia đôi màn hình 60/40 (Cột trái: CV gốc / Tóm tắt AI — Cột phải: Match Score, kỹ năng có/thiếu, nút Pass/Reject).
- [ ] **Luồng Xếp lịch phỏng vấn (`/schedule-interview`):** Biểu mẫu chọn ứng viên đã qua sàng lọc, phân bổ Vòng 1 hoặc Vòng 2, ngày giờ và chọn phỏng vấn viên.
- [ ] **Luồng Chấm điểm Scorecard (`/scorecard`):** Giao diện chia đôi 60/40 đối chiếu CV trực tiếp, kiểm tra khóa nút nếu chưa đến giờ (`scheduledAt > now`), form chấm điểm 1-10.
- [ ] **Luồng Tổng hợp & Phê duyệt Offer (`/scorecard-summary` → `/offer-approval`):** Bảng tổng hợp điểm các vòng, tạo mức lương đề xuất, gõ token `XAC NHAN` chốt Offer.
- [ ] **Luồng Ứng viên nộp đơn & theo dõi (`/jobs` → `/apply` → `/applications`):** Nộp CV (PDF/DOCX/TXT ≤ 5MB) và theo dõi danh sách đơn nộp.
- [ ] **Luồng Quản trị tài khoản (`/admin-users`):** Cấp quyền người dùng mới và vô hiệu hóa tài khoản (Soft-delete bảo toàn Audit Log).

---

## 2. Bảng Ánh Xạ Story Sang Khung Thiết Kế Figma (Story → Figma Frame Mapping)

> 💡 **Lưu ý:** Các quy chuẩn về 14 User Stories và 4 Điểm Vàng kỹ thuật (Thang điểm 1-10, CV ≤ 5MB, Token XAC NHAN, Khóa giờ phỏng vấn) được quy định thống nhất tại [decision-log-design.md](./decision-log-design.md).

| Mã Story | Tên màn hình tương ứng | Route thực tế | Khung thiết kế Figma (Frame ID) |
|:---|:---|:---|:---|
| **US-ATS-01** | Tạo và quản lý tin tuyển dụng | `/create-job`, `/dashboard` | `Frames/Admin/S06-JobForm` |
| **US-ATS-02** | Xem danh sách việc làm & nộp CV (≤ 5MB) | `/jobs`, `/apply` | `Frames/Public/S01-JobPortal` |
| **US-ATS-03** | Trình đọc và hiển thị tệp CV gốc (60%) | `/cv-review` (Ngăn trái) | `Frames/Recruiter/S07-CVViewer` |
| **US-ATS-04** | Tính năng tóm tắt CV bằng AI | `/cv-review` (Chế độ tóm tắt) | `Frames/Recruiter/S07-AISummary` |
| **US-ATS-05** | AI Match Score & Phân tích kỹ năng (40%) | `/cv-review` (Ngăn phải) | `Frames/Recruiter/S07-MatchScore` |
| **US-ATS-06** | Nút Pass/Reject & Modal M01 (Audit Log) | `/cv-review` | `Frames/Recruiter/S07-Decision` |
| **US-ATS-07** | Lên lịch phỏng vấn Vòng 1 / Vòng 2 | `/schedule-interview` | `Frames/Recruiter/S08-Schedule` |
| **US-ATS-08** | Bảng lịch phỏng vấn cá nhân | `/my-interviews` | `Frames/Interviewer/S09-Interviews` |
| **US-ATS-09** | Khối AI gợi ý câu hỏi phỏng vấn | `/scorecard` (Ngăn phải) | `Frames/Interviewer/S10-AIQuestions` |
| **US-ATS-10** | Phiếu chấm điểm 1-10 & khóa giờ Scorecard | `/scorecard` | `Frames/Interviewer/S10-Scorecard` |
| **US-ATS-11** | Bảng tổng hợp điểm các vòng phỏng vấn | `/scorecard-summary` | `Frames/HM/S11-ScorecardSummary` |
| **US-ATS-12** | Chốt Offer & Modal M02 (Token XAC NHAN) | `/offer-approval` | `Frames/HM/S12-OfferApproval` |
| **US-ATS-13** | Cổng theo dõi trạng thái đơn của ứng viên | `/applications` | `Frames/Candidate/S04-Applications` |
| **US-ATS-14** | Quản lý user & phân quyền (Soft-delete) | `/admin-users` | `Frames/Admin/S13-UserManagement` |

---

## 3. Tiêu Chuẩn Nghiệm Thu Chuyển Giao (Handoff Quality Criteria)

- [ ] **Mã màu và token:** Tuyệt đối không để mã màu tự do, toàn bộ phải liên kết tới Color Styles chuẩn đã khai báo trong DESIGN.md.
- [ ] **Tỷ lệ chia đôi màn hình:** Giữ đúng tỷ lệ 60% bên trái (đọc CV) và 40% bên phải (phân tích & chấm điểm) trên màn hình desktop.
- [ ] **Độ chính xác dữ liệu:** Điểm Scorecard thể hiện thang điểm 1-10, giới hạn CV 5MB (PDF/DOCX/TXT), modal Offer thể hiện trường nhập token `XAC NHAN`.

