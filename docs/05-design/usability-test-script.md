# Kịch Bản Thử Nghiệm Độ Khả Dụng (Usability Test Script) — Smart Recruitment ATS

**Phiên bản (Version):** 1.2 (Chuẩn hóa đồng bộ 100% với hệ thống thực tế HireFlow AI)  
**Cập nhật lần cuối (Last updated):** 2026-10-16  
**Người phụ trách (Owner):** UX/UI & Engineering  
**Môi trường thử nghiệm:** Trình duyệt Google Chrome trên Desktop, chạy ứng dụng Next.js thực tế kết nối API Backend.  

---

## 1. Lời Dẫn Nhập Dành Cho Người Tham Gia (Introduction)

*(Người điều phối đọc to, rõ ràng và truyền cảm trước khi bắt đầu phiên thử nghiệm)*

> "Xin chào bạn, cảm ơn bạn đã tham gia phiên thử nghiệm hệ thống tuyển dụng HireFlow AI ngày hôm nay.
>
> Chúng tôi đang kiểm tra mức độ tiện dụng và tính hợp lý của giao diện phần mềm — hoàn toàn không đánh giá hay kiểm tra năng lực cá nhân của bạn, nên ở đây không có câu trả lời nào là 'đúng' hay 'sai'.
>
> Trong suốt quá trình thực hiện, xin vui lòng **suy nghĩ thành tiếng (Think-aloud)** — hãy nói ra bất kỳ điều gì bạn đang nhìn thấy, băn khoăn hoặc cảm thấy khó thao tác. Chúng tôi sẽ đóng vai trò quan sát viên để ghi nhận và hoàn thiện phần mềm."

---

## 2. Các Tác Vụ Thử Nghiệm Cụ Thể (Actual Test Tasks)

---

### Tác Vụ 1 (Task 1) — Xem Và Đánh Giá Hồ Sơ Ứng Viên Trên Giao Diện Chia Đôi

- **Màn hình thực hiện:** `/cv-review`
- **Vai trò đóng giả:** Lan – Chuyên viên tuyển dụng (`RECRUITER`)
- **Kịch bản đọc:**
  > *"Bạn hãy truy cập vào màn hình Duyệt hồ sơ (`/cv-review`), chọn ứng viên đang chờ duyệt ở trạng thái `NEW`. Hãy xem nội dung CV gốc ở cột bên trái và đối chiếu với kết quả phân tích AI Match Score cùng các kỹ năng có / thiếu ở cột bên phải."*
- **Tiêu chí thành công:**
  - [ ] Người dùng xem được tài liệu CV trong khung bên trái.
  - [ ] Người dùng thử bấm nút *"✨ Tóm tắt CV (AI)"* để xem các chip kỹ năng và kinh nghiệm trích xuất.
  - [ ] Người dùng đọc hiểu điểm số Match Score và dòng giải thích số lượng từ khóa trùng khớp.

---

### Tác Vụ 2 (Task 2) — Xác Nhận Pass / Reject Có Kiểm Soát

- **Màn hình thực hiện:** `/cv-review`
- **Vai trò đóng giả:** Lan – Chuyên viên tuyển dụng (`RECRUITER`)
- **Kịch bản đọc:**
  > *"Sau khi xem xét kỹ lưỡng hồ sơ, hãy thực hiện thao tác quyết định: Nếu đạt hãy bấm nút 'Đạt (Pass)', nếu không đạt hãy thử bấm nút 'Từ chối (Reject)'."*
- **Tiêu chí thành công:**
  - [ ] Khi bấm Từ chối: Hộp thoại Modal cảnh báo ghi nhận Audit Log xuất hiện, người dùng đọc nội dung trước khi bấm Xác nhận.
  - [ ] Khi bấm Đạt: Trạng thái cập nhật thành `SCREENING_PASSED` và hệ thống tự động điều hướng sang màn hình `/schedule-interview`.

---

### Tác Vụ 3 (Task 3) — Điền Phiếu Đánh Giá Scorecard Thang Điểm 1 - 10

- **Màn hình thực hiện:** `/my-interviews` → `/scorecard?interviewId=:id`
- **Vai trò đóng giả:** Mai – Phỏng vấn viên chuyên môn (`INTERVIEWER`)
- **Kịch bản đọc:**
  > *"Bạn vừa phỏng vấn xong một ứng viên. Hãy vào danh sách lịch phỏng vấn của bạn (`/my-interviews`), chọn ứng viên và bấm 'Vào chấm điểm (Scorecard)'. Tại màn hình chia đôi, hãy đối chiếu CV bên trái và nhập Điểm chuyên môn (thang điểm 1 - 10) cùng Ghi chú nhận xét ở bên phải rồi nộp phiếu đánh giá."*
- **Tiêu chí thành công:**
  - [ ] Người dùng nhận biết hệ thống khóa nút nếu ca phỏng vấn chưa đến giờ (`scheduledAt > now`).
  - [ ] Người dùng nhập điểm số hợp lệ từ 1 đến 10 và nhập ghi chú nhận xét.
  - [ ] Người dùng bấm nút *"Lưu đánh giá (Submit)"* và nhận được Hộp thoại thông báo thành công.

---

### Tác Vụ 4 (Task 4) — Soạn Thảo & Phê Duyệt Offer Bằng Token Xác Nhận

- **Màn hình thực hiện:** `/scorecard-summary` → `/offer-approval?applicationId=:id`
- **Vai trò đóng giả:** Huy – Quản lý tuyển dụng (`HIRING_MANAGER`)
- **Kịch bản đọc:**
  > *"Tại bảng tổng hợp điểm (`/scorecard-summary`), hãy chọn ứng viên đã hoàn thành đánh giá, bấm 'Tạo Offer'. Nhập mức lương đề xuất và thực hiện bước xác nhận chính thức."*
- **Tiêu chí thành công:**
  - [ ] Người dùng tạo được bản nháp Offer (`DRAFT`).
  - [ ] Khi bấm *"Xác nhận Offer"*, Modal Human Confirmation yêu cầu gõ chữ: `XAC NHAN`.
  - [ ] Người dùng gõ đúng từ khóa `XAC NHAN` để kích hoạt nút chốt Offer và gửi xác thực lên Backend.
