## BUG-11 - Lỗi Spam Gửi Offer do thiếu cơ chế chống Click Đúp (TC-OFF-09)

Summary:
Nút "Xác nhận Gửi Offer" cho ứng viên không bị khóa (disabled) sau khi ấn, dẫn đến việc Hiring Manager nếu click chuột 3-4 lần liên tục do mạng chậm sẽ tạo ra nhiều email Offer gửi cho cùng 1 người.

Environment:
Localhost / Frontend (Next.js/React) / Chrome 128 / Chế độ mạng 3G chậm (Throttling).

Reproduction:
1. Đăng nhập với quyền Hiring Manager, vào tab soạn Offer.
2. Mở Chrome DevTools, bật Network Throttling (Slow 3G).
3. Nhấn liên tục nút "Xác nhận Gửi" nhiều lần.

Expected:
Ngay sau cú click đầu tiên, nút button chuyển sang trạng thái Disable (mờ đi) và hiện icon Spinner xoay.
Actual:
Nút vẫn sáng đèn và cho phép click. 3 Request API được nã vào backend, hệ thống gửi ra 3 email thông báo Offer đến ứng viên (Spam).

Root Cause:
State `isSubmitting` chưa được gắn vào thuộc tính `disabled={isSubmitting}` của nút button. Ngoài ra, backend chưa có Idempotency Token (chống xử lý trùng lặp request).

Solution:
- **Client**: Gắn `disabled={isSubmitting}` vào UI Button.
- **Server**: Cấp kèm 1 Idempotency Key hoặc kiểm tra `if (application.status === 'OFFERED') return 409 Conflict`.

Regression Risk: Medium
Nếu không sửa, trải nghiệm ứng viên sẽ rất tệ vì nhận quá nhiều email rác từ công ty.

Test Plan:
- Unit: Mock API 2 giây, click 2 lần -> React call API 1 lần duy nhất.
- E2E: Dùng Playwright `btn.click()`, assert `expect(btn).to_be_disabled()`.
