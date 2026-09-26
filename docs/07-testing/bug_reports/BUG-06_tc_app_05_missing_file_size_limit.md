## BUG-06 - Không giới hạn dung lượng File CV tải lên (TC-APP-05)

Summary:
API nộp hồ sơ không cấu hình giới hạn kích thước file đính kèm, dẫn đến rủi ro hacker tải lên file hàng GB gây cạn kiệt tài nguyên (Storage Abuse/DoS).

Environment:
Localhost / Backend (Next.js API Routes) / Form Data Upload.

Reproduction:
1. Chuẩn bị file PDF giả có kích thước 6MB (hoặc lớn hơn 5MB).
2. Gọi POST `/api/applications` đính kèm file đó.
3. Theo dõi response trả về.

Expected:
Hệ thống chặn file và trả về 413 Payload Too Large hoặc 400 Bad Request do vượt quá 5MB.
Actual:
Hệ thống tiếp nhận file, lưu trữ thành công và trả về 201 Created.

Root Cause:
Middleware xử lý form-data (vd: Multer hoặc Next.js config) không thiết lập cấu hình `limits: { fileSize: 5 * 1024 * 1024 }`.

Solution:
Cấu hình giới hạn upload file tại Next.js `api: { bodyParser: false }` kết hợp Multer limit fileSize.

Regression Risk: Medium
Có thể vô tình chặn nhầm file hợp lệ nếu cấu hình sai đơn vị byte.

Test Plan:
- Unit: Gửi file 6MB -> nhận 413 Payload Too Large.
- Integration: Gửi file 4.9MB -> nhận 201 Created thành công.
- E2E: Chọn file lớn 10MB trên UI -> UI hiện toast báo lỗi từ chối upload, không gọi API.
