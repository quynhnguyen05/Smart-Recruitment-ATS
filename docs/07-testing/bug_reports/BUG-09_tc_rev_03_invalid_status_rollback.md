## BUG-09 - Lỗ hổng Rollback State Machine (TC-REV-03)

Summary:
Hệ thống cho phép đổi trạng thái của hồ sơ ứng viên từ trạng thái kết thúc (REJECTED/OFFERED) lùi về trạng thái khởi tạo (NEW), phá vỡ State Machine nghiệp vụ.

Environment:
Localhost / Backend (Next.js API Routes) / Prisma ORM.

Reproduction:
1. Đăng nhập bằng Recruiter.
2. Tìm một hồ sơ đang có trạng thái `REJECTED` (Đã từ chối).
3. Gửi PATCH request tới `/api/applications/:id/status` với body `{"status": "NEW"}`.

Expected:
API từ chối request với mã 400 Bad Request kèm thông báo "Không thể đổi trạng thái từ REJECTED về NEW".
Actual:
API trả về 200 OK và cập nhật trạng thái trong DB thành NEW.

Root Cause:
Trong `ApplicationController`, hàm updateStatus chỉ kiểm tra giá trị `status` truyền lên có nằm trong Enum hợp lệ hay không (Zod validator), nhưng thiếu logic kiểm tra biểu đồ trạng thái (State Machine) của luồng tuyển dụng.

Solution:
Tạo một mapper/dictionary chứa các valid transitions cho mỗi trạng thái. Ví dụ:
`const validTransitions = { NEW: ['SCREENING_PASSED', 'REJECTED'], REJECTED: [] }`. 
Check nếu `!validTransitions[currentStatus].includes(newStatus)` thì throw 400.

Regression Risk: Medium
Gây rối loạn tiến trình xử lý hồ sơ nếu thao tác nhầm, nhưng không gây lộ lọt dữ liệu.

Test Plan:
- Unit: Hàm `isValidTransition('REJECTED', 'NEW')` trả về false.
- Integration: PATCH endpoint với status lùi -> assert 400 Bad Request.
- E2E: Trên UI, nếu ứng viên đã REJECTED, nút chuyển về NEW bị ẩn hoặc disable.
