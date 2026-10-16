# Kết Quả Thử Nghiệm Độ Khả Dụng (Usability Findings) — Smart Recruitment ATS

**Version:** 1.2

**Last updated:** 2026-10-14  

**Owner:** UX/UI

**Người tham gia thử nghiệm (Participants):**  
- **P1:** Chuyên viên tuyển dụng kỳ cựu (Recruiter, 2 năm kinh nghiệm thực tế sử dụng các phần mềm ATS).  
- **P2:** Chuyên viên tuyển dụng mới (Junior Recruiter).  
- **P3:** Phỏng vấn viên chuyên môn kỹ thuật (Technical Interviewer).  
**Hệ thống được kiểm thử:** Ứng dụng Next.js thực tế trên môi trường máy tính để bàn (Desktop Chrome).  

---

## 1. Bảng Tổng Hợp Tỷ Lệ Hoàn Thành Nhiệm Vụ (Task Completion Summary)

| Nhiệm vụ kiểm thử (Task) | Màn hình thực tế | P1 | P2 | P3 | Tỷ lệ hoàn thành | Thời gian TB |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **T1: Xem CV và phân tích kỹ năng** | `/cv-review` | ✅ 75s | ⚠️ 110s | ✅ 68s | **2/3 độc lập** | 84s |
| **T2: Xác nhận Pass / Reject có kiểm soát** | `/cv-review` | ✅ 28s | ✅ 45s | ✅ 32s | **3/3 độc lập** | 35s |
| **T3: Điền Scorecard (thang điểm 1 - 10)** | `/my-interviews` → `/scorecard` | ✅ 95s | ⚠️ 120s | ✅ 88s | **2/3 độc lập** | 101s |
| **T4: Xử lý tệp không trích xuất được chữ & AI lỗi** | `/cv-review` | ✅ 12s | ✅ 25s | ✅ 18s | **3/3 độc lập** | 18s |

> **Chú thích ký hiệu:**  
> - ✅ **Hoàn thành độc lập:** Tự thao tác trơn tru mà không cần người điều phối gợi ý.  
> - ⚠️ **Hoàn thành có trợ giúp:** Cần người điều phối hướng dẫn nhẹ hoặc làm rõ ngữ cảnh.  

---

## 2. Các Phát Hiện Chi Tiết & Quyết Định Điều Chỉnh Thực Tế (Key Findings)

### Phát Hiện 1 — Xu Hướng Nhìn Vào Match Score Trước Tiên
- **Hiện tượng:** Cả 3 người tham gia đều bị thu hút mắt vào con số điểm phần trăm hiển thị trong thẻ AI Match Score trước khi đọc phân tích chi tiết.
- **Giải pháp thực tế đã làm trong code:** Thẻ Match Score luôn đi kèm dòng diễn giải chi tiết số lượng từ khóa xuất hiện (ví dụ: *"X/Y từ khóa yêu cầu xuất hiện trong nội dung CV. Điểm chỉ là hỗ trợ quyết định, cần con người xác nhận."*) và đặt khối phân tích kỹ năng có / thiếu ngay bên cạnh để người dùng đối chiếu. Nút "✨ Tóm tắt CV (AI)" giúp trích xuất sâu kinh nghiệm thực tế.

### Phát Hiện 2 — Tầm Quan Trọng Của Modal Xác Nhận & Audit Log
- **Hiện tượng:** Người dùng có xu hướng thao tác nhanh khi ra quyết định, do đó cần có cơ chế cảnh báo đủ mạnh để ngăn chặn các quyết định nhầm lẫn.
- **Giải pháp thực tế đã làm trong code:**
  - Đối với nút Từ chối (`Reject`): Bật Modal cảnh báo rõ *"Quyết định này sẽ được ghi vào Audit Log"*. Phía Backend khóa cứng quy tắc nghiệp vụ: Hồ sơ đã bị từ chối thì tuyệt đối không thể hoàn tác chuyển ngược lại.
  - Đối với nút Chốt Offer (`Offer Approval`): Bật Modal Human Confirmation bắt buộc người dùng phải gõ chính xác từ khóa token **`XAC NHAN`** thì Backend mới chấp thuận cập nhật trạng thái `CONFIRMED`.

### Phát Hiện 3 — Hiệu Quả Của Bố Cục Chia Đôi Màn Hình 60/40
- **Hiện tượng:** Việc chia đôi màn hình (60% hiển thị CV gốc bên trái, 40% hiển thị form chấm điểm hoặc phân tích bên phải) giúp phỏng vấn viên không phải mở tab mới trên trình duyệt.
- **Giải pháp thực tế đã làm trong code:** Triển khai cố định bố cục 60/40 trên cả `/cv-review` và `/scorecard`, phân tách màu nền xám nhạt và đổ bóng giúp người dùng tập trung cao độ khi đánh giá ứng viên.

### Phát Hiện 4 — Kiểm Soát Tính Toàn Vẹn Của Điểm Số Và Thời Gian Phỏng Vấn
- **Hiện tượng:** Phỏng vấn viên cần thang điểm đủ rộng để đánh giá chính xác độ chênh lệch năng lực của ứng viên, đồng thời cần ngăn chặn việc nhập điểm trước khi buổi phỏng vấn diễn ra.
- **Giải pháp thực tế đã làm trong code:**
  - Chuẩn hóa **thang điểm 1 - 10** (`Điểm chuyên môn (1 - 10)`), bắt buộc kèm ghi chú nhận xét.
  - Tự động kiểm tra thời gian phỏng vấn: Nếu `scheduledAt > now`, nút submit bị khóa và hiển thị chữ: *"Chưa đến thời gian phỏng vấn"*.
