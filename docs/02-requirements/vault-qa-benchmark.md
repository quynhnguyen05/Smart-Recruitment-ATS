# Vault Q&A Benchmark (Kiểm định chất lượng Vault & AI)
**Mục tiêu:** Kiểm tra khả năng AI truy xuất đúng tài liệu trong Vault, tuân thủ luật nghiệp vụ và từ chối bịa đặt thông tin.

| # | Phân loại | Câu hỏi đưa cho AI (Prompt) | Expected answer (Câu trả lời kỳ vọng) | Nguồn / Căn cứ | Kết quả |
|:--|:---|:---|:---|:---|:---|
| **1** | Fact | Thời gian phát triển dự kiến của MVP này là bao lâu? | 8-10 tuần. | Project Charter (Constraints) | *Pass* |
| **2** | Fact | Ai là người có quyền tạo và publish một Job Posting mới? | Admin hoặc Recruiter. | REQ-ATS-01 | *Pass* |
| **3** | Fact | Thời gian phản hồi kỳ vọng khi AI sinh CV Summary là bao lâu? | ≤ 5 giây ở môi trường Demo. | NFR-ATS-01 | *Pass* |
| **4** | Fact | Ứng viên (Candidate) có biết được hồ sơ của mình đang ở đâu không? | Có. Candidate xem được trạng thái Pipeline hiện tại của Application. | REQ-ATS-12 | *Pass* |
| **5** | Fact | Tính năng ký hợp đồng điện tử có nằm trong phiên bản này không? | Không, nó thuộc Out of Scope. | Project Charter (Out of scope) | *Pass* |
| **6** | Rule | AI tính Match Score 98%, nó có được tự động chuyển trạng thái ứng viên thành "Offer" không? | Không. AI không được tự đổi trạng thái, phải có explicit human confirmation từ người có quyền. | BR-ATS-01 / REQ-ATS-11 | *Pass* |
| **7** | Rule | Match Score do AI sinh ra dựa trên cái gì? Có cần giải thích không? | Dựa trên CV và JD. Bắt buộc phải kèm lý do (Matched Skills và Gaps). | REQ-ATS-05 / BR-ATS-02 | *Pass* |
| **8** | Rule | Ứng viên có được phép xem Scorecard (phiếu chấm điểm) của mình không? | Tuyệt đối không. Candidate không được xem điểm nội bộ. | BR-ATS-05 | *Pass* |
| **9** | Rule | Chức danh công việc (Job Title) được lưu trữ trong Database như thế nào? | Lưu trực tiếp vào bảng `Job Posting`. Cấm tạo bảng `Position` độc lập. | BR-ATS-04 / Decision Log | *Pass* |
| **10** | Rule | Interviewer có bắt buộc phải dùng nguyên xi bộ câu hỏi AI gợi ý không? | Không. Interviewer có quyền sửa hoặc bỏ câu hỏi. | REQ-ATS-08 | *Pass* |
| **11** | Edge-case | Nếu server AI bị sập, Recruiter có lên lịch phỏng vấn được nữa không? | Vẫn được. Có Fallback cho phép thao tác thủ công. | NFR-ATS-05 | *Pass* |
| **12** | Edge-case | Hiring Manager muốn gửi Offer cho ứng viên ngay lập tức mà chưa có ai phỏng vấn, có được không? | Không được. Offer chỉ được tạo sau khi có ít nhất MỘT Scorecard hoàn chỉnh. | BR-ATS-03 | *Pass* |
| **13** | Edge-case | AI gợi ý ứng viên này có kỹ năng "ReactJS" dù trong CV không hề ghi, có hợp lệ không? | Không hợp lệ. Gợi ý phải là "Grounded Suggestion", không tự bịa thông tin không có nguồn. | Glossary (Grounded Suggestion) | *Pass* |
| **14** | Edge-case | Ứng viên gửi CV, nhưng hệ thống báo lỗi Parse CV. Ứng viên này có bị loại luôn không? | KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định quy trình xử lý khi Parse CV thất bại. | Unknown / Edge-case | *Pass* |
| **15** | Unknown | Hệ thống hỗ trợ upload CV dung lượng tối đa là bao nhiêu MB? | KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định. | Unknown | *Pass* |
| **16** | Unknown | Gọi video phỏng vấn sẽ dùng Zoom hay Google Meet? | KHÔNG ĐỦ DỮ LIỆU. Chỉ biết là dùng link ngoài. | Unknown | *Pass* |
| **17** | Unknown | Có bao nhiêu trạng thái (Pipeline Stage) tất cả trong quy trình tuyển dụng? | KHÔNG ĐỦ DỮ LIỆU. Chưa có danh sách trạng thái cụ thể. | Unknown | *Pass* |
| **18** | Unknown | Mật khẩu của Admin cần bao nhiêu ký tự đặc biệt? | KHÔNG ĐỦ DỮ LIỆU. | Unknown | *Pass* |
| **19** | Unknown | Có cho phép nhiều Interviewer cùng chấm một Scorecard không? | Cần xác nhận thêm (Open Question). | Q-ATS-01 | *Pass* |
| **20** | Unknown | Giao diện hệ thống có hỗ trợ Tiếng Anh và Tiếng Việt không? | KHÔNG ĐỦ DỮ LIỆU. | Unknown | *Pass* |
