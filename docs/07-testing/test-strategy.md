# Output #26 - Test Strategy 

| Layer | Coverage cho toàn dự án (MVP) |
| :--- | :--- |
| Unit | Trình xác thực lược đồ AI (CV Parser, Match Score schema); Validate định dạng file CV (PDF/DOCX); Rule chuyển đổi trạng thái (State machine); Helpers phân quyền RBAC (Admin, Recruiter, HM, Interviewer). |
| Integration | Các API cốt lõi (POST /api/applications, POST /api/offers/confirm); Giao tiếp AI Orchestrator service; Xác thực token Explicit Confirmation; Ghi nhận Audit Log khi thao tác DB. |
| E2E | Admin tạo Job → Candidate nộp CV → Recruiter Screen Pass → Lên lịch phỏng vấn → Điền Scorecard → HM xác nhận Offer; Kịch bản hệ thống AI bị lỗi mạng (Fallback thủ công). |
| Non-functional | Thời gian phản hồi AI ≤ 5 giây; Luồng điều hướng bằng bàn phím (Keyboard flow); Không lưu dữ liệu ứng viên nhạy cảm; Tính toàn vẹn của Audit Log. |

# 8 TEST CASES MẪU CHO US-ATS-05

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Gọi API sinh điểm với đủ dữ liệu JD và CV hợp lệ | US-ATS-05 AC1 | Trả về match_score (0-100), kèm mảng matched_skills, missing_skills và explanation | Automated |
| TC-02 | Xử lý khi AI Service bị lỗi hoặc timeout | US-ATS-05 AC2 | Trả về Error, không sinh điểm ảo (fabricated score), màn hình vẫn cho phép xem CV gốc | Automated |
| TC-03 | Khung CV thiếu dữ liệu bắt buộc để đối chiếu | US-ATS-05 AC4 | Trả về trạng thái INSUFFICIENT_DATA và từ chối suy đoán điểm | Automated |
| TC-04 | Hiển thị nhãn cảnh báo (Advisory Label) trên giao diện | BR-ATS-02 | UI hiển thị nhãn khẳng định đây chỉ là "AI Suggestion", không kích hoạt tự động trạng thái Pass/Reject | Manual/E2E |
| TC-05 | Truy cập trái phép API sinh điểm bằng quyền Candidate | REQ-ATS-12 | Backend từ chối request, trả về HTTP 403 Forbidden, không expose dữ liệu MatchResult | Automated |
| TC-06 | Tính năng append-only khi ghi nhận kết quả AI | Output #17 | Hệ thống tạo bản ghi mới trong MatchResult thay vì ghi đè, và cập nhật latest_match_result_id vào Application | Automated |
| TC-07 | Đảm bảo thời gian phản hồi theo chuẩn NFR | NFR-ATS-01 | Thời gian trả kết quả Match Score hoàn thiện ≤ 5 giây | Automated |
| TC-08 | Chặn rò rỉ dữ liệu nhạy cảm qua API hoặc Log | Output #22 | Hệ thống chỉ log applicationId, jobId và score status; tuyệt đối không log nội dung CV nhạy cảm | Automated |
