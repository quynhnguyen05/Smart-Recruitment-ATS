# Output #26 - Test Strategy 

| Layer | Coverage cho toàn dự án (MVP) |
| :--- | :--- |
| Unit | Trình xác thực lược đồ AI (CV Parser, Match Score schema); Validate định dạng file CV (PDF/DOCX); Rule chuyển đổi trạng thái (State machine); Helpers phân quyền RBAC (Admin, Recruiter, HM, Interviewer). |
| Integration | Các API cốt lõi (POST /api/applications, POST /api/offers/confirm); Giao tiếp AI Orchestrator service; Xác thực token Explicit Confirmation; Ghi nhận Audit Log khi thao tác DB. |
| E2E | Admin tạo Job → Candidate nộp CV → Recruiter Screen Pass → Lên lịch phỏng vấn → Điền Scorecard → HM xác nhận Offer; Kịch bản hệ thống AI bị lỗi mạng (Fallback thủ công). |
| Non-functional | Thời gian phản hồi AI ≤ 5 giây; Luồng điều hướng bằng bàn phím (Keyboard flow); Không lưu dữ liệu ứng viên nhạy cảm; Tính toàn vẹn của Audit Log. |
