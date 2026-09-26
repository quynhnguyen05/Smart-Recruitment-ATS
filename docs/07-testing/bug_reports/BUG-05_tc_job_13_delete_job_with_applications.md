## BUG-05 - Cho phép xóa Job đã có hồ sơ ứng tuyển (TC-JOB-13)

Summary:
Recruiter có thể xóa hoàn toàn một Job (hard delete) kể cả khi Job đó đã có Candidate nộp hồ sơ, gây ra mồ côi dữ liệu (orphaned applications).

Environment:
Localhost / Backend (Next.js API Routes) / Prisma ORM.

Reproduction:
1. Chọn một Job ID đang có ít nhất 1 hồ sơ ứng tuyển.
2. Gửi request DELETE tới `/api/jobs/:id` với quyền Recruiter.
3. Xem lại danh sách ứng viên của Job vừa xóa.

Expected:
API ném lỗi 409 Conflict thông báo không thể xóa Job đã có hồ sơ ứng tuyển.
Actual:
API trả về 204 No Content (hoặc 200) và xóa thành công, bỏ lại các hồ sơ ứng tuyển trơ trọi trong DB.

Root Cause:
Trong Prisma schema, quan hệ giữa Job và Application có thể không thiết lập `onDelete: Restrict`, hoặc Controller xóa chưa kiểm tra count của applications.

Solution:
Thêm logic trong `DELETE /api/jobs/:id`: Check `applicationCount > 0`. Nếu có, block và return 409. 

Regression Risk: High
Ảnh hưởng tới toàn vẹn dữ liệu (Data Integrity) trong Database.

Test Plan:
- Unit: Mock Prisma tìm thấy application liên kết với job -> assert 409 Conflict.
- Integration: Tạo job -> tạo application -> gọi api delete job -> assert 409.
- E2E: Thử bấm nút xóa Job trên UI đối với Job đã có ứng viên -> Modal báo lỗi không thể xóa.
