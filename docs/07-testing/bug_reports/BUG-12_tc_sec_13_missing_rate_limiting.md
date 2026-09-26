## BUG-12 - API thiếu giới hạn Rate Limiting tại Login (TC-SEC-13)

Summary:
Endpoint `/api/auth/login` không được bảo vệ bằng cơ chế Rate Limiting, cho phép hacker tấn công Brute-force hoặc Credential Stuffing bằng cách nã hàng ngàn request dò mật khẩu mỗi giây.

Environment:
Localhost / Backend (Next.js API Routes) / Authentication Flow.

Reproduction:
1. Viết script Python (sử dụng thư viện `requests`) gửi liên tục 100 request đăng nhập với sai mật khẩu vào endpoint `/api/auth/login` trong vòng 1 giây.
2. Theo dõi HTTP Status Code trả về.

Expected:
Sau 5 lần sai liên tiếp từ 1 IP, hệ thống tạm khóa IP đó và trả về lỗi `429 Too Many Requests` trong vòng 15 phút.
Actual:
Hệ thống tiếp tục xử lý toàn bộ 100 request và đều đặn trả về `401 Unauthorized` mà không hề có dấu hiệu ngắt kết nối hay cảnh báo (Throttle).

Root Cause:
Chưa cài đặt hoặc config package `express-rate-limit` hoặc cơ chế chặn IP trên Next.js Middleware/Redis.

Solution:
Tích hợp Redis-based Rate Limiting (như `@upstash/ratelimit` nếu dùng Next.js serverless) vào route `auth/login`. Set limits: 5 requests / 15 phút per IP.

Regression Risk: High
Rủi ro bảo mật cực cao (OWASP A07:2021 - Identification and Authentication Failures). Kẻ xấu sẽ dễ dàng chiếm đoạt tài khoản Admin.

Test Plan:
- Unit: Mock Redis, gọi API quá giới hạn -> nhận mã 429.
- E2E: Viết vòng lặp Playwright gõ sai pass 6 lần, assert màn hình hiển thị "Thử lại sau 15 phút".
