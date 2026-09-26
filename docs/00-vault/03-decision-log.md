# Quyết định dự án (Decision Log)

| Ngày | Quyết định | Lý do |
| --- | --- | --- |
| 24/08/2026 | Thống nhất **KHÔNG** tạo bảng `Position` và `Position Details` trong Database. Chức danh công việc sẽ được lưu trực tiếp thành các field trong bảng `Job Posting`. | Giảm tải cho Backend. (Nguồn: Đề xuất từ QA/Engineering). |
| 25/08/2026 | Hủy bỏ tính năng **Tự động gửi Email Offer** và đưa vào **Out of Scope**. MVP chỉ sử dụng Demo Data. | Giới hạn phạm vi MVP, tập trung vào các chức năng cốt lõi. |
| 15/09/2026 | Freeze scope Bài cuối: **Must = US-ATS-01, 02, 05, 06, 07, 08, 09, 10, 11, 13, 14 (11 stories); Should = US-ATS-03, 04, 12 (3 stories)**. | Nhóm còn 4 người, ưu tiên workflow chính **Job → Offer/Reject** và AI feature lõi **Match Score** chạy chắc chắn thay vì làm dở dang nhiều stories. |
