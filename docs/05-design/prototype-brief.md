**Output #10 - Prototype Brief**

**Prototype goal:** kiểm chứng 4 flow có rủi ro cao.
**Persona:** Lan - Recruiter bận rộn.

**FLOW A - CV Screening**
"Xem chi tiết ứng viên"
→ loading → parse CV → processing → hiển thị CV gốc + AI Summary & Match Score.

**FLOW B - Human Confirmation**
"Bấm nút Pass/Reject"
→ hệ thống chặn lại → bật confirmation modal → tick xác nhận → success.

**FLOW C - Question Suggestion**
"Xem bộ câu hỏi gợi ý"
→ loading → sinh câu hỏi → hiển thị list → người dùng edit/delete → lưu Scorecard.

**FLOW D - AI Service Fallback**
"Hệ thống đang tóm tắt CV"
→ processing → network-error → cảnh báo lỗi → chuyển sang form nhập thủ công.

**Required states:**
idle, loading, processing, empty, network-error, confirmation, fallback, success.

**Prototype assumptions:**
- Layout màn hình screening là chia đôi (CV bên trái, AI bên phải).
- Bấm Pass/Reject không đổi trạng thái ngay, bắt buộc qua Modal.
- Khi network-error, các nút thao tác không bị vô hiệu hóa.
