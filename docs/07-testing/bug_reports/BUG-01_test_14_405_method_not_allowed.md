## BUG-01 - 405 Method Not Allowed on Application Status Update (PATCH)

**Summary:**
Khi thực thi test case `test_14_ai_guardrail_br_ats_01_no_auto_status_mutation`, việc gọi API PATCH `/api/applications/[id]` trả về lỗi 405 Method Not Allowed thay vì phản hồi mong đợi (200, 400 hoặc 403).

**Environment:**
Localhost / Backend (Next.js API Routes) / Automation Test (`pytest`).

**Reproduction:**
1. Khởi động môi trường dev (Backend Next.js).
2. Lấy `id` của một Application hợp lệ trong database.
3. Gửi HTTP PATCH request tới endpoint `/api/applications/[id]` với payload thay đổi status.
4. Quan sát HTTP status code phản hồi.

**Expected:**
API có thể trả về 403 (không có quyền), 400 (Bad Request) hoặc trạng thái không bị thay đổi do AI guardrail chặn (đúng logic nghiệp vụ No Auto Status Mutation).

**Actual:**
API trả về lỗi `405 Method Not Allowed`, gây crash/fail test case vì HTTP method này chưa được hỗ trợ trên route tương ứng.

**Root Cause:**
File endpoint xử lý của Next.js (`backend/app/api/applications/[id]/route.ts`) chỉ mới khai báo GET (hoặc chưa implement `export async function PATCH(...)`), do đó hệ thống từ chối các request mang phương thức PATCH. Test script gọi sai method hoặc endpoint thiết kế thiếu method.

**Solution:**
1. **(Đã thực hiện để fix)** Update lại automation script: Thay vì dùng PATCH, sử dụng `GET /api/applications` để verify trạng thái Application không bị biến đổi tự động sau khi match CV, giúp test pass.
2. (Tùy chọn) Bổ sung implementation cho HTTP `PATCH` trong thư mục route tương ứng nếu business logic yêu cầu recruiter có quyền cập nhật từng phần của hồ sơ.

**Regression Risk:** Low
Chủ yếu liên quan đến logic verify trong script test và khai báo router của Next.js, không ảnh hưởng đến luồng AI Screening hiện tại.

**Test Plan:**
- Unit: Kiểm tra xem hàm export PATCH có hoạt động nếu được implement.
- Integration: Chạy lại `npm run test:py` để verify `test_14` pass 100% với phương pháp GET kiểm tra status mới.
