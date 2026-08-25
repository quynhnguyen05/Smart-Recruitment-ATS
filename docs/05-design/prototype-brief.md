# Output #10 - Prototype Brief

**Prototype Goal:** Xác thực thiết kế UX/UI cho các luồng nghiệp vụ có rủi ro cao, đặc biệt tập trung vào cơ chế tương tác Human-in-the-loop (con người kiểm soát AI) nhằm đảm bảo tính minh bạch và tính chính xác của hệ thống.
**Persona:** Lan (Recruiter) - Sàng lọc hồ sơ & Mai (Interviewer) - Phỏng vấn đánh giá.

## 1. Các luồng tương tác chính (User Flows)

**FLOW A: Sàng lọc CV với sự hỗ trợ của AI (AI-Assisted CV Screening)**
Recruiter truy cập chi tiết Application → UI chuyển sang trạng thái `loading` (AI tiến hành parse dữ liệu) → Hiển thị giao diện đối chiếu: Bản gốc CV (cột trái) và Bảng phân tích AI gồm Summary, Match Score, Matched/Missing Skills (cột phải).

**FLOW B: Con người kiểm soát và xác nhận (Explicit Human Confirmation)**
Recruiter đánh giá dựa trên AI Summary → Click CTA "Pass" hoặc "Reject" → Hệ thống kích hoạt trạng thái `confirmation` (Modal yêu cầu Double-check) → Recruiter tick chọn lý do/xác nhận → UI báo `success` → Cập nhật Pipeline Stage.

**FLOW C: Gợi ý câu hỏi phỏng vấn (AI Question Suggestion & Scorecard)**
Interviewer truy cập lịch phỏng vấn → `loading` (AI sinh câu hỏi dựa trên tham chiếu JD và CV) → Hiển thị danh sách câu hỏi gợi ý → Interviewer thực hiện các thao tác `edit/delete/add` trực tiếp trên danh sách → Lưu cấu hình form Scorecard để tiến hành phỏng vấn.

**FLOW D: Xử lý ngoại lệ hệ thống (AI Service Fallback)**
Kích hoạt tiến trình AI (tóm tắt CV/sinh câu hỏi) → `processing` → AI Service phản hồi `network-error` (Timeout/Down) → UI hiển thị thông báo lỗi (Error Banner) + Chuyển đổi mượt mà sang `fallback` state (cho phép người dùng tải form đánh giá thủ công, không làm gián đoạn luồng nghiệp vụ).

## 2. Các trạng thái UI bắt buộc (Required UI States)
`idle` (mặc định), `loading` (chờ phản hồi từ AI), `processing` (xử lý dữ liệu), `empty` (chưa có dữ liệu ứng viên/câu hỏi), `network-error` (lỗi kết nối AI), `confirmation` (yêu cầu xác nhận thao tác rủi ro cao), `fallback` (ghi đè thủ công), `success` (hoàn tất luồng).

## 3. Các giả định thiết kế (Prototype Assumptions)
*(Danh sách giả định UX/UI cần được duyệt, độc lập với Requirement)*
1. Giao diện màn hình Screening (Sàng lọc) sử dụng layout Split-view (chia đôi màn hình) để tối ưu hóa trải nghiệm đối chiếu trực quan giữa CV gốc và AI Summary.
2. Nút CTA "Pass/Reject" không thực thi thay đổi trạng thái ngay lập tức (Immediate Action) mà luôn kích hoạt Modal Xác nhận, tuân thủ nguyên tắc ngăn chặn AI tự ra quyết định.
3. Trong trường hợp xảy ra lỗi AI (`network-error`), các nút thao tác nghiệp vụ cốt lõi vẫn giữ trạng thái `enabled`, cho phép người dùng vận hành hệ thống theo phương thức thủ công toàn phần (Manual Override).
4. Module Scorecard hỗ trợ tính năng lưu nháp (Auto-save/Draft) nhằm bảo vệ dữ liệu đánh giá trước khi Submit chính thức.

---
