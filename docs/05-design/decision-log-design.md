# Nhật Ký Quyết Định Thiết Kế (Design Decision Log) — Smart Recruitment ATS


> ⚠️ Mọi quyết định thiết kế quan trọng (Design Decisions) trong tài liệu này đều được đối chiếu trực tiếp với mã nguồn triển khai thực tế trên Frontend Next.js và Backend Prisma/PostgreSQL của hệ thống HireFlow AI.

---

## 0. Thống Nhất 4 Điểm "Vàng" Kỹ Thuật & Khung 14 User Stories (5 Epics)

### 4 Điểm "Vàng" Kỹ Thuật Cốt Lõi:
1. **Thang điểm Scorecard:** Thống nhất tuyệt đối **Thang điểm 1 - 10** (`min="1" max="10"` trên UI `/scorecard` và lưu kiểu `Int` trong database).
2. **Giới hạn dung lượng CV:** Thống nhất tuyệt đối tệp nộp tối đa **5MB**, hỗ trợ định dạng **PDF, DOCX, TXT** (`apply/page.tsx`).
3. **Cơ chế xác nhận có kiểm soát (Confirmation):**
   - **Thao tác Từ chối (Reject):** Dùng Modal cảnh báo ghi Audit Log, sau khi xác nhận thì chuyển sang `REJECTED` và **tuyệt đối không thể hoàn tác**.
   - **Thao tác Chốt Offer (Offer Approval):** Dùng Modal Human Confirmation bắt buộc người dùng phải gõ chính xác cụm từ token **`XAC NHAN`**.
4. **Kiểm soát thời gian phỏng vấn:** Nút Submit trên Scorecard tự động bị khóa (`disabled`) nếu `scheduledAt > now` kèm thông báo *"Chưa đến thời gian phỏng vấn"*.

### Khung 14 User Stories Toàn Hệ Thống Phân Rã Theo 5 Epics:

#### Epic 1: Job & Application (Quản lý tin & Nộp CV)
- **`US-ATS-01`**: Tạo và quản lý tin tuyển dụng (`/create-job`, `/dashboard`).
- **`US-ATS-02`**: Xem danh sách việc làm và nộp hồ sơ ứng tuyển kèm CV PDF/DOCX/TXT ≤ 5MB (`/jobs`, `/apply`).

#### Epic 2: AI Screening (Sàng lọc thông minh bằng AI)
- **`US-ATS-03`**: Đọc và hiển thị tệp CV gốc trên giao diện (`/cv-review` — Ngăn trái 60%).
- **`US-ATS-04`**: Tính năng tóm tắt kỹ năng và kinh nghiệm thực chiến bằng AI (`/cv-review` — Nút *"✨ Tóm tắt CV"*).
- **`US-ATS-05`**: Tính toán AI Match Score và phân tích chi tiết kỹ năng có / thiếu (`/cv-review` — Ngăn phải 40%).
- **`US-ATS-06`**: Ra quyết định Pass / Reject có ghi nhận Audit Log và Modal xác nhận (`/cv-review`).

#### Epic 3: Interview & Scorecard (Phỏng vấn & Đánh giá)
- **`US-ATS-07`**: Lên lịch phỏng vấn Vòng 1 hoặc Vòng 2 cho ứng viên (`/schedule-interview`).
- **`US-ATS-08`**: Xem danh sách ca phỏng vấn cá nhân được phân công (`/my-interviews`).
- **`US-ATS-09`**: Khối AI gợi ý câu hỏi phỏng vấn theo ngữ cảnh ứng viên và JD (`/scorecard` — Ngăn phải).
- **`US-ATS-10`**: Phiếu đánh giá Scorecard chuyên môn Thang điểm 1 - 10 và kiểm soát khóa giờ (`/scorecard`).

#### Epic 4: Decision & Offer (Quyết định & Tuyển dụng)
- **`US-ATS-11`**: Bảng tổng hợp điểm phỏng vấn các vòng phỏng vấn (`/scorecard-summary`).
- **`US-ATS-12`**: Tạo và phê duyệt Thư mời nhận việc (Offer) với mã xác nhận token *"XAC NHAN"* (`/offer-approval`).

#### Epic 5: Candidate & Admin (Trải nghiệm ứng viên & Quản trị)
- **`US-ATS-13`**: Cổng thông tin ứng viên tra cứu trạng thái hồ sơ (`/applications`).
- **`US-ATS-14`**: Quản lý tài khoản người dùng, phân quyền và Soft-delete bảo toàn Audit Log (`/admin-users`).

---

## Danh Mục Quyết Định Thiết Kế Thực Tế (Design Decisions)

### DES-01 — Hiển Thị Bảng Kỹ Năng (Matched/Missing Skills) Đi Kèm Huy Hiệu Điểm Đối Chiếu Từ Khóa (Match Score)

- **Ngày quyết định (Date):** 2026-09-20 
- **Trạng thái (Status):** Đã phê duyệt & Đã triển khai vào mã nguồn (Approved & Implemented ✅)  

#### 1. Bối cảnh & Vấn đề (Context & Problem):
Kết quả thử nghiệm độ khả dụng (Usability Test Finding 1) cho thấy người dùng có xu hướng "tin mù" vào con số điểm phần trăm nếu chỉ nhìn lướt qua. Khi hiển thị điểm, chuyên viên tuyển dụng cần nhìn thấy cả lý do định tính (kỹ năng nào ứng viên có, kỹ năng nào còn thiếu so với JD).

#### 2. Quyết định triển khai thực tế (Decision):
- Trên màn hình Sàng lọc (`/cv-review`), kết quả đối chiếu AI hiển thị đồng thời cả hai phần:
  1. Thẻ **AI Match Score**: Thể hiện tỷ lệ phần trăm (hoặc `N/A` nếu file CV chưa trích xuất được text như DOCX/ảnh) kèm dòng giải thích rõ ràng số lượng từ khóa trùng khớp (ví dụ: *"2/4 từ khóa yêu cầu xuất hiện trong nội dung CV. Điểm chỉ là hỗ trợ quyết định, cần con người xác nhận."*).
  2. Khối **Phân tích kỹ năng**: Danh sách kỹ năng có (`matchedSkills`) và kỹ năng cần hỏi thêm (`missingSkills`).
- Bổ sung nút **"✨ Tóm tắt CV (AI)"** cho phép trích xuất các kỹ năng cốt lõi và kinh nghiệm thực chiến từ CV để người dùng đối chiếu sâu hơn trước khi ra quyết định.

#### 3. Tệp tin triển khai mã nguồn liên quan:
- Frontend: [`frontend/app/cv-review/page.tsx`]
- Backend: [`backend/app/api/applications/[id]/match/route.ts`]
- Truy vết yêu cầu: REQ-ATS-05, BR-ATS-02

---

### DES-02 — Cơ Chế Xác Nhận Có Ý Thức (Explicit Human Confirmation) & Ghi Nhận Lịch Sử Audit Log

- **Ngày quyết định (Date):** 2026-09-20
- **Trạng thái (Status):** Đã phê duyệt & Đã triển khai vào mã nguồn (Approved & Implemented ✅)  

#### 1. Bối cảnh & Vấn đề (Context & Problem):
Các thao tác quyết định trạng thái nhân sự (Từ chối ứng viên, Chốt Thư mời nhận việc Offer) mang tính pháp lý nội bộ và không thể đảo ngược tùy tiện. Người dùng nếu chỉ bấm 1 click thông thường rất dễ xảy ra sai sót hoặc lầm tưởng có thể bấm Hoàn tác (Undo).

#### 2. Quyết định triển khai thực tế (Decision):
- **Đối với thao tác Từ chối hồ sơ (Reject trên `/cv-review`):**
  - Bắt buộc bật mở Hộp thoại xác nhận Từ chối (`isRejectModalOpen`).
  - Ghi rõ cảnh báo: *"Bạn có chắc chắn muốn từ chối ứng viên này? Quyết định này sẽ được ghi vào Audit Log."*
  - Khi xác nhận: Backend cập nhật `REJECTED` và khóa vĩnh viễn, kèm quy tắc chặn quay lại trạng thái cũ: *"Hồ sơ đã bị từ chối, không thể quay lại trạng thái trước đó."*
- **Đối với thao tác Chốt Thư mời nhận việc (Offer trên `/offer-approval`):**
  - Áp dụng cơ chế **Xác nhận qua Token (Confirmation Token)**: Bật Hộp thoại Human Confirmation yêu cầu Hiring Manager phải chủ động gõ chính xác từ khóa **`XAC NHAN`** vào ô input thì nút "Chốt Offer" mới được kích hoạt.
  - Phía Backend kiểm tra nghiêm ngặt: `if (parsed.data.confirmationToken !== 'XAC NHAN') throw new ValidationError('Token xác nhận không chính xác');` và bắt buộc vai trò phải là `HIRING_MANAGER`.

#### 3. Tệp tin triển khai mã nguồn liên quan:
- Frontend: [`frontend/app/cv-review/page.tsx`], [`frontend/app/offer-approval/page.tsx`]
- Backend: [`backend/app/api/applications/[id]/route.ts`], [`backend/app/api/offers/[id]/confirm/route.ts`]
- Truy vết yêu cầu: REQ-ATS-06, REQ-ATS-11, BR-ATS-01

---

### DES-03 — Bố Cục Chia Đôi Màn Hình 60/40 (Split-View Layout) Cho Sàng Lọc CV Và Chấm Điểm Scorecard

- **Ngày quyết định (Date):** 2026-09-20
- **Trạng thái (Status):** Đã phê duyệt & Đã triển khai vào mã nguồn (Approved & Implemented ✅)  

#### 1. Bối cảnh & Vấn đề (Context & Problem):
Phỏng vấn viên và Chuyên viên tuyển dụng thường xuyên phải chuyển đổi qua lại giữa file CV của ứng viên và biểu mẫu nhập liệu, dễ dẫn đến mất ngữ cảnh và lãng phí thời gian mở nhiều tab trình duyệt.

#### 2. Quyết định triển khai thực tế (Decision):
- Áp dụng bố cục chia đôi màn hình tỷ lệ **60% (Cột trái) / 40% (Cột phải)** trên desktop:
  - **Màn hình `/cv-review`:** Cột trái (60%) hiển thị trình xem CV gốc (hỗ trợ PDF qua iframe và text/plain) hoặc tóm tắt AI; Cột phải (40%) hiển thị kết quả phân tích AI và nút ra quyết định.
  - **Màn hình `/scorecard`:** Cột trái (60%) giữ nguyên hiển thị CV ứng viên; Cột phải (40%) hiển thị gợi ý câu hỏi và form chấm điểm chuyên môn (thang điểm 1-10) kèm ghi chú.
- Phân tách màu nền rõ rệt: Ngăn CV sử dụng nền xám nhạt `bg-gray-100` với khung hiển thị tài liệu màu trắng `bg-white`, ngăn tác vụ bên phải sử dụng nền trắng với đổ bóng cạnh phân cách nhẹ nhàng.

#### 3. Tệp tin triển khai mã nguồn liên quan:
- Frontend: [`frontend/app/cv-review/page.tsx`], [`frontend/app/scorecard/page.tsx`]
- Truy vết yêu cầu: REQ-ATS-09, REQ-ATS-10

---

### DES-04 — Chế Độ Dự Phòng Khi Dịch Vụ AI Gián Đoạn (AI Fallback & Error Handling)

- **Ngày quyết định (Date):** 2026-09-20
- **Trạng thái (Status):** Đã phê duyệt & Đã triển khai vào mã nguồn (Approved & Implemented ✅)  
- **Bên phê duyệt (Decision by):** Đội ngũ UX/UI & Engineering  

#### 1. Bối cảnh & Vấn đề (Context & Problem):
Khi các dịch vụ AI bên ngoài bị quá thời gian phản hồi (timeout) hoặc gặp sự cố kỹ thuật (503 Service Unavailable), nếu hệ thống bị treo hoặc khóa luồng thì chuyên viên tuyển dụng sẽ bị đình trệ công việc.

#### 2. Quyết định triển khai thực tế (Decision):
- Tách biệt hoàn toàn luồng nạp CV và luồng phân tích AI: Người dùng luôn luôn xem được tệp CV gốc bất kể dịch vụ AI có hoạt động hay không.
- Khi AI gặp sự cố hoặc tệp CV là dạng DOCX không đọc được text: Hệ thống hiển thị điểm `N/A` và thông báo lỗi rõ ràng bên trong khung phân tích mà không làm crash ứng dụng.
- Cặp nút quyết định Pass / Reject vẫn hoàn toàn khả dụng, cho phép con người trực tiếp đánh giá bằng mắt và đưa ra quyết định tuyển dụng thủ công.

#### 3. Tệp tin triển khai mã nguồn liên quan:
- Frontend: [`frontend/app/cv-review/page.tsx`]
- Backend: [`backend/app/api/applications/[id]/match/route.ts`]
- Truy vết yêu cầu: NFR-ATS-05, REQ-ATS-04

---

### DES-05 — Quy Chuẩn Thang Điểm Đánh Giá Scorecard Từ 1 Đến 10 & Kiểm Soát Thời Gian Phỏng Vấn

- **Ngày quyết định (Date):** 2026-09-20 
- **Trạng thái (Status):** Đã phê duyệt & Đã triển khai vào mã nguồn (Approved & Implemented ✅)  
- **Bên phê duyệt (Decision by):** Đội ngũ Engineering & UX/UI  

#### 1. Bối cảnh & Vấn đề (Context & Problem):
Thang điểm 1 - 5 có độ phân giải quá hẹp, gây khó khăn cho việc phân loại chính xác các ứng viên có trình độ sát nút nhau trong các vòng phỏng vấn kỹ thuật chuyên sâu. Đồng thời cần ngăn chặn việc phỏng vấn viên nhập điểm trước khi buổi phỏng vấn thực tế diễn ra.

#### 2. Quyết định triển khai thực tế (Decision):
- Thống nhất áp dụng **Thang điểm chuyên môn từ 1 đến 10** (`min="1" max="10"`) trên biểu mẫu chấm điểm `/scorecard` và lưu trữ dưới dạng số nguyên `Int` trong cơ sở dữ liệu (`Scorecard.score`).
- Bảng tổng hợp điểm các vòng phỏng vấn (Vòng 1, Vòng 2) và điểm trung bình của từng ứng viên. Giao diện hiển thị dưới dạng bảng dữ liệu trực quan giúp Quản lý tuyển dụng (Hiring Manager) nhanh chóng nắm bắt kết quả đánh giá chuyên môn để tiến hành bước tạo đề xuất Thư mời nhận việc (Offer).
- **Ràng buộc thời gian:** Khóa nút submit nếu thời gian ca phỏng vấn chưa tới (`scheduledAt > now`), hiển thị thông báo: *"Chưa đến thời gian phỏng vấn"*.

#### 3. Tệp tin triển khai mã nguồn liên quan:
- Frontend: [`frontend/app/scorecard/page.tsx`], [`frontend/app/scorecard-summary/page.tsx`]
- Backend: [`backend/prisma/schema.prisma`]
