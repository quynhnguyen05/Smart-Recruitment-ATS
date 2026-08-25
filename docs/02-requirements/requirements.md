## Requirement Inventory

### Functional & Non-Functional Requirements

| ID | Loại | Yêu cầu | Priority |
|---|---|---|---|
| **REQ-ATS-01** | FR | Admin/Recruiter tạo và publish Job Posting với JD, requirements và trạng thái. | **Must** |
| **REQ-ATS-02** | FR | Candidate xem danh sách Job và nộp CV (Apply) vào một Job cụ thể. | **Must** |
| **REQ-ATS-03** | FR | Hệ thống parse CV thành dữ liệu có cấu trúc, gồm kỹ năng, kinh nghiệm và học vấn. | **Must** |
| **REQ-ATS-04** | FR | AI sinh **CV Summary** cho Recruiter tham khảo trong quá trình Screening. | **Must** |
| **REQ-ATS-05** | FR | AI tính **Match Score** giữa CV và JD kèm lý do, bao gồm **Matched Skills** và **Gaps**. | **Must** |
| **REQ-ATS-06** | FR | Recruiter xem CV Summary + Match Score và quyết định **Screen Pass/Reject**; AI không được tự quyết định. | **Must** |
| **REQ-ATS-07** | FR | Recruiter/Interviewer lên lịch **Interview Round** cho Application đã Pass Screening. | **Must** |
| **REQ-ATS-08** | FR | AI gợi ý bộ câu hỏi phỏng vấn dựa trên JD + CV; Interviewer có thể sửa hoặc loại bỏ câu hỏi. | **Must** |
| **REQ-ATS-09** | FR | Interviewer điền **Scorecard** sau phỏng vấn, gồm tiêu chí, điểm số và ghi chú. | **Must** |
| **REQ-ATS-10** | FR | Hiring Manager xem tổng hợp Scorecard từ các vòng phỏng vấn và ra quyết định **Offer/Reject**. | **Must** |
| **REQ-ATS-11** | FR | Hệ thống chỉ tạo **Official Offer** sau khi Hiring Manager thực hiện **Explicit Confirmation**. | **Must** |
| **REQ-ATS-12** | FR | Candidate xem được trạng thái **Recruitment Pipeline** hiện tại của Application của mình. | **Must** |
| **REQ-ATS-13** | FR | Admin quản lý **User, Role và Access Permission**. | **Should** |
| **NFR-ATS-01** | NFR | Match Score/CV Summary trả về trong thời gian hợp lý ở môi trường Demo, ví dụ **≤5 giây**. | **Should** |
| **NFR-ATS-02** | NFR | Dữ liệu CV và thông tin cá nhân của Candidate chỉ được truy cập bởi User có Role phù hợp. | **Must** |
| **NFR-ATS-03** | NFR | Mọi hành động quan trọng làm thay đổi trạng thái Application phải được ghi nhận trong **Audit Log**. | **Must** |
| **NFR-ATS-04** | NFR | UI hỗ trợ điều hướng bằng bàn phím cho các Form quan trọng như Screening, Scorecard và Offer. | **Should** |
| **NFR-ATS-05** | NFR | AI Feature có **Fallback**; nếu AI Service lỗi, các luồng Screening/Scheduling vẫn có thể được thực hiện thủ công. | **Must** |

### Business Rules

| ID | Loại | Rule |
|---|---|---|
| **BR-ATS-01** | BR | AI không được tự động thay đổi trạng thái Application (**Pass/Reject/Offer**); chỉ User có quyền mới được xác nhận. |
| **BR-ATS-02** | BR | Match Score/CV Summary luôn phải kèm nguồn dữ liệu từ **CV/JD** để giải thích cơ sở của kết luận. |
| **BR-ATS-03** | BR | Offer chỉ được tạo sau khi có ít nhất một **Scorecard hoàn chỉnh** và Hiring Manager thực hiện **Explicit Confirmation**. |
| **BR-ATS-04** | BR | Thông tin về chức danh (**Job Title**) và chi tiết vị trí phải được lưu trữ trực tiếp trong bảng **Job Posting**. Không tạo các bảng độc lập như `Position` hoặc `Position Details`. |

### Assumptions

| ID | Loại | Assumption |
|---|---|---|
| **ASM-ATS-01** | ASM | MVP sử dụng dữ liệu CV/Job mẫu (**Demo Data**) và không tích hợp Email thật để gửi Offer. |

### Open Questions

| ID | Loại | Question / Decision Needed |
|---|---|---|
| **Q-ATS-01** | Q | Có cho phép nhiều Interviewer cùng chấm Scorecard trong một Interview Round hay không? → Cần xác nhận với giảng viên/nhóm. |

