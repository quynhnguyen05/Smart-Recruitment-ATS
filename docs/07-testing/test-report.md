# TÀI LIỆU TEST REPORT (BÁO CÁO KẾT QUẢ KIỂM THỬ)

**Dự án:** Smart Recruitment ATS
**Ngày kiểm thử:** 26/09/2026
**Môi trường:** Local (Backend: Next.js API, Frontend: React)
**Người thực hiện:** QA Automation

---

## 1. TÓM TẮT KẾT QUẢ (EXECUTIVE SUMMARY)

- **Tổng số Test Cases Kế hoạch:** ~200+ TCs
- **Số lượng đã thực thi (Automated Pytest):** 94 TCs (Được định nghĩa chi tiết trong 4 file test script)
- **Số lượng Passed:** 80
- **Số lượng Failed:** 14 (Chính là các Bug hệ thống)
- **Tỷ lệ Pass (Pass Rate):** 85.1%
- **Tổng số Bug cốt lõi ghi nhận:** 14 Bugs (Đã xuất 13 Bug Reports chi tiết và 1 lỗi phân quyền RBAC)

Hệ thống **CHƯA ĐẠT** tiêu chuẩn để Release. Có quá nhiều lỗ hổng bảo mật nghiêm trọng (OWASP) và lỗi nghiệp vụ cốt lõi (Data Integrity, State Machine) cần được Fix ngay lập tức (Hotfix) trước khi đưa lên Staging/Production.

## 2. CHI TIẾT CÁC LỖI NGHIÊM TRỌNG (FAILED TCs & BUG REPORTS)

Dưới đây là danh sách 13 Bug đã được phát hiện trong quá trình chạy Automation Suite và đã được log thành file riêng biệt:

### Phần Bảo mật & Phân quyền (Security / RBAC)
- ❌ **[BUG-03]** Lỗi phân quyền: Chặn sai quyền truy cập của các role (Authorization Failures).
- ❌ **[BUG-07]** `TC-APP-17`: Lỗi IDOR cực kỳ nghiêm trọng, ứng viên có thể tải CV và xem lén thông tin cá nhân của ứng viên khác.
- ❌ **[BUG-12]** `TC-SEC-13`: Thiếu giới hạn Rate Limiting tại route Đăng nhập, rủi ro tấn công Brute-force/Credential Stuffing.
- ❌ **[BUG-13]** `TC-SEC-20`: Cấu hình CORS lỏng lẻo (`*`), cho phép tấn công CSRF từ mọi domain lạ trên internet.

### Phần Nghiệp vụ & Dữ liệu (Business Logic & Data Integrity)
- ❌ **[BUG-04]** `TC-JOB-06`: Lỗ hổng XSS tại trường Description của Job Posting, hệ thống không escape thẻ HTML.
- ❌ **[BUG-05]** `TC-JOB-13`: Cho phép xóa (Hard Delete) Job đã có hồ sơ ứng tuyển, gây lỗi mồ côi dữ liệu (Orphaned Data).
- ❌ **[BUG-06]** `TC-APP-05`: Thiếu giới hạn dung lượng tải file CV, rủi ro DoS/Storage Abuse nếu người dùng cố tình tải file hàng GB.
- ❌ **[BUG-08]** `TC-AI-12`: Lỗ hổng Prompt Injection vào text CV, ứng viên dễ dàng "hack" AI để đạt điểm tuyệt đối 100%.
- ❌ **[BUG-09]** `TC-REV-03`: Lỗi State Machine, cho phép lùi trạng thái hồ sơ từ REJECTED về lại NEW một cách phi lý.

### Phần Frontend UI & UX (E2E)
- ❌ **[BUG-01]** Lỗi `405 Method Not Allowed` khi update Status của Application.
- ❌ **[BUG-02]** Lỗi `404 Not Found` khi xử lý quy trình tạo Offer.
- ❌ **[BUG-10]** `TC-INT-10`: Bỏ lọt Validation Frontend form Scorecard, cho phép nộp điểm rỗng (null) đẩy xuống DB gây vỡ UI.
- ❌ **[BUG-11]** `TC-OFF-09`: Thiếu cơ chế chống Click đúp khi gửi Offer, gây Spam email liên tiếp cho ứng viên nếu mạng chậm.

## 3. ĐÁNH GIÁ CHUNG & KHUYẾN NGHỊ

1. **Bảo mật (Mức báo động đỏ):** Hệ thống đang mắc phải rất nhiều lỗi kinh điển của OWASP (IDOR, XSS, Rate Limit, CORS). Khuyến nghị Dev bổ sung ngay Middleware kiểm tra Ownership, Rate Limiter và chỉnh lại cấu hình Allow-Origin trong Next.js.
2. **Nghiệp vụ cốt lõi:** Lỗ hổng Prompt Injection đánh lừa AI làm mất hoàn toàn độ tin cậy của tính năng AI Screening. Cần bổ sung Guardrails/System Prompt cứng để chống Hack Prompt.
3. **Frontend Validation:** Việc thiếu required form và khóa trạng thái button khi API đang gọi (isSubmitting) dẫn đến trải nghiệm tồi và sinh ra rác dữ liệu. Cần chấn chỉnh lại team Frontend.

**Kết luận:** Tạm dừng việc Release. Đẩy toàn bộ 13 Bug Tickets này sang board của team Developer. Chỉ cấp phép (QA Sign-off) khi toàn bộ Automation Suite báo PASS 100%.
