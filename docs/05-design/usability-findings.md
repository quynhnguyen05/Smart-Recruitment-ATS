# Kết Quả Thử Nghiệm Độ Khả Dụng (Usability Findings) — Smart Recruitment ATS

**Người tham gia thử nghiệm (Participants):**  
- **P1: Lan** – Chuyên viên tuyển dụng kỳ cựu (Recruiter có kinh nghiệm ATS, hơn 2 năm thực tế sử dụng các phần mềm ATS).  
- **P2: Mai** – Chuyên viên tuyển dụng mới (Junior Recruiter).  
- **P3: Huy** – Phỏng vấn viên chuyên môn kỹ thuật (Technical Interviewer).  
**Hệ thống được kiểm thử:** Ứng dụng Next.js thực tế trên môi trường máy tính để bàn (Desktop Chrome).  

---

## 1. Bảng Tổng Hợp Tỷ Lệ Hoàn Thành Nhiệm Vụ (Task Completion Summary)

| Nhiệm vụ kiểm thử (Task) | Màn hình thực tế | P1 (Lan) | P2 (Mai) | P3 (Huy) | Tỷ lệ hoàn thành | Thời gian TB |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **T1: Xem CV và phân tích kỹ năng** | `/cv-review` | ✅ 75s | ⚠️ 110s | ✅ 68s | **2/3 độc lập** | 84s |
| **T2: Xác nhận Pass / Reject có kiểm soát** | `/cv-review` | ✅ 28s | ✅ 45s | ✅ 32s | **3/3 độc lập** | 35s |
| **T3: Điền Scorecard (thang điểm 1 - 10)** | `/my-interviews` → `/scorecard` | ✅ 95s | ⚠️ 120s | ✅ 88s | **2/3 độc lập** | 101s |
| **T4: Soạn thảo & Phê duyệt Offer bằng token xác nhận** | `/scorecard-summary` → `/offer-approval` | ✅ 38s | ⚠️ 52s | ✅ 42s | **2/3 độc lập** | 44s |
| **T5: Xử lý tệp không trích xuất được chữ & AI lỗi** | `/cv-review` | ✅ 12s | ✅ 25s | ✅ 18s | **3/3 độc lập** | 18s |

> **Chú thích ký hiệu:**  
> - ✅ **Hoàn thành độc lập:** Tự thao tác trơn tru mà không cần người điều phối gợi ý.  
> - ⚠️ **Hoàn thành có trợ giúp:** Cần người điều phối hướng dẫn nhẹ hoặc làm rõ ngữ cảnh.  

---

## 2. Các Phát Hiện Chi Tiết & Quyết Định Điều Chỉnh Thực Tế (Key Findings)

### Phát Hiện 1 — Xu Hướng Nhìn Vào Match Score Trước Tiên & Nhu Cầu Minh Bạch Dữ Liệu
- **Hiện tượng & Quan sát thực tế:**
  - Cả 3 người tham gia đều bị thu hút mắt vào con số phần trăm hiển thị trong thẻ AI Match Score trước khi đọc văn bản CV.
  - **P2 (Mai – Junior Recruiter):** Do mới làm quen với ATS, Mai có xu hướng đặt trọn niềm tin vào điểm số AI. Khi gặp ứng viên có Match Score thấp, Mai ban đầu ngập ngừng và định bấm Từ chối ngay mà chưa kiểm tra kỹ phần kinh nghiệm thực tế.
  - **P1 (Lan – Recruiter kỳ cựu)** và **P3 (Huy – Technical Interviewer):** Cả hai người đều có yêu cầu khắt khe: Hệ thống bắt buộc phải giải thích rõ ràng tại sao AI lại tính ra điểm số đó (những từ khóa nào khớp, những kỹ năng nào còn thiếu) để đối chiếu trực tiếp với CV gốc trước khi tin cậy kết quả.
- **Giải pháp thực tế đã làm trong code:**
  - Thẻ Match Score luôn đi kèm dòng diễn giải chi tiết số lượng từ khóa xuất hiện (ví dụ: *"X/Y từ khóa yêu cầu xuất hiện trong nội dung CV. Điểm chỉ là hỗ trợ quyết định, cần con người xác nhận."*).
  - Đặt khối phân tích kỹ năng có (`matchedSkills`) và kỹ năng còn thiếu (`missingSkills`) ngay bên cạnh thẻ điểm để người dùng đối chiếu tức thì.
  - Bổ sung nút bấm **"✨ Tóm tắt CV (AI)"** giúp trích xuất sâu các kỹ năng cốt lõi và kinh nghiệm thực chiến từ văn bản CV.

### Phát Hiện 2 — Tầm Quan Trọng Của Modal Cảnh Báo & Audit Log Cho Thao Tác Trọng Yếu
- **Hiện tượng & Quan sát thực tế:**
  - Người dùng có xu hướng thao tác nhanh khi sàng lọc hàng chục hồ sơ mỗi ngày, dẫn đến nguy cơ click nhầm các nút hành động mang tính bước ngoặt.
  - **P1 (Lan – Recruiter kỳ cựu):** Nhấn mạnh rằng trong quy trình nhân sự thực tế, việc bấm nhầm "Từ chối" hoặc "Gửi Offer" có thể gây hậu quả pháp lý hoặc làm mất ứng viên tiềm năng; hệ thống cần có cơ chế chốt chặn không thể vô tình bấm trúng.
  - **P2 (Mai – Junior Recruiter):** Trong lần thử nghiệm đầu tiên của Tác vụ 4 (Offer Approval), Mai suýt bấm nhầm nút gửi Offer khi chưa kiểm tra lại mức lương đề xuất.
- **Giải pháp thực tế đã làm trong code:**
  - **Đối với nút Từ chối (`Reject` trên `/cv-review`):** Bật Modal cảnh báo rõ *"Quyết định này sẽ được ghi vào Audit Log"*. Phía Backend khóa cứng quy tắc nghiệp vụ: Hồ sơ đã bị từ chối thì tuyệt đối không thể hoàn tác chuyển ngược lại trạng thái cũ.
  - **Đối với nút Chốt Offer (`Offer Approval` trên `/offer-approval`):** Bật Modal Human Confirmation viền đỏ, bắt buộc người dùng phải chủ động gõ chính xác cụm từ token **`XAC NHAN`** thì Backend mới chấp thuận cập nhật trạng thái `CONFIRMED`.

### Phát Hiện 3 — Hiệu Quả Của Bố Cục Chia Đôi Màn Hình 60/40 (Split-View Layout)
- **Hiện tượng & Quan sát thực tế:**
  - **P3 (Huy – Technical Interviewer):** Khi thực hiện Tác vụ 3 (Scorecard), Huy chia sẻ rằng việc bố cục chia đôi màn hình (60% hiển thị CV gốc bên trái, 40% hiển thị khối câu hỏi gợi ý và form chấm điểm bên phải) giúp phỏng vấn viên không phải mở tab mới hay chuyển đổi qua lại giữa các cửa sổ ứng dụng khi đang phỏng vấn trực tiếp.
  - **P1 (Lan – Recruiter kỳ cựu):** Đánh giá bố cục này trên `/cv-review` giúp tăng tốc độ sàng lọc lên khoảng 40% so với cách làm truyền thống phải tải file PDF về máy tính rồi mới mở form đánh giá riêng.
- **Giải pháp thực tế đã làm trong code:**
  - Triển khai cố định bố cục chia đôi 60/40 trên cả màn hình `/cv-review` và `/scorecard`.
  - Phân tách màu nền rõ rệt: Ngăn CV sử dụng nền xám nhạt với khung hiển thị tài liệu trắng, ngăn tác vụ bên phải sử dụng nền trắng với đường phân cách và đổ bóng nhẹ giúp người dùng tập trung cao độ khi đánh giá ứng viên.

### Phát Hiện 4 — Kiểm Soát Tính Toàn Vẹn Của Điểm Số Và Thời Gian Phỏng Vấn
- **Hiện tượng & Quan sát thực tế:**
  - **P3 (Huy – Technical Interviewer):** Phản ánh rằng thang điểm 1 - 5 có biên độ quá hẹp, rất khó để phân định chính xác giữa ứng viên mức Khá (Solid) và ứng viên Xuất sắc (Outstanding) trong các vòng phỏng vấn kỹ thuật chuyên sâu. Huy đề xuất thang điểm 1 - 10 để có độ phân giải đánh giá tốt hơn.
  - **P1 (Lan – Recruiter kỳ cựu):** Đề xuất cần ngăn chặn việc người chấm điểm vô tình nộp phiếu đánh giá khi buổi phỏng vấn thực tế còn chưa diễn ra (chấm điểm khống).
- **Giải pháp thực tế đã làm trong code:**
  - Chuẩn hóa **Thang điểm 1 - 10** (`Điểm chuyên môn (1 - 10)`), bắt buộc kèm ô ghi chú nhận xét chi tiết trước khi nộp.
  - Tự động kiểm tra thời gian ca phỏng vấn: Nếu `scheduledAt > now`, nút submit trên `/scorecard` bị khóa mờ (`disabled`) và hiển thị thông báo: *"Chưa đến thời gian phỏng vấn"*.
