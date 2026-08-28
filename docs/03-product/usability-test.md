# Usability Test Script & Findings

**Prototype goal:** Kiểm chứng 3 luồng (flow) có rủi ro cao nhất về trải nghiệm người dùng và tính minh bạch của AI trong hệ thống Smart Recruitment.
**Persona tham gia test:** Lan (Recruiter), Mai (Interviewer), An (Candidate).
**Ngày test:** [Điền ngày thực hiện]

| Task | Success criterion | Finding (Quan sát thực tế) | Evidence (Bằng chứng) | Decision (Quyết định thiết kế) |
| :--- | :--- | :--- | :--- | :--- |
| **T1: Duyệt CV (Recruiter)** | User đọc kỹ phần Match Reason (Matched/Missing Skills) trước khi đưa ra Human Confirmation (BR-ATS-03, BR-ATS-05). | Recruiter có xu hướng "tin mù quáng" vào Match Score cao mà không đọc chi tiết. | 1/3 Recruiter bấm "Pass" ngay khi thấy Match Score > 90% mà không đọc lý do. | Giấu nút Pass/Reject xuống dưới. Yêu cầu hiển thị rõ phần Matched Skills và Missing Skills ngay cạnh Score để buộc user phải đọc. |
| **T2: Xác nhận Pass/Reject (Recruiter)** | User nhận thức được đây là hành động cần Explicit Confirmation. Bấm Pass/Reject không đổi trạng thái ngay. | Cảnh báo xác nhận ở Modal chưa đủ mạnh, user dễ click nhầm theo thói quen. | User bấm nút xác nhận nhanh vì nghĩ hệ thống có thể hoàn tác dễ dàng. | Yêu cầu user phải tick vào checkbox xác nhận trước khi nút "Xác nhận" sáng lên (Enabled). |
| **T3: Điền Scorecard (Interviewer)** | User tìm thấy các câu hỏi AI gợi ý và điền Scorecard thành công. | Form chấm điểm bị ngắt quãng với phần xem CV, khó đối chiếu. | Interviewer phải mở 2 tab trình duyệt để vừa xem CV vừa chấm điểm. | Chia màn hình Split-view: Trái là CV ứng viên, Phải là Scorecard và Câu hỏi gợi ý. |
| **T4: AI Lỗi (Fallback)** | Khi mạng lỗi, user không bị kẹt lại và vẫn biết cách nhập thủ công. | User hoang mang không biết hệ thống đang load hay đã treo do thông báo lỗi mờ nhạt. | 2/3 user refresh lại trang làm mất dữ liệu. | Hiển thị rõ Banner Danger (Đỏ) và ngay lập tức mở form nhập text thủ công thay vì loading vô tận. |
