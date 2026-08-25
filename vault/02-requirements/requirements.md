| ID | Loại | Yêu cầu | Priority |
|---|---|---|---|
| **REQ-ATS-01** | FR | Admin/Recruiter tạo và publish Job Posting với JD, requirement, trạng thái. | Must |
| **REQ-ATS-02** | FR | Candidate xem danh sách Job và nộp CV (Apply) vào một Job cụ thể. | Must |
| **REQ-ATS-03** | FR | Hệ thống parse CV thành dữ liệu có cấu trúc gồm kỹ năng, kinh nghiệm và học vấn. | Must |
| **REQ-ATS-04** | FR | AI sinh CV Summary cho Recruiter tham khảo khi Screening. | Must |
| **REQ-ATS-05** | FR | AI tính Match Score giữa CV và JD kèm lý do, gồm Matched Skills và Gaps. | Must |
| **REQ-ATS-06** | FR | Recruiter xem CV Summary + Match Score và quyết định Screen Pass/Reject; AI không được tự quyết định. | Must |
| **REQ-ATS-07** | FR | Recruiter/Interviewer lên lịch Interview Round cho Application đã Pass Screening. | Must |
| **REQ-ATS-08** | FR | AI gợi ý bộ câu hỏi phỏng vấn dựa trên JD + CV; Interviewer có thể sửa hoặc bỏ câu hỏi. | Must |
| **REQ-ATS-09** | FR | Interviewer điền Scorecard sau phỏng vấn gồm tiêu chí, điểm và ghi chú. | Must |
| **REQ-ATS-10** | FR | Hiring Manager xem tổng hợp Scorecard các vòng và ra quyết định Offer/Reject. | Must |
| **REQ-ATS-11** | FR | Hệ thống tạo Offer chính thức chỉ sau khi Hiring Manager thực hiện Explicit Confirmation. | Must |
| **REQ-ATS-12** | FR | Candidate xem được trạng thái Pipeline hiện tại của Application của mình. | Must |
| **REQ-ATS-13** | FR | Admin quản lý User, Role và phân quyền truy cập. | Should |
| **NFR-ATS-01** | NFR | Match Score/CV Summary trả về trong thời gian hợp lý ở môi trường Demo, ví dụ ≤5 giây. | Should |
| **NFR-ATS-02** | NFR | Dữ liệu CV và thông tin cá nhân ứng viên chỉ được truy cập theo Role liên quan. | Must |
| **NFR-ATS-03** | NFR | Mọi hành động thay đổi trạng thái Application quan trọng phải có Audit Log. | Must |
| **NFR-ATS-04** | NFR | UI hỗ trợ điều hướng bằng bàn phím cho các Form quan trọng như Screening, Scorecard và Offer. | Should |
| **NFR-ATS-05** | NFR | AI Feature có Fallback; nếu AI Service lỗi, luồng Screening/Scheduling vẫn có thể thao tác thủ công. | Must |
| **BR-ATS-01** | BR | AI không được tự động thay đổi trạng thái Application (Pass/Reject/Offer); chỉ người dùng có quyền mới được xác nhận. | — |
| **BR-ATS-02** | BR | Match Score/CV Summary luôn kèm nguồn dữ liệu từ CV/JD để giải thích cơ sở của kết luận. | — |
| **BR-ATS-03** | BR | Offer chỉ được tạo sau khi có ít nhất một Scorecard hoàn chỉnh và Hiring Manager thực hiện xác nhận. | — |
| **BR-ATS-04** | BR | Thông tin về chức danh (Job Title) và chi tiết vị trí phải được lưu trữ trực tiếp vào bảng Job Posting. Nghiêm cấm tạo các bảng độc lập như Position, Position Details. | — |
| **ASM-ATS-01** | ASM | MVP sử dụng dữ liệu CV/Job mẫu (Demo Data), không tích hợp Email thật để gửi Offer. | — |
| **Q-ATS-01** | Q | Có cho phép nhiều Interviewer cùng chấm Scorecard trong một Interview Round hay không? → Cần xác nhận với giảng viên/nhóm. | — |
