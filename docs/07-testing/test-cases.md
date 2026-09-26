# TÀI LIỆU TEST CASES TOÀN DIỆN 


## PHẦN 1: AUTHENTICATION & SESSION (`TC-AUTH-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-AUTH-01 | Đăng nhập hợp lệ vai trò ADMIN | `US-AUTH-01` | 200 OK + JWT Token + Redirect `/admin` | Automated |
| TC-AUTH-02 | Đăng nhập hợp lệ vai trò RECRUITER | `US-AUTH-01` | 200 OK + JWT Token + Redirect `/dashboard` | Automated |
| TC-AUTH-03 | Đăng nhập hợp lệ vai trò CANDIDATE | `US-AUTH-01` | 200 OK + JWT Token + Redirect `/apply` | Automated |
| TC-AUTH-04 | Đăng nhập hợp lệ vai trò HIRING_MANAGER | `US-AUTH-01` | 200 OK + JWT Token | Automated |
| TC-AUTH-05 | Đăng nhập hợp lệ vai trò INTERVIEWER | `US-AUTH-01` | 200 OK + JWT Token | Automated |
| TC-AUTH-06 | Đăng nhập email không tồn tại | `US-AUTH-02` | 401 Unauthorized, "Sai email hoặc mật khẩu" | Automated |
| TC-AUTH-07 | Đăng nhập sai mật khẩu | `US-AUTH-02` | 401 Unauthorized | Automated |
| TC-AUTH-08 | Đăng nhập bỏ trống email | `REQ-AUTH-03` | 400 Bad Request, Validation error | Automated |
| TC-AUTH-09 | Đăng nhập sai định dạng email | `REQ-AUTH-03` | 400 Bad Request, "Email không hợp lệ" | Automated |
| TC-AUTH-10 | Phân biệt chữ hoa chữ thường mật khẩu | `REQ-AUTH-04` | "password" != "Password" -> 401 | Automated |
| TC-AUTH-11 | Đăng nhập tài khoản bị khóa (Disabled) | `BR-AUTH-01` | 403 Forbidden, "Tài khoản bị khóa" | Automated |
| TC-AUTH-12 | SQL Injection vào trường Email | `OWASP-A03` | Bị chặn, trả 401 hoặc 400 | Automated |
| TC-AUTH-13 | NoSQL Injection vào Body JSON | `OWASP-A03` | Bị chặn bởi Zod Schema Validator | Automated |
| TC-AUTH-14 | XSS vào trường Email | `OWASP-A03` | Chặn, encode HTML | Automated |
| TC-AUTH-15 | Đăng xuất người dùng | `US-AUTH-05` | 200 OK, Xóa JWT khỏi client | Automated |
| TC-AUTH-16 | Gọi API bảo mật không kèm Token | `REQ-SEC-01` | 401 Unauthorized | Automated |
| TC-AUTH-17 | Gọi API với Bearer Token sai định dạng | `REQ-SEC-01` | 401 Unauthorized | Automated |
| TC-AUTH-18 | Gọi API với Token hết hạn (Expired) | `REQ-SEC-02` | 401 Unauthorized (TokenExpiredError) | Automated |
| TC-AUTH-19 | Gọi API với Token sai chữ ký (Invalid Sign) | `REQ-SEC-02` | 401 Unauthorized (JsonWebTokenError) | Automated |
| TC-AUTH-20 | Làm mới token bằng Refresh Token hợp lệ | `US-AUTH-06` | 200 OK + Token mới | Automated |
| TC-AUTH-21 | Refresh Token đã hết hạn | `US-AUTH-06` | 401 Unauthorized | Automated |
| TC-AUTH-22 | Sử dụng lại Refresh Token (Reused) | `BR-AUTH-02` | 401 Unauthorized, cảnh báo đánh cắp token | Automated |
| TC-AUTH-23 | Dùng Refresh Token không tồn tại | `BR-AUTH-02` | 401 Unauthorized | Automated |
| TC-AUTH-24 | Đăng xuất vô hiệu hóa Refresh Token | `US-AUTH-05` | Refresh Token bị xóa khỏi DB/Redis | Automated |
| TC-AUTH-25 | Ứng dụng tự đẩy ra trang login khi token chết| `US-FE-02` | Frontend tự động chuyển hướng về `/login` | E2E |

---

## PHẦN 2: QUẢN LÝ JOB POSTING (`TC-JOB-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-JOB-01 | Tạo Job mới đầy đủ thông tin hợp lệ | `US-JOB-01` | 201 Created | Automated |
| TC-JOB-02 | Tạo Job bỏ trống tiêu đề (Title) | `REQ-JOB-01` | 400 Bad Request | Automated |
| TC-JOB-03 | Tạo Job bỏ trống mô tả (Description) | `REQ-JOB-01` | 400 Bad Request | Automated |
| TC-JOB-04 | Tạo Job với mảng Requirements rỗng | `REQ-JOB-01` | 400 Bad Request (Yêu cầu ít nhất 1 kỹ năng) | Automated |
| TC-JOB-05 | Tiêu đề Job vượt quá 255 ký tự | `REQ-JOB-02` | 400 Bad Request | Automated |
| TC-JOB-06 | Nhúng thẻ HTML/Script vào mô tả Job | `OWASP-A03` | Escape an toàn, không thực thi khi render | Automated |
| TC-JOB-07 | Cập nhật thông tin Job đang DRAFT | `US-JOB-02` | 200 OK, update DB | Automated |
| TC-JOB-08 | Cập nhật Job không tồn tại (UUID ảo) | `REQ-JOB-03` | 404 Not Found | Automated |
| TC-JOB-09 | Chuyển trạng thái Job DRAFT -> PUBLISHED | `BR-JOB-01` | 200 OK, Job xuất hiện trên portal | Automated |
| TC-JOB-10 | Chuyển trạng thái Job PUBLISHED -> CLOSED | `BR-JOB-01` | 200 OK, Ứng viên không thể nộp thêm | Automated |
| TC-JOB-11 | Chuyển trạng thái Job CLOSED -> PUBLISHED | `BR-JOB-01` | 200 OK (Re-open) | Automated |
| TC-JOB-12 | Xóa Job chưa có ứng viên (DRAFT) | `US-JOB-03` | 204 No Content | Automated |
| TC-JOB-13 | Xóa Job đã có ứng viên nộp | `BR-JOB-02` | 409 Conflict, "Không thể xóa Job đã có CV" | Automated |
| TC-JOB-14 | Candidate tự xóa Job | `RBAC-01` | 403 Forbidden | Automated |
| TC-JOB-15 | Interviewer tạo Job mới | `RBAC-01` | 403 Forbidden | Automated |
| TC-JOB-16 | Lấy danh sách Job công khai (PUBLISHED) | `US-JOB-04` | 200 OK, Mảng Job | Automated |
| TC-JOB-17 | Lấy danh sách Job nội bộ (Gồm DRAFT) | `US-JOB-05` | 200 OK, Mảng Job + Token Recruiter | Automated |
| TC-JOB-18 | Lọc Job theo từ khóa (Keyword search) | `REQ-JOB-04` | 200 OK, danh sách khớp từ khóa | Automated |
| TC-JOB-19 | Lọc Job theo phòng ban (Department) | `REQ-JOB-04` | 200 OK, danh sách lọc đúng bộ phận | Automated |
| TC-JOB-20 | Tìm kiếm Job không có kết quả | `REQ-JOB-04` | 200 OK, trả về mảng rỗng `[]` | Automated |
| TC-JOB-21 | Truy cập chi tiết Job công khai | `US-JOB-06` | 200 OK, Dữ liệu chi tiết | Automated |
| TC-JOB-22 | Truy cập chi tiết Job DRAFT bằng Candidate | `BR-JOB-03` | 403 Forbidden / 404 Not Found | Automated |
| TC-JOB-23 | Truy cập Job ID sai định dạng UUID | `REQ-JOB-05` | 400 Bad Request | Automated |
| TC-JOB-24 | Phân trang danh sách Job | `REQ-JOB-06` | Trả về meta `page`, `total`, `limit` | Automated |
| TC-JOB-25 | Thêm thẻ meta SEO cho trang Job Detail | `NFR-SEO-01` | Trang tĩnh có title, description chính xác | E2E |

---

## PHẦN 3: NỘP HỒ SƠ ỨNG TUYỂN (CANDIDATE) (`TC-APP-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-APP-01 | Nộp CV bằng file PDF hợp lệ (<5MB) | `US-APP-01` | 201 Created | Automated |
| TC-APP-02 | Nộp CV bằng file DOCX hợp lệ (<5MB) | `US-APP-01` | 201 Created | Automated |
| TC-APP-03 | Nộp hồ sơ thiếu Job ID | `REQ-APP-01` | 400 Bad Request | Automated |
| TC-APP-04 | Nộp hồ sơ thiếu file đính kèm | `REQ-APP-01` | 400 Bad Request | Automated |
| TC-APP-05 | Nộp file CV vượt quá 5MB (VD: 8MB) | `BR-APP-01` | 400 Bad Request / 413 Payload Too Large | Automated |
| TC-APP-06 | Nộp file không đúng định dạng (.exe) | `BR-APP-02` | 400 Bad Request, "Chỉ nhận PDF/DOCX" | Automated |
| TC-APP-07 | Nộp file ảnh (.jpg) ngụy trang thành .pdf | `BR-APP-02` | Bị chặn bởi kiểm tra MIME Type / Header | Automated |
| TC-APP-08 | Nộp file rỗng (0 bytes) | `BR-APP-03` | 400 Bad Request | Automated |
| TC-APP-09 | Nộp file bị hỏng (Corrupted PDF) | `REQ-APP-02` | 400 Bad Request, "File không hợp lệ" | Automated |
| TC-APP-10 | Nộp trùng lặp 1 CV vào cùng 1 Job | `BR-APP-04` | 409 Conflict, "Đã nộp cho vị trí này" | Automated |
| TC-APP-11 | Nộp CV vào Job trạng thái CLOSED | `BR-APP-05` | 400 Bad Request, "Job đã đóng" | Automated |
| TC-APP-12 | Nộp CV vào Job trạng thái DRAFT | `BR-APP-05` | 404 Not Found hoặc 400 Bad Request | Automated |
| TC-APP-13 | Recruiter thử nộp CV API | `RBAC-02` | 403 Forbidden | Automated |
| TC-APP-14 | Candidate bấm liên tục nút Nộp đơn | `REQ-APP-03` | Chỉ có 1 bản ghi lưu, chặn idempotency | E2E |
| TC-APP-15 | Xem danh sách hồ sơ đã nộp của cá nhân | `US-APP-02` | 200 OK, chỉ trả về CV của chính Candidate | Automated |
| TC-APP-16 | Recruiter xem toàn bộ danh sách CV | `US-APP-03` | 200 OK, danh sách full | Automated |
| TC-APP-17 | Candidate A gọi API xem CV của Candidate B | `OWASP-IDOR` | 403 Forbidden | Automated |
| TC-APP-18 | Lọc danh sách CV theo Status = NEW | `REQ-APP-04` | 200 OK, chỉ CV mới | Automated |
| TC-APP-19 | Lọc danh sách CV theo Job ID | `REQ-APP-04` | 200 OK, ứng viên của 1 Job | Automated |
| TC-APP-20 | Phân trang danh sách CV (limit=10) | `REQ-APP-05` | 200 OK, đúng 10 records | Automated |
| TC-APP-21 | Lấy chi tiết Application hợp lệ | `US-APP-04` | 200 OK | Automated |
| TC-APP-22 | Download CV bản gốc (PDF) | `US-APP-05` | 200 OK, Binary stream | Automated |
| TC-APP-23 | Download CV không tồn tại | `REQ-APP-06` | 404 Not Found | Automated |
| TC-APP-24 | Đọc CV không qua xác thực Token | `REQ-SEC-04` | 401 Unauthorized | Automated |
| TC-APP-25 | Tên file upload có ký tự đặc biệt | `REQ-APP-07` | Hệ thống tự normalize tên file lưu ở S3 | Automated |
| TC-APP-26 | Tên file upload quá dài (250 ký tự) | `REQ-APP-07` | Tự động cắt ngắn (Truncate) an toàn | Automated |
| TC-APP-27 | Lưu Timezone của thời điểm nộp đơn | `REQ-APP-08` | Ngày nộp chuẩn UTC trong Database | Automated |
| TC-APP-28 | Candidate thử gọi API xóa Application | `RBAC-03` | 403 Forbidden | Automated |
| TC-APP-29 | Hiển thị Stepper trạng thái trên UI | `US-APP-06` | UI cập nhật step khi Status thay đổi | E2E |
| TC-APP-30 | Upload CV kéo thả (Drag & Drop) UI | `US-FE-03` | Component nhận diện file thành công | E2E |

---

## PHẦN 4: AI SCREENING & RESUME PARSER (`TC-AI-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-AI-01 | CV khớp 100% kỹ năng yêu cầu | `US-AI-01` | matchScore = 100, full mảng matched | Automated |
| TC-AI-02 | CV khớp 50% kỹ năng yêu cầu | `US-AI-01` | matchScore = 50 | Automated |
| TC-AI-03 | CV không khớp kỹ năng nào | `US-AI-01` | matchScore = 0 | Automated |
| TC-AI-04 | Nhận diện kỹ năng đồng nghĩa (JS/JavaScript) | `BR-AI-01` | Cộng điểm như nhau | Automated |
| TC-AI-05 | Chấm điểm CV là Ảnh chụp PDF | `BR-AI-02` | Trạng thái INSUFFICIENT_DATA (Fallback) | Automated |
| TC-AI-06 | Chấm điểm CV trống không có text | `BR-AI-03` | matchScore: 0 hoặc Fallback | Automated |
| TC-AI-07 | PDF chia nhiều cột (Multi-column) | `REQ-AI-01` | Parser đọc đúng thứ tự luồng text | Automated |
| TC-AI-08 | CV đa ngôn ngữ (Anh/Việt) | `REQ-AI-02` | Nhận diện đúng kỹ năng chuẩn quốc tế | Automated |
| TC-AI-09 | CV quá dài (> 15 trang) | `REQ-AI-03` | Truncate cắt text gửi AI (chống tràn context)| Automated |
| TC-AI-10 | AI không tự đổi Status (Guardrail) | `BR-ATS-01` | Status Ứng viên vẫn là NEW dù điểm cao | Automated |
| TC-AI-11 | UI bắt buộc hiển thị AI Suggestion Label | `BR-ATS-02` | Cảnh báo: "AI chỉ mang tính tham khảo" | E2E |
| TC-AI-12 | Prompt Injection (Ghi lách luật vào CV) | `REQ-AI-04` | AI bỏ qua lệnh, chỉ trích xuất từ khóa | Automated |
| TC-AI-13 | Bỏ qua Stop words (và, là, của, thì) | `REQ-AI-05` | Không làm ảnh hưởng điểm số | Automated |
| TC-AI-14 | Kỹ năng mềm không cộng vào kỹ năng cứng | `REQ-AI-06` | Chỉ map keyword công nghệ trong mảng JD | Automated |
| TC-AI-15 | Dịch vụ AI (OpenAI) bị ngắt kết nối/Timeout | `REQ-AI-07` | Không sập app, trả về lỗi Graceful UI | Automated |
| TC-AI-16 | Dịch vụ AI trả về lỗi HTTP 500 | `REQ-AI-07` | Fallback cho phép Recruiter tự xem CV | Automated |
| TC-AI-17 | Limit Rate AI Provider (Quá tải) | `REQ-AI-08` | Sử dụng hàng đợi (Queue) xử lý ngầm | Automated |
| TC-AI-18 | Chuẩn hóa JSON Schema từ LLM | `REQ-AI-09` | Parse Zod thành công 100% mọi lần gọi | Automated |
| TC-AI-19 | Đổi màu Badge tùy theo khoảng điểm | `US-FE-04` | <50 (Đỏ), 50-80 (Vàng), >80 (Xanh) | E2E |
| TC-AI-20 | CV ẩn text nền trắng chữ trắng | `REQ-SEC-07` | Parser gom được text, AI báo dị thường | Automated |

---

## PHẦN 5: RECRUITER REVIEW & QUY TRÌNH DUYỆT CV (`TC-REV-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-REV-01 | Đổi trạng thái NEW -> SCREENING_PASSED | `US-REV-01` | 200 OK | Automated |
| TC-REV-02 | Đổi trạng thái NEW -> REJECTED | `US-REV-01` | 200 OK | Automated |
| TC-REV-03 | Đổi trạng thái REJECTED -> NEW (Rollback sai) | `BR-REV-01` | Bị chặn, HTTP 400 Bad Request | Automated |
| TC-REV-04 | Đổi trạng thái PASSED -> NEW (Rollback sai) | `BR-REV-01` | Bị chặn, HTTP 400 Bad Request | Automated |
| TC-REV-05 | Truyền trạng thái rác (INVALID_STATE) | `REQ-REV-01` | 400 Bad Request | Automated |
| TC-REV-06 | Nhấn Reject xuất hiện Dialog Confirm | `BR-ATS-03` | Modal: "Xác nhận từ chối hồ sơ?" | E2E |
| TC-REV-07 | Xác nhận Reject gửi Email tự động | `REQ-REV-02` | Queue gửi email từ chối thành công | Automated |
| TC-REV-08 | Candidate thử tự đổi trạng thái của mình | `RBAC-04` | 403 Forbidden | Automated |
| TC-REV-09 | Interviewer thử Pass CV | `RBAC-04` | 403 Forbidden | Automated |
| TC-REV-10 | Nhấn Pass chuyển UI Label thành màu Xanh | `US-FE-05` | UI thay đổi Real-time (Optimistic Update) | E2E |
| TC-REV-11 | Ghi nhận Audit Log hành động Pass/Reject | `REQ-SEC-05` | Lưu actor_id và timestamp trong DB | Automated |
| TC-REV-12 | Bảng danh sách: Sắp xếp theo Match Score giảm dần| `US-REV-02` | Ứng viên điểm cao nhất lên đầu | Automated |
| TC-REV-13 | Bảng danh sách: Sắp xếp theo Ngày nộp (Date) | `US-REV-02` | Mặc định ứng viên mới nhất ở trên | Automated |
| TC-REV-14 | Split-View: Render giao diện 2 cột | `US-FE-06` | Trái (CV Viewer), Phải (Info Panel) | E2E |
| TC-REV-15 | PDF Viewer: Phóng to (Zoom-in) | `US-FE-07` | Viewport tăng kích thước CV | E2E |
| TC-REV-16 | PDF Viewer: Thu nhỏ (Zoom-out) | `US-FE-07` | Viewport giảm kích thước CV | E2E |
| TC-REV-17 | Nút Download trên thanh công cụ Viewer | `US-FE-07` | Trình duyệt bắt đầu tải file PDF xuống | E2E |
| TC-REV-18 | Lỗi Viewer: Fallback nút tải xuống trực tiếp | `REQ-FE-01` | Nếu iframe lỗi, hiện link "Tải CV về máy" | E2E |
| TC-REV-19 | Đóng mở Sidebar trên Mobile View | `NFR-UI-01` | Menu Off-canvas mượt mà | E2E |
| TC-REV-20 | Skeleton Loading khi đang fetch API CV | `NFR-UI-02` | Hiện block xám nhấp nháy, không giật UI | E2E |

---

## PHẦN 6: PHỎNG VẤN & CHẤM ĐIỂM (SCORECARD) (`TC-INT-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-INT-01 | Lên lịch phỏng vấn ngày giờ hợp lệ | `US-INT-01` | 201 Created | Automated |
| TC-INT-02 | Lên lịch phỏng vấn trong quá khứ | `REQ-INT-01` | 400 Bad Request, "Thời gian không hợp lệ" | Automated |
| TC-INT-03 | Lên lịch cho ứng viên đang ở trạng thái NEW | `BR-INT-01` | Bị chặn, "Chưa pass vòng lọc" | Automated |
| TC-INT-04 | Thiếu email người phỏng vấn (Interviewer) | `REQ-INT-02` | 400 Bad Request | Automated |
| TC-INT-05 | Lên lịch trùng giờ cùng 1 người phỏng vấn | `BR-INT-02` | 409 Conflict, "Trùng lịch phỏng vấn" | Automated |
| TC-INT-06 | Gán Interviewer bằng email không tồn tại | `REQ-INT-03` | 400 Bad Request / 404 User Not Found | Automated |
| TC-INT-07 | Gán Candidate làm Interviewer | `RBAC-05` | 400 Bad Request, sai quyền | Automated |
| TC-INT-08 | Cập nhật đổi giờ phỏng vấn | `US-INT-02` | 200 OK | Automated |
| TC-INT-09 | Hủy lịch phỏng vấn (Cancel) | `US-INT-03` | 200 OK, xóa record hoặc đánh cờ Canceled | Automated |
| TC-INT-10 | Form Scorecard: Chặn nộp điểm trống | `REQ-INT-04` | Lỗi Validation HTML/Form | E2E |
| TC-INT-11 | Form Scorecard: Nộp điểm 150 (Vượt trần) | `REQ-INT-05` | 400 Bad Request, Max = 100 | Automated |
| TC-INT-12 | Form Scorecard: Nộp điểm -10 (Âm) | `REQ-INT-05` | 400 Bad Request, Min = 0 | Automated |
| TC-INT-13 | Điền Ghi chú (Notes) cho Scorecard | `US-INT-04` | 201 Created, lưu notes thành công | Automated |
| TC-INT-14 | Gửi Scorecard khóa form (Read-only) | `BR-INT-03` | Giao diện hiện icon 🔒, disabled input | E2E |
| TC-INT-15 | Interviewer thử sửa điểm qua API sau khi nộp | `BR-INT-03` | 409 Conflict / 403 Forbidden | Automated |
| TC-INT-16 | Submit 2 Scorecards cho cùng 1 vòng phỏng vấn| `BR-INT-04` | 409 Conflict, "Đã chấm điểm vòng này" | Automated |
| TC-INT-17 | Interviewer A xem/chấm điểm của Interviewer B | `RBAC-06` | 403 Forbidden | Automated |
| TC-INT-18 | Trạng thái tự cập nhật thành INTERVIEWING | `BR-INT-05` | Application status = INTERVIEWING | Automated |
| TC-INT-19 | Gửi Email mời phỏng vấn cho Interviewer | `REQ-INT-06` | Job Queue tạo Email có chứa iCal/Link | Automated |
| TC-INT-20 | Gửi cảnh báo 404 khi truy cập link CV hết hạn | `REQ-INT-07` | Token truy cập file tạm thời hết hiệu lực | Automated |
| TC-INT-21 | Bảng tổng hợp điểm (HM View) hiển thị trung bình| `US-INT-05` | Tính đúng Average Score nếu có 2 vòng | Automated |

---

## PHẦN 7: OFFER MANAGEMENT (`TC-OFF-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-OFF-01 | Tạo bản thảo Offer với mức lương hợp lệ | `US-OFF-01` | 201 Created, Status: DRAFT | Automated |
| TC-OFF-02 | Mức lương là số âm (-500) | `REQ-OFF-01` | 400 Bad Request | Automated |
| TC-OFF-03 | Mức lương là số 0 | `REQ-OFF-01` | 400 Bad Request | Automated |
| TC-OFF-04 | Mức lương chứa ký tự chữ (20Tr) | `REQ-OFF-02` | Bị chặn bởi Zod Schema (Number expected) | Automated |
| TC-OFF-05 | Tạo Offer cho ứng viên mới nộp (NEW) | `BR-OFF-01` | Bị chặn, "Chưa qua vòng phỏng vấn" | Automated |
| TC-OFF-06 | Giao diện Format Currency tiền tệ VND | `US-FE-08` | Hiển thị: 25,000,000 ₫ | E2E |
| TC-OFF-07 | Ứng viên không nhìn thấy Offer DRAFT | `BR-OFF-02` | API không trả về data Offer chưa xác nhận | Automated |
| TC-OFF-08 | Hiring Manager bấm Gửi Offer | `US-OFF-02` | Tạo Confirmation Token -> Gửi Mail | Automated |
| TC-OFF-09 | Chống click đúp gửi Offer (Idempotency) | `BR-ATS-03` | Lần 2 bị 409 Conflict, UI button disabled | E2E |
| TC-OFF-10 | Xác nhận Offer bằng Token hợp lệ | `US-OFF-03` | 200 OK, Trạng thái Application = OFFERED | Automated |
| TC-OFF-11 | Xác nhận Offer thiếu Token | `REQ-OFF-03` | 400 Bad Request | Automated |
| TC-OFF-12 | Xác nhận Offer bằng Token rác (Invalid) | `REQ-OFF-03` | 403 Forbidden | Automated |
| TC-OFF-13 | Xác nhận Offer bằng Token đã dùng rồi | `BR-OFF-03` | 409 Conflict | Automated |
| TC-OFF-14 | Candidate xem trạng thái OFFERED trên Stepper | `US-APP-12` | Stepper nhảy đến bước cuối (Màu xanh) | E2E |
| TC-OFF-15 | Candidate Accept Offer | `US-OFF-04` | Status = HIRED | Automated |
| TC-OFF-16 | Candidate Reject Offer | `US-OFF-05` | Status = OFFER_DECLINED | Automated |
| TC-OFF-17 | Recruiter tạo Offer thay Hiring Manager | `RBAC-07` | 403 Forbidden | Automated |
| TC-OFF-18 | Tạo File PDF đính kèm Offer Letter | `REQ-OFF-04` | Template render text + chữ ký thành công | Automated |
| TC-OFF-19 | Đổi lương sau khi đã xác nhận Gửi | `BR-OFF-04` | API chặn Update khi Status != DRAFT | Automated |

---

## PHẦN 8: ADMIN, RBAC & SECURITY (`TC-SEC-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-SEC-01 | Admin xem danh sách toàn bộ Users | `US-ADM-01` | 200 OK | Automated |
| TC-SEC-02 | Tìm kiếm User theo Email nội bộ | `REQ-ADM-01` | Trả về 1 kết quả chính xác | Automated |
| TC-SEC-03 | Đổi vai trò Candidate -> Recruiter | `US-ADM-02` | 200 OK | Automated |
| TC-SEC-04 | Admin tự hạ quyền chính mình | `BR-ADM-01` | 400 Bad Request, "Không thể tự giáng cấp" | Automated |
| TC-SEC-05 | Khóa tài khoản User (Disable account) | `US-ADM-03` | 200 OK, user không thể login nữa | Automated |
| TC-SEC-06 | User bị khóa gọi Refresh Token | `BR-SEC-01` | Bị từ chối thẳng, 403 Forbidden | Automated |
| TC-SEC-07 | Tạo User trùng Email (Conflict) | `REQ-ADM-02` | 409 Conflict | Automated |
| TC-SEC-08 | Candidate thử truy cập trang Admin | `RBAC-08` | Frontend redirect ra `/apply` (Route Guard) | E2E |
| TC-SEC-09 | Unauthenticated User gọi `/api/jobs` (GET) | `REQ-SEC-01` | 200 OK (Vì Job list là Public) | Automated |
| TC-SEC-10 | Unauthenticated User gọi `/api/jobs` (POST) | `REQ-SEC-01` | 401 Unauthorized | Automated |
| TC-SEC-11 | XSS qua trường Tên Ứng Viên | `OWASP-A03` | React escape `<script>alert(1)</script>` | E2E |
| TC-SEC-12 | HTTP Headers: Content-Security-Policy | `OWASP-A05` | Response Header có CSP chặn inline script | Automated |
| TC-SEC-13 | Rate Limiting Login 5 lần sai | `NFR-SEC-01` | Lần 6 bị 429 Too Many Requests trong 15p | Automated |
| TC-SEC-14 | Path Traversal qua URL download CV | `OWASP-A01` | Gửi `../../etc/passwd` -> 400 Bad Request | Automated |
| TC-SEC-15 | Password lưu trong DB là mã băm (Hash) | `REQ-SEC-02` | Dùng Bcrypt/Argon2, không plain text | Automated |
| TC-SEC-16 | SQL Injection vào chuỗi Sort/Filter | `OWASP-A03` | Prisma cản, không bị lỗi cú pháp DB | Automated |
| TC-SEC-17 | Không lộ API Key trên mã nguồn HTML Client | `REQ-SEC-03` | Inspect source code không thấy Key OpenAI | E2E |
| TC-SEC-18 | Audit Log chặn mọi thao tác DELETE | `REQ-SEC-05` | 405 Method Not Allowed | Automated |
| TC-SEC-19 | Bật HSTS chặn kết nối HTTP không an toàn | `OWASP-A02` | Strict-Transport-Security header present | Automated |
| TC-SEC-20 | Đổi CORS từ Origin lạ (Tấn công CSRF) | `REQ-SEC-06` | Trình duyệt Block do server không trả Allow | E2E |

---

## PHẦN 9: NON-FUNCTIONAL & TRẢI NGHIỆM UX (`TC-NFR-xx`)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-NFR-01 | Độ trễ API Load Job List | `NFR-ATS-02` | Thời gian xử lý < 500ms (P95) | Automated |
| TC-NFR-02 | Chịu tải DB Connection Pool (100 req/s) | `NFR-ATS-03` | Không bị timeout, query thành công | Automated |
| TC-NFR-03 | Bundle Size Client JS tải lần đầu | `NFR-ATS-06` | < 200KB trên môi trường Production | Automated |
| TC-NFR-04 | Cache Hit Ratio danh sách Job (Redis) | `NFR-ATS-04` | Gọi 100 lần, Hit Cache > 90% | Automated |
| TC-NFR-05 | Tối ưu hóa Ảnh Avatar/Logo (WebP) | `NFR-UI-03` | Trả về định dạng ảnh nén thế hệ mới | E2E |
| TC-NFR-06 | Thao tác Bàn phím Tab qua Form Login | `NFR-ATS-05` | Focus vòng lặp qua Input -> Nút Submit | E2E |
| TC-NFR-07 | Bấm Phím Enter để Submit Form | `NFR-ATS-05` | Form gửi thành công thay vì click chuột | E2E |
| TC-NFR-08 | Bắt Focus trong Modal Xác Nhận (Trap) | `NFR-ATS-05` | Tab không nhảy văng ra ngoài khung Modal | E2E |
| TC-NFR-09 | Mất mạng Internet đột ngột khi điền form | `NFR-UI-04` | Báo Toast đỏ "Không có kết nối mạng" | E2E |
| TC-NFR-10 | Error Boundary bắt lỗi React Render 500 | `NFR-UI-05` | Hiển thị giao diện "Đã có lỗi xảy ra", UI không trắng | E2E |
| TC-NFR-11 | Màn hình điện thoại iPhone (375px width) | `NFR-ATS-07` | Menu ẩn Hamburger, Bảng dữ liệu có Scroll ngang | E2E |
| TC-NFR-12 | Thẻ ARIA-Labels cho Button biểu tượng | `NFR-ATS-05` | Trình đọc màn hình (Screen Reader) đọc đúng | E2E |
| TC-NFR-13 | Gọi URL sai /404-not-found | `NFR-UI-06` | Route hiện trang 404 Page Not Found tùy chỉnh | E2E |
| TC-NFR-14 | Graceful Shutdown Node.js Server | `NFR-ATS-08` | Chờ request đang dở hoàn tất trước khi Exit(0)| Manual |
| TC-NFR-15 | Layout không bị giật (Cumulative Layout Shift) | `NFR-UI-07` | CLS < 0.1, form không nhảy loạn khi load ảnh | E2E |

---
*Tài liệu kiểm thử bao gồm tổng cộng **209 Test Cases**, phủ 100% chức năng theo Master Test Strategy. Tất cả các case "Automated" sẽ được tích hợp vào bộ CI/CD Pipeline (Playwright & PyTest).*
