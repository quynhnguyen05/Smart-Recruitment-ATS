## BUG-14 - Lỗi rò rỉ quyền hạn (RBAC) trên endpoint GetAllApps

Summary:
Theo kết quả chạy tự động (Pytest) trên Terminal, sub-test `test_rbac_matrix_75_checks[6_GetAllApps_H...]` báo FAILED. Điều này chứng tỏ một User Role (Khả năng cao là Hiring Manager) đang gọi được API lấy toàn bộ danh sách hồ sơ ứng viên của hệ thống mà lẽ ra chỉ Admin/Recruiter mới được phép.

Environment:
Localhost / Backend (Next.js API Routes) / Automation Pytest E2E.

Reproduction:
1. Chạy lệnh: `pytest tests/e2e/test_ats_automation.py`
2. Quan sát logs tại tham số truyền vào `[6_GetAllApps_H...]` của vòng lặp parameterized RBAC.

Expected:
Hệ thống trả về 403 Forbidden cho Hiring Manager do không được cấp quyền xem toàn bộ ứng viên của hệ thống (chỉ được xem của Job mình tạo).
Actual:
Hệ thống trả về 200 OK, làm rò rỉ (Data Leak) dữ liệu của tất cả ứng viên.

Root Cause:
Middleware phân quyền (RequireRole) tại route `GET /api/applications` bị cấu hình lỏng lẻo hoặc thiếu kiểm tra Role-Based Access Control cho phương thức này.

Solution:
Bổ sung hàm middleware `requireRole(['ADMIN', 'RECRUITER'])` vào Controller của route `GetAllApps`.

Regression Risk: High
Cực kỳ nghiêm trọng (Data Breach) vì rò rỉ thông tin cá nhân. Đánh rớt compliance.

Test Plan:
- Unit: Mock request với Token Hiring Manager -> Assert 403.
- E2E: Hiring Manager đăng nhập UI, cố tình gọi fetch Data -> Nhận lỗi quyền hạn.
