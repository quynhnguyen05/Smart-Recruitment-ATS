## BUG-03 - Thiếu kiểm soát quyền truy cập (RBAC) trên nhiều API Endpoints

**Summary:**
Quá trình chạy kiểm thử ma trận phân quyền tự động (RBAC Matrix Checks) phát hiện 6 trường hợp Role không có quyền truy cập nhưng hệ thống lại cho phép lọt qua (trả về 200 OK) hoặc trả về lỗi Validation (400 Bad Request) thay vì chặn ngay lập tức (403 Forbidden).

**Environment:**
Localhost / Backend (Next.js API Routes) / Automation Test (`pytest`).

**Reproduction:**
1. Khởi động môi trường server.
2. Chạy lệnh: `npm run test:py`.
3. Quan sát kết quả của hàm test `test_rbac_matrix_75_checks`.

**Các trường hợp lỗi cụ thể (Actual vs Expected):**
1. `GET /api/applications`: 
   - **INTERVIEWER** gọi lấy danh sách CV trả về 200 OK. (Expected: 403).
   - **CANDIDATE** gọi API này cũng trả về 200 OK toàn bộ dữ liệu. (Expected: Chặn hoặc chỉ trả CV của chính ứng viên).
2. `POST /api/interviews`:
   - **HIRING_MANAGER** gọi trả về 400 Bad Request (lỗi validation). (Expected: 403 Forbidden vì HM không có quyền lên lịch phỏng vấn, chỉ Recruiter/Admin).
3. `GET /api/scorecards/summary`:
   - **RECRUITER** và **INTERVIEWER** gọi trả về 200 OK. (Expected: 403, bảng tổng hợp scorecard chỉ dành cho Hiring Manager và Admin xem).
4. `POST /api/offers`:
   - **RECRUITER** gọi trả về 400 Bad Request. (Expected: 403, chỉ Hiring Manager mới có quyền tạo Offer lương).

**Root Cause:**
- Các file endpoint trong `backend/app/api/...` đang thiếu middleware phân quyền `requireRole(['ADMIN', 'RECRUITER'])`.
- Request đi thẳng tới tầng Validation của Zod (gây ra lỗi 400) hoặc đi thẳng tới DB (gây ra lỗi lộ dữ liệu nội bộ bằng 200 OK) thay vì bị chặn ở tầng Authentication/Authorization Middleware.

**Solution:**
Sử dụng hàm helper kiểm tra vai trò người dùng (ví dụ `requireRole`) ở ngay dòng đầu tiên của mỗi file route.
- `/api/applications (GET)`: Chỉ cho phép `ADMIN`, `RECRUITER`, `HIRING_MANAGER`. Riêng `CANDIDATE` chỉ được query nếu kèm filter ID của chính họ.
- `/api/interviews (POST)`: Chỉ cho phép `ADMIN`, `RECRUITER`.
- `/api/scorecards/summary (GET)`: Chỉ cho phép `ADMIN`, `HIRING_MANAGER`.
- `/api/offers (POST)`: Chỉ cho phép `ADMIN`, `HIRING_MANAGER`.

**Regression Risk:** High
Đây là các lỗ hổng bảo mật rò rỉ dữ liệu (IDOR / BOLA) rất nghiêm trọng, cho phép Candidate có thể xem hồ sơ của Candidate khác, hoặc Interviewer xem được toàn bộ thông tin tuyển dụng. Cần được vá lập tức (Hotfix).

**Test Plan:**
- Bổ sung quyền hạn vào Backend.
- Chạy lại kịch bản `npm run test:py` để đảm bảo 75 kịch bản phân quyền (RBAC Matrix) báo PASSED toàn bộ.
