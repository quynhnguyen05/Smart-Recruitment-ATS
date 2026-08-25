# Output #16 - Figma / Design System Handoff

### DESIGN TOKENS 

| Token | Value | Use |
| :--- | :--- | :--- |
| color.primary | #1D4ED8 | Primary CTA (Xác nhận, Lưu đánh giá), Active tab |
| color.success | #059669 | Pass, Offer, High Match Score (≥ 80%) |
| color.warning | #D97706 | Missing skills, Medium Match Score (50-79%) |
| color.danger | #DC2626 | Reject, Low Match Score (< 50%), Error state |
| radius.md | 8px | CV Cards, Modal dialogs, Input fields |
| space.base | 4px scale | 4/8/12/16/24/32 (Padding, Margins) |
| type.body | 14/20 | Nội dung CV, văn bản AI Summary, mô tả công việc |
| type.caption | 12/16 | Metadata (ngày nộp), kỹ năng phụ, label phụ |

### COMPONENT INVENTORY

| Component | Variants/States | Accessibility/behavior |
| :--- | :--- | :--- |
| DecisionButton | default/hover/disabled/loading | Nút Pass/Reject; hiển thị focus ring; khóa khi AI loading. |
| MatchScoreBadge | high/medium/low/error | Thay đổi màu theo điểm; aria-label đọc rõ phần trăm. |
| ConfirmationModal | default/loading/success | Focus trap; nút Submit chỉ enabled khi người dùng tick checkbox; phím Escape để hủy. |
| QuestionItem | default/edit-mode/draft | Hỗ trợ Tab navigate qua các icon; Enter để lưu chỉnh sửa inline. |
| AISummaryCard | loading/success/fallback | Vùng chứa thông tin AI; chuyển sang form nhập thủ công (fallback) nếu mạng lỗi. |
| ScorecardForm | draft/submitting/error | Disable nút "Lưu" nếu chưa điền các trường bắt buộc; cảnh báo nếu thoát ngang. |

### UX COPY 

| Context | Copy |
| :--- | :--- |
| AI Loading | Hệ thống AI đang phân tích hồ sơ ứng viên và đối chiếu với JD... |
| Match Reason | **Lý do khớp:** Ứng viên có kỹ năng [X]. **Kỹ năng thiếu:** Chưa thấy đề cập [Y]. |
| Confirmation Modal | Bạn đang quyết định trạng thái của ứng viên. Vui lòng xác nhận quyết định này dựa trên đánh giá thực tế của bạn, không hoàn toàn phụ thuộc vào AI. |
| AI Network Error | Tính năng AI đang gián đoạn. Vui lòng xem bản gốc CV và thực hiện thao tác thủ công. |
| Empty Questions | AI chưa đủ dữ liệu để gợi ý. Vui lòng tạo câu hỏi phỏng vấn thủ công. |
| Scorecard Draft | Bản nháp đánh giá phỏng vấn đã được lưu tạm. |
| Success Offer | Đã lưu quyết định Offer thành công. |
