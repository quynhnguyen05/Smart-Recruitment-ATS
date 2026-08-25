# Prototype Brief: Smart Recruitment & ATS

## 1. Mục tiêu của Prototype (Goals)
Bản prototype này được thiết kế để trực quan hóa và kiểm thử tính khả dụng (Usability) của MVP, đặc biệt tập trung vào sự tương tác giữa người dùng và các tính năng AI. Mục tiêu cụ thể gồm:
*   Kiểm tra xem Recruiter có dễ dàng đọc hiểu và tin tưởng **Match Score / CV Summary** của AI (thông qua việc hiển thị minh bạch lý do/bằng chứng) hay không.
*   Xác minh tính khả dụng của luồng **Human Confirmation** (Quyết định do con người đưa ra cuối cùng) để đảm bảo AI không tự động thay đổi trạng thái.
*   Đảm bảo luồng gợi ý câu hỏi phỏng vấn của AI có thể dễ dàng được Interviewer tinh chỉnh.

## 2. Bối cảnh sử dụng (Context of Use)
*   **Môi trường:** Web App (Desktop) - tối ưu cho màn hình làm việc văn phòng vì Recruiter và Interviewer thường làm việc trên máy tính.
*   **Persona mục tiêu:**
    *   *Recruiter (Lan):* Đang đối mặt với hàng chục CV mới nộp cho vị trí Developer, cần công cụ lọc nhanh nhưng sợ AI bỏ sót người tài.
    *   *Interviewer (Mai):* Sắp có buổi phỏng vấn trong 30 phút, cần chuẩn bị câu hỏi bám sát JD và xem nhanh kinh nghiệm của ứng viên.

## 3. Các luồng thiết kế chính (Key Flows)
Dựa trên MVP Scope, Prototype sẽ tập trung vào 2 luồng (flow) cốt lõi nhất:

### Flow 1: CV Screening (Dành cho Recruiter)
*   **Mô tả:** Luồng từ lúc xem danh sách ứng viên mới đến lúc ra quyết định Pass/Reject ở vòng lọc hồ sơ.
*   **Các bước:**
    1.  Vào Job Details > Tab Candidates (Pipeline: Applied).
    2.  Click vào một ứng viên để xem màn hình chi tiết (Side-by-side: Một bên là CV gốc, một bên là Panel đánh giá).
    3.  Xem AI CV Summary và AI Match Score (Bao gồm Matched Skills, Missing Skills, Match Reason).
    4.  Recruiter click nút "Pass to Interview" hoặc "Reject".
    5.  **Modal Human Confirmation** hiện ra yêu cầu xác nhận.
    6.  Xác nhận thành công -> Trạng thái ứng viên đổi sang "Screening Passed".

### Flow 2: Interview Prep & Scorecard (Dành cho Interviewer)
*   **Mô tả:** Luồng chuẩn bị câu hỏi dựa trên AI gợi ý và điền phiếu đánh giá sau phỏng vấn.
*   **Các bước:**
    1.  Vào trang Lịch phỏng vấn > Click vào ứng viên sắp phỏng vấn.
    2.  Hệ thống hiển thị Panel "AI Question Suggestions" (Dựa trên CV và JD).
    3.  Interviewer thao tác Thêm / Sửa / Xóa câu hỏi vào Scorecard nháp.
    4.  Thực hiện phỏng vấn và điền điểm số / nhận xét vào form Scorecard.
    5.  Bấm Submit Scorecard.

## 4. Các trạng thái giao diện bắt buộc (UI States)
Để đảm bảo trải nghiệm người dùng thực tế và đáp ứng tiêu chí đánh giá, Prototype sẽ thiết kế đủ 5 trạng thái sau cho các màn hình chính:
*   **Loading State:** Màn hình Skeleton hoặc Spinner khi AI đang parse CV hoặc đang generate câu hỏi phỏng vấn (Thời gian chờ dự kiến < 5s).
*   **Empty State:** Giao diện khi một Job chưa có ứng viên nào nộp (Chưa có data) hoặc Interviewer chưa có lịch phỏng vấn nào.
*   **Error State:** Thông báo lỗi thân thiện khi AI Service bị fail (không parse được file CV PDF do lỗi định dạng) -> Hiển thị Fallback cho phép Recruiter tự xem CV thủ công.
*   **Success State:** Toast notification hoặc màn hình báo thành công khi Submit Scorecard.
*   **Confirmation State:** Các Pop-up/Modal bắt buộc hỏi "Bạn có chắc chắn muốn Reject ứng viên này không?" để đáp ứng Business Rule (BR-ATS-01).
