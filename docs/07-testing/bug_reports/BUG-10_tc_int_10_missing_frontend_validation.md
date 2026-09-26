## BUG-10 - Bỏ lọt Validation Frontend form Scorecard (TC-INT-10)

Summary:
Form chấm điểm phỏng vấn (Scorecard) thiếu validation trên UI, cho phép Interviewer bấm submit khi để trống trường điểm số (score).

Environment:
Localhost / Frontend (Next.js/React) / Chrome 128 / Playwright E2E.

Reproduction:
1. Đăng nhập bằng Interviewer.
2. Mở một phiên chấm điểm (`/interviewer/scorecard/:id`).
3. Để trống ô Nhập điểm số, chỉ điền Ghi chú (Notes).
4. Nhấn nút Nộp (Submit).

Expected:
Trình duyệt chặn form submit (HTML5 `required`) hoặc React Hook Form hiển thị dòng chữ đỏ báo lỗi "Vui lòng nhập điểm".
Actual:
Nút submit vẫn kích hoạt và gửi payload `{ score: null }` xuống Backend. Dù backend chặn lại báo 400 Bad Request, nhưng trải nghiệm UI bị vỡ do báo lỗi hệ thống.

Root Cause:
Trường `score` trong input HTML chưa có thuộc tính `required`, và Zod schema ở client-side chưa bắt lỗi `undefined/null`.

Solution:
Thêm `{ required: "Điểm không được để trống" }` vào `register` của React Hook Form, hoặc đổi type của input thành `<input type="number" required />`.

Regression Risk: Low
Đây là lỗi UX/UI nhỏ, sửa nhanh không ảnh hưởng luồng khác.

Test Plan:
- E2E: Dùng Playwright fill score = rỗng, click submit. Assert thẻ `span.field-error` hiện lên thay vì form gửi đi.
