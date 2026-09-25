## BUG-02 - 404 Not Found on Offer Confirmation Endpoint

**Summary:**
Khi thực thi test case `test_19_confirm_offer_missing_token_returns_400` (TC-07), việc gọi API PATCH `/api/offers/[id]/confirm` không đính kèm `confirmationToken` trả về mã lỗi 404 Not Found thay vì 400 Bad Request do bắt lỗi validation.

**Environment:**
Localhost / Backend (Next.js API Routes) / Automation Test (`pytest`).

**Reproduction:**
1. Khởi động môi trường server backend Next.js.
2. Thực thi lệnh chạy automation test: `npm run test:py`.
3. Script `test_19` gửi một HTTP PATCH request đến `/api/offers/00000000-0000-0000-0000-000000000999/confirm` với JSON body rỗng (`{}`).
4. Quan sát mã trạng thái phản hồi từ server.

**Expected:**
API endpoint phải được định tuyến thành công. Do body bị thiếu trường `confirmationToken` bắt buộc, hệ thống (vd: qua Zod Validation) phải chặn request và trả về mã HTTP `400 Bad Request` kèm câu thông báo thiếu tham số, đúng như định nghĩa của Test Case TC-07.

**Actual:**
API trả về lỗi `404 Not Found`. Điều này khiến test case fail với log: `AssertionError: 404 != 400`. Sự cố này cho thấy API định tuyến chưa hoạt động hoặc chưa được triển khai.

**Root Cause:**
Route xử lý `backend/app/api/offers/[id]/confirm/route.ts` có vẻ chưa được implement method `PATCH` hoặc toàn bộ endpoint này chưa được khởi tạo trong dự án Next.js (Not Implemented Route), dẫn đến Next.js trả về 404 Not Found mặc định khi request đến.

**Solution:**
1. Bổ sung cấu trúc thư mục route: `backend/app/api/offers/[id]/confirm/route.ts`.
2. Khai báo hàm `export async function PATCH(req: Request, { params }: ...)`.
3. Sử dụng Zod để validate body, đảm bảo nếu payload gửi lên thiếu chuỗi `confirmationToken`, hệ thống sẽ ném lỗi HTTP 400 Bad Request thay vì đi sâu vào logic database hoặc bị bỏ lọt.

**Regression Risk:** Low
Đây là luồng tính năng Offer chưa hoàn thiện, việc bổ sung route và logic validation độc lập không làm thay đổi hay gây lỗi hồi quy cho các tính năng Apply Job hay AI Match hiện có.

**Test Plan:**
- **Unit/API:** Gửi bằng Postman gọi `/api/offers/test/confirm` body rỗng -> nhận về 400 Bad Request.
- **Integration:** Chạy lại file automation (`pytest`), verify `test_19_confirm_offer_missing_token_returns_400` chạy PASSED 100%.
