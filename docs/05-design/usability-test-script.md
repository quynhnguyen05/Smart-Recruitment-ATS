# Kịch Bản Thử Nghiệm Độ Khả Dụng (Usability Test Script) — Smart Recruitment ATS

**Môi trường thử nghiệm:** Trình duyệt Google Chrome trên Desktop, chạy ứng dụng Next.js thực tế kết nối API Backend.  

---

## 1. Danh Sách Người Tham Gia Thử Nghiệm (Participants)

Phiên thử nghiệm độ khả dụng (Usability Testing) được chuẩn hóa và thực hiện xuyên suốt với đúng **3 người tham gia (P1, P2, P3)**, đại diện cho các nhóm đối tượng người dùng then chốt của hệ thống:

- **P1: Lan – Chuyên viên tuyển dụng kỳ cựu (Recruiter có kinh nghiệm ATS).**  
  - *Hồ sơ & Kinh nghiệm:* Hơn 2 năm kinh nghiệm thực tế sử dụng các phần mềm ATS chuyên nghiệp. Chú trọng tốc độ sàng lọc hàng loạt hồ sơ, tính minh bạch của các tiêu chí đánh giá, và sự an toàn khi ra các quyết định nhân sự (Pass/Reject).
- **P2: Mai – Chuyên viên tuyển dụng mới (Junior Recruiter).**  
  - *Hồ sơ & Kinh nghiệm:* Mới tham gia quy trình tuyển dụng và bước đầu làm quen với các công cụ ATS. Cần giao diện trực quan, rõ ràng, các giải thích của AI (Match Score, trích xuất kỹ năng) dễ hiểu và giảm thiểu rào cản học hỏi.
- **P3: Huy – Phỏng vấn viên chuyên môn kỹ thuật (Technical Interviewer).**  
  - *Hồ sơ & Kinh nghiệm:* Kỹ sư phần mềm tham gia các vòng phỏng vấn chuyên môn kỹ thuật. Chú trọng tính tiện lợi khi đối chiếu CV gốc với tiêu chí kỹ năng, mẫu phiếu đánh giá chi tiết theo Thang điểm 1 - 10 và không bị gián đoạn ngữ cảnh khi đang phỏng vấn.

---

## 2. Lời Dẫn Nhập Dành Cho Người Tham Gia (Introduction)

*(Người điều phối đọc to, rõ ràng và truyền cảm trước khi bắt đầu phiên thử nghiệm)*

> "Xin chào bạn, cảm ơn bạn đã tham gia phiên thử nghiệm hệ thống tuyển dụng HireFlow AI ngày hôm nay.
>
> Chúng tôi đang kiểm tra mức độ tiện dụng và tính hợp lý của giao diện phần mềm — hoàn toàn không đánh giá hay kiểm tra năng lực cá nhân của bạn, nên ở đây không có câu trả lời nào là 'đúng' hay 'sai'.
>
> Trong suốt quá trình thực hiện, xin vui lòng **suy nghĩ thành tiếng (Think-aloud)** — hãy nói ra bất kỳ điều gì bạn đang nhìn thấy, băn khoăn hoặc cảm thấy khó thao tác. Chúng tôi sẽ đóng vai trò quan sát viên để ghi nhận và hoàn thiện phần mềm."

---

## 3. Các Tác Vụ Thử Nghiệm Cụ Thể (Actual Test Tasks)

---

### Tác Vụ 1 (Task 1) — Xem Và Đánh Giá Hồ Sơ Ứng Viên Trên Giao Diện Chia Đôi

- **Màn hình thực hiện:** `/cv-review`
- **Vai trò trải nghiệm:** Chuyên viên tuyển dụng (`RECRUITER`)
- **Người tham gia thực hiện:**
  - **P1: Lan** (Kiểm tra tốc độ đọc hiểu, tính tiện dụng của bố cục chia đôi 60/40 so với các ATS truyền thống).
  - **P2: Mai** (Kiểm tra mức độ trực quan của tính năng AI Tóm tắt CV và dòng giải thích Match Score đối với nhân sự mới).
  - **P3: Huy** (Đánh giá khả năng hiển thị danh sách kỹ năng kỹ thuật từ góc nhìn phỏng vấn viên).
- **Kịch bản đọc:**
  > *"Bạn hãy truy cập vào màn hình Duyệt hồ sơ (`/cv-review`), chọn ứng viên đang chờ duyệt ở trạng thái `NEW`. Hãy xem nội dung CV gốc ở cột bên trái và đối chiếu với kết quả phân tích AI Match Score cùng các kỹ năng có / thiếu ở cột bên phải."*
- **Tiêu chí thành công:**
  - [ ] Người dùng xem được tài liệu CV trong khung bên trái.
  - [ ] Người dùng thử bấm nút *"✨ Tóm tắt CV (AI)"* để xem các chip kỹ năng và kinh nghiệm trích xuất.
  - [ ] Người dùng đọc hiểu điểm số Match Score và dòng giải thích số lượng từ khóa trùng khớp.

---

### Tác Vụ 2 (Task 2) — Xác Nhận Pass / Reject Có Kiểm Soát

- **Màn hình thực hiện:** `/cv-review`
- **Vai trò trải nghiệm:** Chuyên viên tuyển dụng (`RECRUITER`)
- **Người tham gia thực hiện:**
  - **P1: Lan** và **P2: Mai** (Trực tiếp thao tác quyết định trạng thái hồ sơ).
  - **P3: Huy** (Phối hợp kiểm tra tính minh bạch và bảo toàn của dữ liệu tuyển dụng).
- **Kịch bản đọc:**
  > *"Sau khi xem xét kỹ lưỡng hồ sơ, hãy thực hiện thao tác quyết định: Nếu đạt hãy bấm nút 'Đạt (Pass)', nếu không đạt hãy thử bấm nút 'Từ chối (Reject)'."*
- **Tiêu chí thành công:**
  - [ ] Khi bấm Từ chối: Hộp thoại Modal cảnh báo ghi nhận Audit Log xuất hiện, người dùng đọc nội dung trước khi bấm Xác nhận.
  - [ ] Khi bấm Đạt: Trạng thái cập nhật thành `SCREENING_PASSED` và hệ thống tự động điều hướng sang màn hình `/schedule-interview`.

---

### Tác Vụ 3 (Task 3) — Điền Phiếu Đánh Giá Scorecard Thang Điểm 1 - 10

- **Màn hình thực hiện:** `/my-interviews` → `/scorecard?interviewId=:id`
- **Vai trò trải nghiệm:** Phỏng vấn viên chuyên môn kỹ thuật (`INTERVIEWER`)
- **Người tham gia thực hiện:**
  - **P3: Huy – Phỏng vấn viên chuyên môn kỹ thuật (Technical Interviewer)** (Người dùng trọng tâm: trải nghiệm trực tiếp việc vừa nhìn CV gốc bên trái vừa chấm Điểm chuyên môn thang điểm 1 - 10 và nhập nhận xét chi tiết bên phải).
  - **P1: Lan** và **P2: Mai** (Thử nghiệm chéo để đánh giá tính chuẩn hóa và tính dễ hiểu của mẫu phiếu đánh giá giữa bộ phận tuyển dụng và kỹ thuật).
- **Kịch bản đọc:**
  > *"Bạn vừa phỏng vấn xong một ứng viên. Hãy vào danh sách lịch phỏng vấn của bạn (`/my-interviews`), chọn ứng viên và bấm 'Vào chấm điểm (Scorecard)'. Tại màn hình chia đôi, hãy đối chiếu CV bên trái và nhập Điểm chuyên môn (thang điểm 1 - 10) cùng Ghi chú nhận xét ở bên phải rồi nộp phiếu đánh giá."*
- **Tiêu chí thành công:**
  - [ ] Người dùng nhận biết hệ thống khóa nút submit nếu ca phỏng vấn chưa đến giờ (`scheduledAt > now`).
  - [ ] Người dùng nhập điểm số hợp lệ từ 1 đến 10 và nhập ghi chú nhận xét.
  - [ ] Người dùng bấm nút *"Lưu đánh giá (Submit)"* và nhận được Hộp thoại thông báo thành công.

---

### Tác Vụ 4 (Task 4) — Soạn Thảo & Phê Duyệt Offer Bằng Token Xác Nhận

- **Màn hình thực hiện:** `/scorecard-summary` → `/offer-approval?applicationId=:id`
- **Vai trò trải nghiệm:** Quản trị & Phê duyệt tuyển dụng (`HIRING_MANAGER` / `RECRUITER`)
- **Người tham gia thực hiện:**
  - **P1: Lan – Chuyên viên tuyển dụng kỳ cựu (Recruiter có kinh nghiệm ATS)** (Đóng vai trò Lead phụ trách quy trình chốt Offer từ bảng tổng hợp điểm).
  - **P2: Mai** và **P3: Huy** (Cùng thử nghiệm cơ chế an toàn bắt buộc gõ cụm từ token `XAC NHAN` trong Modal cảnh báo viền đỏ để kiểm tra khả năng chống click nhầm).
- **Kịch bản đọc:**
  > *"Tại bảng tổng hợp điểm (`/scorecard-summary`), hãy chọn ứng viên đã hoàn thành đánh giá, bấm 'Tạo Offer'. Nhập mức lương đề xuất và thực hiện bước xác nhận chính thức."*
- **Tiêu chí thành công:**
  - [ ] Người dùng tạo được bản nháp Offer (`DRAFT`).
  - [ ] Khi bấm *"Xác nhận Offer"*, Modal Human Confirmation yêu cầu gõ chữ: `XAC NHAN`.
  - [ ] Người dùng gõ đúng từ khóa `XAC NHAN` để kích hoạt nút chốt Offer và gửi xác thực lên Backend.

---

### Tác Vụ 5 (Task 5) — Xử Lý Tệp Không Trích Xuất Được Chữ & Dự Phòng Lỗi AI (Fallback)

- **Màn hình thực hiện:** `/cv-review`
- **Vai trò trải nghiệm:** Toàn bộ người dùng (`RECRUITER` / `INTERVIEWER`)
- **Người tham gia thực hiện:** Cả **P1: Lan**, **P2: Mai**, **P3: Huy** cùng thử nghiệm tình huống ứng viên nộp tệp DOCX hoặc PDF dạng ảnh quét không trích xuất được văn bản, hoặc khi dịch vụ AI gặp sự cố gián đoạn (503).
- **Kịch bản đọc:**
  > *"Bạn hãy mở một hồ sơ ứng viên nộp file DOCX hoặc file PDF dạng ảnh quét mà hệ thống AI không thể tự động trích xuất chữ. Hãy quan sát cách hệ thống phản hồi và thực hiện quy trình đánh giá thủ công."*
- **Tiêu chí thành công:**
  - [ ] Thẻ Match Score hiển thị trạng thái `N/A` cùng dòng thông báo minh bạch: *"Chưa thể trích xuất nội dung text từ CV DOCX hoặc CV không có text. Không tự động chấm điểm."*
  - [ ] Người dùng vẫn xem được tệp CV gốc trong khung bên trái.
  - [ ] Cặp nút Pass / Reject vẫn hoàn toàn khả dụng để người dùng đưa ra quyết định tuyển dụng thủ công mà không bị chặn luồng.
