# Output #10 - Prototype Brief

**Prototype goal:** Kiểm chứng các luồng có rủi ro cao liên quan đến tương tác giữa AI và sự kiểm soát của con người (Human-in-the-loop).
**Persona:** Lan - Recruiter bận rộn & Mai - Interviewer.

## 1. Flows
**FLOW A - AI-Assisted CV Screening (Lan)**
Mở chi tiết ứng viên → `loading` (AI đang phân tích) → hiển thị chia đôi màn hình: CV gốc (trái) và AI Summary + Match Score + Reason (phải).

**FLOW B - Human Confirmation for Screening (Lan)**
Lan đọc AI Summary và quyết định → bấm nút "Pass" hoặc "Reject" → hệ thống bật Modal `confirmation` (Yêu cầu double-check) → Lan tích chọn xác nhận → `success` → Cập nhật Pipeline Stage.

**FLOW C - AI Question Suggestion & Scorecard (Mai)**
Mai mở lịch phỏng vấn → `loading` (AI sinh câu hỏi từ JD/CV) → hiển thị danh sách gợi ý → Mai thao tác `edit/delete/add` thủ công trên danh sách → chốt danh sách thành Scorecard Form.

**FLOW D - AI Service Fallback (Lan/Mai)**
Hệ thống gọi AI để tóm tắt CV hoặc sinh câu hỏi → `processing` → `network-error` (AI service down) → UI chuyển sang trạng thái cảnh báo + hiển thị form nhập/đánh giá thủ công để luồng công việc không bị gián đoạn.

## 2. Required states
`idle`, `loading` (gọi AI), `processing`, `empty` (chưa có ứng viên/câu hỏi), `network-error` (AI timeout), `confirmation` (double-confirm modal), `fallback` (form thủ công), `success`.

## 3. Prototype assumptions
*(Hiển thị riêng, không trộn vào requirement)*
1. Layout màn hình Screening mặc định là Split-screen (chia đôi) để dễ đối chiếu.
2. Nút "Pass/Reject" sẽ không đổi trạng thái ngay mà luôn kích hoạt Modal Xác nhận để chặn AI tự quyết định.
3. Khi AI lỗi (`network-error`), các nút thao tác chính vẫn sáng (enabled) để người dùng có thể tự đọc CV và tự chấm điểm thay vì khóa toàn bộ hệ thống.
4. Scorecard có thể lưu nháp (draft) trước khi submit chính thức.
