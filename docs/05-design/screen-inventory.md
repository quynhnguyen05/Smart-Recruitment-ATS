# Bảng Kiểm Kê Màn Hình & Ma Trận Trạng Thái (Screen Inventory & State Matrix) — Smart Recruitment ATS

**Hệ thống thực tế:** Ứng dụng Quản trị Tuyển dụng Thông minh HireFlow AI  
---
> 💡 **Lưu ý:** Toàn bộ danh mục màn hình và ma trận trạng thái dưới đây đã tuân thủ tuyệt đối Thang điểm 1-10, giới hạn CV 5MB, cơ chế Token XAC NHAN / Audit Log và kiểm soát thời gian Scorecard (Xem chi tiết tại [decision-log-design.md](./decision-log-design.md)).

---

## 1. Sơ Đồ Luồng Di Chuyển Giữa Các Màn Hình Thực Tế (Actual Screen Flows)

### LUỒNG A — Sàng Lọc Hồ Sơ Ứng Viên (CV Screening Flow)
```text
[Bảng điều khiển Tuyển dụng: /dashboard]
  → Bấm thẻ "CV cần duyệt (SCREENING)" hoặc menu "Hồ sơ ứng viên / Duyệt hồ sơ"
  → [Màn hình Sàng lọc hồ sơ: /cv-review]
      → Chọn ứng viên từ danh sách Dropdown (lọc trạng thái NEW)
      → Giao diện chia đôi màn hình 60/40:
          - Cột trái (60%): Trình xem CV gốc (PDF iframe / TXT pre) + Nút "✨ Tóm tắt CV (AI)"
          - Cột phải (40%): AI Match Score (Điểm %) + Phân tích kỹ năng (Có / Thiếu) + Nút Pass/Reject
      → Bấm "Đạt (Pass)":
          - Cập nhật ApplicationStatus sang SCREENING_PASSED
          - Tự động chuyển hướng ngay sang màn hình Lên lịch phỏng vấn: /schedule-interview?applicationId=:id
      → Bấm "Từ chối (Reject)":
          - Bật [Hộp thoại xác nhận Từ chối: isRejectModalOpen]
          - Hiển thị cảnh báo: "Quyết định này sẽ được ghi vào Audit Log"
          - Bấm Xác nhận: Cập nhật status thành REJECTED (Backend chặn không cho hoàn tác)
```

### LUỒNG B — Phỏng Vấn & Đánh Giá Điểm (Interview & Scorecard Flow)
```text
[Menu Phỏng vấn & đánh giá: /my-interviews]
  → Hiển thị danh sách ca phỏng vấn được phân công (ngày giờ, email ứng viên, vị trí)
  → Bấm nút "Vào chấm điểm (Scorecard)"
  → [Màn hình Chấm điểm phỏng vấn: /scorecard?interviewId=:id]
      → Giao diện chia đôi màn hình 60/40:
          - Cột trái (60%): CV ứng viên đối chiếu trực tiếp
          - Cột phải (40%): AI Match Score + Khối ✨ AI Gợi ý câu hỏi + Form chấm điểm
      → Nhập "Điểm chuyên môn (thang điểm 1 - 10)" + "Ghi chú đánh giá"
      → Bấm nút "Lưu đánh giá (Submit)":
          - Gửi POST /api/interviews/:id/scorecard
          - Hiển thị Hộp thoại thông báo thành công: "Đã lưu đánh giá thành công!"
          - Bấm "Quay lại danh sách" → Điều hướng về /my-interviews
```

### LUỒNG C — Quản Lý Tuyển Dụng Xem Điểm & Phê Duyệt Offer (Hiring Manager Decision Flow)
```text
[Menu Phỏng vấn & đánh giá: /scorecard-summary]
  → Hiển thị Bảng tổng hợp điểm các ứng viên (Vòng 1, Vòng 2, Điểm trung bình)
  → Bấm nút "Tạo Offer" tại hàng ứng viên
  → [Màn hình Phê duyệt Offer: /offer-approval?applicationId=:id]
      → Xem thông tin ứng viên, vị trí và trạng thái hồ sơ
      → Nếu chưa có Offer: Nhập "Mức lương đề xuất" → Bấm "Tạo Offer nháp" (DRAFT)
      → Khi đã có Offer nháp: Bấm "Xác nhận Offer"
          → Bật [Hộp thoại Human Confirmation Modal]
          → Yêu cầu bắt buộc: Gõ chính xác cụm từ token "XAC NHAN"
          → Bấm nút "Chốt Offer": Gửi PATCH /api/offers/:id/confirm kèm { confirmationToken: 'XAC NHAN' }
          → Backend kiểm tra quyền HIRING_MANAGER, xác thực token và cập nhật status = CONFIRMED, ghi Audit Log
```

### LUỒNG D — Ứng Viên Nộp Hồ Sơ & Theo Dõi Tiến Trình (Candidate Flow)
```text
[Cổng việc làm: /jobs]
  → Xem danh sách các vị trí đang tuyển (trạng thái PUBLISHED / OPEN)
  → Bấm "Ứng tuyển ngay" tại vị trí mong muốn
  → [Biểu mẫu ứng tuyển: /apply?jobId=:id]
      → Nhập "Họ và tên", chọn Job, đính kèm tệp CV (Hỗ trợ PDF, DOCX, TXT; dung lượng tối đa 5MB)
      → Bấm "Nộp hồ sơ ứng tuyển" → Gửi POST /api/applications (Multipart FormData)
  → [Đơn ứng tuyển của tôi: /applications]
      → Hiển thị danh sách các đơn đã nộp kèm huy hiệu trạng thái chuẩn cơ sở dữ liệu:
          - NEW: "Đã nộp"
          - SCORED: "Đã chấm điểm"
          - SCREENING_PASSED: "Đạt vòng hồ sơ"
          - REJECTED: "Không phù hợp"
          - INTERVIEWING: "Đang phỏng vấn"
          - OFFERED: "Đã có offer"
```

### LUỒNG E — Quản Trị Hệ Thống & Tài Khoản (Admin Portal Flow)
```text
[Menu Offer & quản trị: /admin-users]
  → Bảng danh sách toàn bộ người dùng trong hệ thống (Email, Vai trò, Trạng thái hoạt động, Ngày tạo)
  → Bấm "+ Cấp quyền User mới"
      → Bật Modal tạo tài khoản: Nhập Email, Mật khẩu, Chọn Vai trò (ADMIN, RECRUITER, INTERVIEWER, HIRING_MANAGER)
      → Gửi POST /api/admin/users
  → Bấm nút "Vô hiệu hóa" tại hàng người dùng:
      → Hộp thoại xác nhận của trình duyệt: "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?"
      → Gửi PATCH /api/admin/users/:id với { disabled: true } (Cơ chế Soft-delete, bảo toàn Audit Log)
```

---

## 2. Bảng Kiểm Kê Toàn Bộ Màn Hình Hệ Thống Thực Tế (Actual Screen Inventory)

| Mã | Tên màn hình giao diện | Đường dẫn thực tế (Frontend Route) | Đối tượng sử dụng (Roles) | Thuộc luồng |
|:---|:---|:---|:---|:---:|
| **S01** | Danh sách việc làm tuyển dụng | `/jobs` | Tất cả vai trò (Public / Candidate / Recruiter) | D, A |
| **S02** | Xem chi tiết thông tin công việc | `/jobs` (Modal / Card mở rộng) | Ứng viên (Candidate) | D |
| **S03** | Biểu mẫu nộp hồ sơ ứng tuyển kèm CV | `/apply` hoặc `/apply?jobId=:id` | Ứng viên (Candidate) | D |
| **S04** | Bảng theo dõi đơn ứng tuyển cá nhân | `/applications` | Ứng viên (Candidate) | D |
| **S05** | Bảng điều khiển quản trị tổng quan | `/dashboard` | ADMIN, RECRUITER, HIRING_MANAGER | A, C, E |
| **S06** | Tạo tin tuyển dụng mới | `/create-job` | ADMIN, RECRUITER | A |
| **S07** | Màn hình Sàng lọc CV chia đôi (60/40) | `/cv-review` | ADMIN, RECRUITER | A |
| **S08** | Lên lịch phỏng vấn ứng viên | `/schedule-interview` | ADMIN, RECRUITER | A, B |
| **S09** | Bảng lịch phỏng vấn được phân công | `/my-interviews` | ADMIN, INTERVIEWER | B |
| **S10** | Màn hình Chấm điểm Scorecard chia đôi | `/scorecard` hoặc `/scorecard?interviewId=:id` | ADMIN, INTERVIEWER | B |
| **S11** | Bảng tổng hợp điểm các vòng phỏng vấn | `/scorecard-summary` | ADMIN, HIRING_MANAGER | C |
| **S12** | Màn hình Soạn thảo & Phê duyệt Offer | `/offer-approval` hoặc `/offer-approval?applicationId=:id` | ADMIN, HIRING_MANAGER | C |
| **S13** | Quản lý tài khoản người dùng & phân quyền | `/admin-users` | ADMIN | E |
| **M01** | **Hộp thoại xác nhận Từ chối hồ sơ (Reject Modal)** | Lớp phủ Modal trên `/cv-review` | ADMIN, RECRUITER | A |
| **M02** | **Hộp thoại xác nhận Offer (Token `XAC NHAN`)** | Lớp phủ Modal trên `/offer-approval` | ADMIN, HIRING_MANAGER | C |
| **M03** | **Hộp thoại hoàn tất nộp điểm Scorecard** | Lớp phủ Modal trên `/scorecard` | ADMIN, INTERVIEWER | B |
| **M04** | **Hộp thoại cấp quyền người dùng mới** | Lớp phủ Modal trên `/admin-users` | ADMIN | E |

---

## 3. Ma Trận Trạng Thái Giao Diện Bắt Buộc (State Matrix)

### S07 — Màn Hình Sàng Lọc Hồ Sơ CV (Screening View: `/cv-review`)

| Trạng thái (State) | Tác nhân kích hoạt (Trigger) | Biểu hiện trên giao diện người dùng thực tế (UI Implementation) |
|:---|:---|:---|
| `loading` | Khi đang tải danh sách đơn hoặc đang tải tệp CV | Hiển thị thông báo *"Đang tải danh sách đơn..."* hoặc *"Đang tải CV..."*. |
| `success` | Dữ liệu CV và kết quả đối chiếu AI tải xong | Cột trái (60%): Xem CV (PDF iframe hoặc văn bản thô) + Nút "✨ Tóm tắt CV (AI)".<br>Cột phải (40%): AI Match Score (Điểm %) + Danh sách kỹ năng có & cần hỏi thêm + Nút Pass/Reject. |
| `summary-mode` | Bấm nút "✨ Tóm tắt CV (AI)" | Cột trái chuyển đổi hiển thị: Khung thông tin AI trích xuất kỹ năng cốt lõi (Skills chips) và kinh nghiệm làm việc (Experience list). Nút đổi thành *"Hoàn tác (Xem CV Gốc)"*. |
| `insufficient-data` | Tệp CV là DOCX hoặc không trích xuất được chữ | AI Match Score hiển thị `N/A`, giải thích: *"Chưa thể trích xuất nội dung text từ CV DOCX hoặc CV không có text. Không tự động chấm điểm."* |
| `ai-error / fallback` | Dịch vụ AI gián đoạn (mã 503 hoặc simulateError) | Hiển thị khung thông báo màu đỏ: *"Lỗi kết nối tới AI Service / Dịch vụ AI đang gián đoạn"*. Người dùng vẫn xem CV gốc và ra quyết định thủ công. |
| `reject-confirm` | Bấm nút "Từ chối (Reject)" | Bật mở Modal M01: Tiêu đề đỏ *"Xác nhận Từ chối"*, cảnh báo ghi Audit Log, cặp nút Hủy / Xác nhận. |
| `pass-advance` | Bấm nút "Đạt (Pass)" | Cập nhật `SCREENING_PASSED`, tự động chuyển hướng sang `/schedule-interview?applicationId=:id`. |

---

### S10 — Màn Hình Chấm Điểm Phỏng Vấn (Scorecard View: `/scorecard`)

| Trạng thái (State) | Tác nhân kích hoạt (Trigger) | Biểu hiện trên giao diện người dùng thực tế (UI Implementation) |
|:---|:---|:---|
| `no-interview-selected` | Truy cập `/scorecard` mà không có tham số `interviewId` | Hiển thị thẻ card thông báo *"Chưa chọn lịch phỏng vấn"* kèm nút *"Đến Lịch phỏng vấn của tôi"*. |
| `loading` | Đang tải dữ liệu ca phỏng vấn và CV | Hiển thị thông điệp chờ tải trên cả hai ngăn. |
| `ready` | Tải dữ liệu thành công | Cột trái (60%): CV ứng viên.<br>Cột phải (40%): AI Match Score + Khối ✨ AI Gợi ý câu hỏi + Form nhập Điểm chuyên môn (1 - 10) và Ghi chú. |
| `future-interview` | Ca phỏng vấn có thời gian trong tương lai (`scheduledAt > now`) | Nút submit bị khóa mờ (`disabled`), hiển thị chữ: *"Chưa đến thời gian phỏng vấn"* để ngăn chấm trước. |
| `submitting` | Người dùng bấm "Lưu đánh giá (Submit)" | Nút chuyển sang trạng thái *"Đang lưu..."*, vô hiệu hóa tương tác gửi lặp. |
| `submitted-success` | Máy chủ phản hồi mã thành công 200 | Bật mở Modal M03 có biểu tượng dấu tích xanh, thông báo: *"Đã lưu đánh giá thành công!"* kèm nút quay về danh sách. |

---

### S12 — Màn Hình Phê Duyệt Offer (Offer Approval: `/offer-approval`)

| Trạng thái (State) | Tác nhân kích hoạt (Trigger) | Biểu hiện trên giao diện người dùng thực tế (UI Implementation) |
|:---|:---|:---|
| `no-application-selected` | Truy cập mà thiếu tham số `applicationId` | Hiển thị thẻ thông báo: *"Chưa chọn ứng viên"* kèm nút *"Quay lại danh sách ứng viên"*. |
| `draft-creation` | Ứng viên chưa có bản ghi Offer nào trong cơ sở dữ liệu | Hiển thị ô nhập *"Mức lương đề xuất"* + Nút *"Tạo Offer nháp"*. |
| `draft-ready` | Đã có Offer nháp (trạng thái `DRAFT`) | Hiển thị mức lương đề xuất và trạng thái DRAFT. Nút *"Xác nhận Offer"* màu đỏ sẵn sàng mở modal. |
| `modal-token-input` | Bấm nút "Xác nhận Offer" | Bật Modal Human Confirmation: Ô nhập yêu cầu gõ chính xác chữ **"XAC NHAN"**. Nút *"Chốt Offer"* bị khóa mờ nếu gõ sai hoặc chưa gõ. |
| `confirmed` | Xác nhận thành công (Backend xác thực token và vai trò) | Trạng thái Offer chuyển thành `CONFIRMED`. Nút xác nhận bị vô hiệu hóa sang màu xám. |

---

## 4. Hệ Thống Trạng Thái Vòng Đời Tuyển Dụng Trong Cơ Sở Dữ Liệu (Application Lifecycle)

| Mã Enum Cơ sở dữ liệu | Nhãn hiển thị giao diện | Màu sắc | Diễn giải nghiệp vụ thực tế |
|:---|:---|:---:|:---|
| `NEW` | **Đã nộp** | Xanh dương nhạt | Ứng viên vừa nộp đơn qua form `/apply`, đang chờ Recruiter sàng lọc trên `/cv-review`. |
| `SCORED` | **Đã chấm điểm** | Tím nhạt | Hệ thống AI đã thực hiện phân tích và tính toán điểm đối chiếu từ khóa (Match Score). |
| `SCREENING_PASSED` | **Đạt vòng hồ sơ** | Xanh lá | Chuyên viên tuyển dụng đã bấm Pass; hồ sơ đủ điều kiện xếp lịch phỏng vấn trên `/schedule-interview`. |
| `REJECTED` | **Không phù hợp / Bị từ chối** | Đỏ nhạt | Hồ sơ bị từ chối ở vòng duyệt CV hoặc sau phỏng vấn. **Quy tắc cốt lõi:** Tuyệt đối không thể hoàn tác hay chuyển ngược về trạng thái cũ. |
| `INTERVIEWING` | **Đang phỏng vấn** | Vàng cam | Ứng viên đã được xếp lịch phỏng vấn ít nhất 1 vòng và đang trong quá trình đánh giá. |
| `OFFERED` | **Đã có offer** | Xanh lục đậm | Hiring Manager đã phê duyệt mức lương và hoàn tất bước xác nhận chốt Offer chính thức. |

---

## 5. Sơ Đồ Điều Hướng Bằng Bàn Phím (Keyboard Navigation)

- `Tab` / `Shift+Tab`: Di chuyển tuần tự qua các trường nhập liệu, nút bấm và danh sách lựa chọn.
- `Enter`: Gửi biểu mẫu (Submit form), kích hoạt nút bấm đang nhận tiêu điểm (hoạt động khi hợp lệ).
- `Escape`: Đóng các hộp thoại Modal (áp dụng cho Modal từ chối và Modal tạo user mới).
- `Space`: Lựa chọn checkbox hoặc mở menu dropdown.
