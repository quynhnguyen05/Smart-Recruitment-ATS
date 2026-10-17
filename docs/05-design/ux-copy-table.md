# Bảng Quy Chuẩn Văn Bản Trải Nghiệm Người Dùng (UX Copy Table) — Smart Recruitment ATS

**Phiên bản (Version):** 1.3 (Chuẩn hóa đồng bộ 100% với giao diện Frontend Next.js & API Backend thực tế)  
**Cập nhật lần cuối (Last updated):** 2026-10-16  
**Người phụ trách (Owner):** UX/UI & Engineering  

---

## 5 Nguyên Tắc Vàng Trong Soạn Thảo UX Copy (UX Writing Principles)

1. **Rõ ràng & Minh bạch (Clear):** Người dùng luôn biết chính xác mình đang thao tác điều gì, tác động đến ai và hệ quả tiếp theo là gì.
2. **Ngắn gọn & Súc tích (Concise):** Mỗi câu tối đa 2 mệnh đề; ưu tiên sử dụng động từ hành động mạnh mẽ và trực diện.
3. **Nhất quán thuật ngữ (Consistent):** Bám sát các thuật ngữ chuẩn hóa trong hệ thống: `Pass`, `Reject`, `Offer`, `Screening`, `Scorecard`, `Audit Log`.
4. **Luôn có hướng dẫn xử lý tiếp theo (Actionable):** Mọi thông báo lỗi bắt buộc phải chỉ rõ nguyên nhân và định hướng người dùng hành động tiếp theo.
5. **Tuyệt đối không đổ lỗi cho người dùng (Blameless):** Sử dụng câu văn khách quan, tôn trọng và hỗ trợ người dùng hoàn thành nhiệm vụ.

---

> 💡 **Lưu ý:** Toàn bộ bảng UX Copy dưới đây đã tuân thủ tuyệt đối Thang điểm 1-10, giới hạn CV 5MB, cơ chế Token XAC NHAN / Audit Log và kiểm soát thời gian Scorecard (Xem chi tiết tại [decision-log-design.md](./decision-log-design.md)).

---

## 1. Tiêu Đề Điều Hướng & Trang Màn Hình Thực Tế (Navigation & Page Titles)

| Đường dẫn màn hình (Route) | Tiêu đề giao diện (Page Title / Header) | Mô tả phụ / Ngữ cảnh sử dụng |
|:---|:---|:---|
| `/dashboard` | **Bảng điều khiển (Dashboard)** | Quản lý tin tuyển dụng đang mở và các CV cần duyệt theo quyền hạn vai trò |
| `/jobs` | **Danh sách công việc tuyển dụng** | Cổng tra cứu danh sách các vị trí đang mở tuyển dụng (OPEN / PUBLISHED) |
| `/create-job` | **Tạo tin tuyển dụng mới** | Biểu mẫu nhập tiêu đề, phòng ban, địa điểm và bản mô tả công việc (JD) |
| `/apply` | **Ứng tuyển công việc** | Biểu mẫu nộp hồ sơ dành cho ứng viên (chọn vị trí và đính kèm file CV) |
| `/applications` | **Đơn ứng tuyển của tôi** | Cổng thông tin cho ứng viên theo dõi trạng thái các hồ sơ đã nộp |
| `/cv-review` | **Duyệt Hồ Sơ (Screening)** | Màn hình chia đôi: Xem CV gốc đối chiếu kết quả phân tích AI và duyệt hồ sơ |
| `/schedule-interview` | **Lên lịch phỏng vấn** | Biểu mẫu xếp lịch Vòng 1 hoặc Vòng 2 cho ứng viên đã qua vòng hồ sơ |
| `/my-interviews` | **Lịch phỏng vấn** | Danh sách ca phỏng vấn được phân công cho phỏng vấn viên |
| `/scorecard` | **Bảng đánh giá (Scorecard)** | Màn hình chấm điểm chuyên môn (thang điểm 1-10) và ghi chú nhận xét |
| `/scorecard-summary` | **Tổng hợp Điểm Phỏng Vấn** | Bảng tổng hợp điểm Vòng 1, Vòng 2 và điểm trung bình cho Hiring Manager |
| `/offer-approval` | **Tổng hợp đánh giá & Quyết định** | Soạn thảo mức lương đề xuất và xác nhận chốt Offer chính thức |
| `/admin-users` | **Quản lý Tài khoản (Admin Only)** | Danh sách người dùng, cấp quyền tài khoản mới và vô hiệu hóa tài khoản |

---

## 2. Các Nút Kêu Gọi Hành Động Thực Tế (Call-to-Action - CTA Buttons)

| Thao tác nghiệp vụ | Vị trí màn hình | Tên nút bấm chính thức (Label) | Hành vi kích hoạt khi bấm |
|:---|:---|:---|:---|
| **Lưu tin tuyển dụng mới** | `/create-job` | **Lưu bản nháp (DRAFT)** | Gửi POST `/api/jobs`, chuyển hướng về `/dashboard` |
| **Nộp đơn ứng tuyển** | `/apply` | **Nộp hồ sơ ứng tuyển** | Gửi Multipart FormData lên POST `/api/applications` |
| **Xem tóm tắt AI** | `/cv-review` | **✨ Tóm tắt CV (AI)** | Chuyển ngăn trái sang hiển thị kỹ năng & kinh nghiệm trích xuất |
| **Hoàn tác xem CV gốc** | `/cv-review` | **Hoàn tác (Xem CV Gốc)** | Chuyển ngăn trái quay lại xem iframe PDF / văn bản gốc |
| **Chấp thuận qua vòng hồ sơ** | `/cv-review` | **Đạt (Pass)** | Cập nhật `SCREENING_PASSED`, chuyển ngay sang `/schedule-interview` |
| **Từ chối ở vòng hồ sơ** | `/cv-review` | **Từ chối (Reject)** | Bật mở Hộp thoại Modal xác nhận từ chối |
| **Chốt lịch phỏng vấn** | `/schedule-interview` | **Chốt lịch & Gửi thông báo** | Gửi POST `/api/interviews` (khi đang gửi: *"Đang kiểm tra lịch trống..."*) |
| **Vào chấm điểm phỏng vấn** | `/my-interviews` | **Vào chấm điểm (Scorecard)** | Chuyển hướng sang `/scorecard?interviewId=:id` |
| **Gửi điểm đánh giá** | `/scorecard` | **Lưu đánh giá (Submit)** | Gửi POST `/api/interviews/:id/scorecard` (Chặn nếu chưa đến giờ) |
| **Tạo bản nháp Offer** | `/offer-approval` | **Tạo Offer nháp** | Gửi POST `/api/offers` với mức lương đề xuất |
| **Mở modal chốt Offer** | `/offer-approval` | **Xác nhận Offer** | Mở Hộp thoại Human Confirmation yêu cầu gõ token |
| **Xác nhận gửi Offer** | Modal trên `/offer-approval` | **Chốt Offer** | Gửi token `XAC NHAN`, cập nhật trạng thái `CONFIRMED` |
| **Cấp quyền tài khoản mới** | `/admin-users` | **+ Cấp quyền User mới** | Mở Modal tạo tài khoản mới |
| **Vô hiệu hóa tài khoản** | `/admin-users` | **Vô hiệu hóa** | Xác nhận qua prompt và gửi PATCH `{ disabled: true }` |

---

## 3. Các Trạng Thái Phân Tích Của AI (AI States & Messages)

| Ngữ cảnh giao diện | Dòng thông báo chính thức (Copy) | Ý nghĩa hiển thị & Vai trò |
|:---|:---|:---|
| **Đang tải danh sách hồ sơ** | *Đang tải danh sách đơn...* | Hiển thị khi gọi GET `/api/applications` |
| **Đang tải tệp CV ứng viên** | *Đang tải CV...* | Hiển thị khi đang nạp Blob CV từ máy chủ |
| **Đang chạy tóm tắt AI** | *Đang tóm tắt CV bằng AI...* | Hiển thị khi gọi GET `/api/applications/:id/summary` |
| **Nhãn thông tin trích xuất** | *✨ Thông tin được trích xuất tự động bởi AI* | Banner màu tím trong chế độ xem tóm tắt |
| **Tiêu đề kỹ năng AI tóm tắt** | *Kỹ năng cốt lõi (Skills)* | Danh sách các chip kỹ năng trích xuất |
| **Tiêu đề kinh nghiệm AI tóm tắt** | *Kinh nghiệm (Experience)* | Danh sách chi tiết các năm kinh nghiệm làm việc |
| **Giải thích đối chiếu từ khóa** | *X/Y từ khóa yêu cầu xuất hiện trong nội dung CV. Điểm chỉ là hỗ trợ quyết định, cần con người xác nhận.* | Giải thích công thức tính Match Score dựa trên JD |
| **CV không trích xuất được chữ** | *Chưa thể trích xuất nội dung text từ CV DOCX hoặc CV không có text. Không tự động chấm điểm.* | Trả về `N/A` khi gặp file DOCX hoặc tệp PDF dạng ảnh quét |
| **Dịch vụ AI gặp sự cố (503)** | *Dịch vụ AI đang gián đoạn / Lỗi kết nối tới AI Service* | Banner đỏ cảnh báo người dùng chuyển sang quy trình thủ công |

---

## 4. Các Quy Chuẩn Kiểm Tra Hợp Lệ Dữ Liệu (Validation & Constraints)

| Trường thông tin (Field) | Quy chuẩn kiểm tra (Rule) | Thông báo lỗi hiển thị thực tế (Error Message) |
|:---|:---|:---|
| **Họ và tên ứng viên** | Bắt buộc không được để trống | *"Vui lòng nhập họ và tên."* |
| **Đính kèm CV ứng viên** | Bắt buộc phải chọn file | *"Vui lòng đính kèm CV của bạn."* |
| **Định dạng tệp CV** | Chỉ chấp nhận: `.pdf`, `.docx`, `.doc`, `.txt` | *"Chỉ hỗ trợ định dạng PDF, DOCX hoặc TXT."* |
| **Dung lượng tệp CV** | Tối đa **5MB** (5 * 1024 * 1024 bytes) | *"Dung lượng file không được vượt quá 5MB."* |
| **Tiêu đề & Mô tả công việc** | Bắt buộc không được để trống | *"Tiêu đề và Mô tả công việc không được để trống."* |
| **Điểm chuyên môn Scorecard** | Số nguyên từ **1 đến 10** (`min="1" max="10"`) | *"Vui lòng nhập điểm chuyên môn từ 1 đến 10."* |
| **Thời gian phỏng vấn** | Chưa đến thời gian (`scheduledAt > now`) | Nút submit hiển thị chữ: *"Chưa đến thời gian phỏng vấn"* (bị khóa) |
| **Vòng phỏng vấn (Schedule)** | Ứng viên đã có vòng 1 mà chọn lại vòng 1 | *"Cảnh báo: Ứng viên này đã được lên lịch Vòng 1. Vui lòng chọn Vòng 2."* |
| **Vòng phỏng vấn (Schedule)** | Chưa thi vòng 1 mà chọn vòng 2 | *"Cảnh báo: Ứng viên chưa thi Vòng 1. Vui lòng chọn Vòng 1 trước."* |
| **Hồ sơ đã bị từ chối** | Thử chuyển ngược trạng thái đã Reject | *"Hồ sơ đã bị từ chối, không thể quay lại trạng thái trước đó"* |

---

## 5. Hộp Thoại Xác Nhận Hành Động (Confirmation Dialogs / Modals)

---

### M01 — Hộp Thoại Xác Nhận Từ Chối Hồ Sơ (Reject Modal trên `/cv-review`)

| Thành phần trong Modal | Nội dung văn bản hiển thị chính xác (Exact Copy) |
|:---|:---|
| **Tiêu đề (Modal Title)** | **Xác nhận Từ chối** |
| **Nội dung cảnh báo (Body Text)** | *Bạn có chắc chắn muốn từ chối ứng viên này? Quyết định này sẽ được ghi vào Audit Log.* |
| **Nút hủy (Cancel CTA)** | **Hủy** |
| **Nút xác nhận (Confirm CTA)** | **Xác nhận** *(Nút màu đỏ nguy hiểm, cập nhật REJECTED và ghi Audit Log)* |

---

### M02 — Hộp Thoại Xác Nhận Chốt Offer (Human Confirmation trên `/offer-approval`)

| Thành phần trong Modal | Nội dung văn bản hiển thị chính xác (Exact Copy) |
|:---|:---|
| **Tiêu đề (Modal Title)** | **Human Confirmation** |
| **Nội dung hướng dẫn (Body Text)** | *Quyết định này cần được xác nhận bởi Hiring Manager hoặc Admin.* |
| **Văn bản gợi ý ô nhập (Placeholder)** | **Gõ XAC NHAN** |
| **Điều kiện kích hoạt nút** | Chỉ mở khóa khi người dùng gõ chính xác cụm từ: **`XAC NHAN`** |
| **Nút hủy (Cancel CTA)** | **Hủy** |
| **Nút xác nhận (Confirm CTA)** | **Chốt Offer** *(Gửi kèm `{ confirmationToken: 'XAC NHAN' }` lên Backend)* |

---

### M03 — Hộp Thoại Thông Báo Nộp Điểm Thành Công (Modal trên `/scorecard`)

| Thành phần trong Modal | Nội dung văn bản hiển thị chính xác (Exact Copy) |
|:---|:---|
| **Tiêu đề (Modal Title)** | **Đã lưu đánh giá thành công!** |
| **Nội dung thông báo (Body Text)** | *Hệ thống đã ghi nhận điểm và nhận xét của bạn.* |
| **Nút hoàn tất (Action CTA)** | **Quay lại danh sách** *(Điều hướng trở về `/my-interviews`)* |

---

## 6. Nhãn Trạng Thái Quy Trình Tuyển Dụng Trong Cơ Sở Dữ Liệu Thực Tế

| Mã Enum Cơ sở dữ liệu | Nhãn hiển thị chính thức trên UI | Màu sắc đại diện | Mô tả ý nghĩa thực tế |
|:---|:---|:---:|:---|
| `NEW` | **Đã nộp** | Xanh dương nhạt | Hồ sơ ứng viên vừa nộp đơn thành công, đang chờ xem xét ở vòng sàng lọc. |
| `SCORED` | **Đã chấm điểm** | Tím nhạt | Hệ thống đã tính toán điểm đối chiếu từ khóa kỹ năng giữa CV và JD. |
| `SCREENING_PASSED` | **Đạt vòng hồ sơ** | Xanh lá cây | Ứng viên đã vượt qua vòng lọc CV, sẵn sàng để lên lịch phỏng vấn. |
| `REJECTED` | **Không phù hợp** | Đỏ nhạt | Hồ sơ đã bị từ chối; hệ thống khóa cứng không cho phép quay lại trạng thái cũ. |
| `INTERVIEWING` | **Đang phỏng vấn** | Vàng cam | Ứng viên đang tham gia các vòng phỏng vấn chuyên môn (Vòng 1 hoặc Vòng 2). |
| `OFFERED` | **Đã có offer** | Xanh lục đậm | Ứng viên đã được Hiring Manager chốt đề xuất mức lương và xác nhận gửi Offer. |
