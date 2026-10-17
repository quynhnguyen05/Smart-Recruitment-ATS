# Bản Tóm Tắt Đặc Tả Nguyên Mẫu (Prototype Brief) — Smart Recruitment ATS


# 1. Mục Tiêu Của Bản Thử Nghiệm & Hệ Thống (Prototype & System Goals)

Mục tiêu cốt lõi là kiểm chứng và vận hành thực tế **4 luồng nghiệp vụ tuyển dụng có rủi ro trải nghiệm người dùng (UX Risk) cao nhất**:

1. **Kiểm soát thiên kiến nhận thức:** Đảm bảo Chuyên viên tuyển dụng (Recruiter) không lướt qua hoặc tin mù vào gợi ý của AI, giữ vững quyền kiểm soát và trách nhiệm ra quyết định tuyển dụng trên giao diện chia đôi 60/40 (**Luồng A — Sàng lọc hồ sơ**).
2. **Ngăn ngừa thao tác nhầm lẫn:** Đảm bảo các bước xác nhận nhạy cảm (Từ chối hồ sơ, Chốt Offer) có cơ chế xác nhận có ý thức (Explicit Human Confirmation) với cảnh báo Audit Log và Token bắt buộc (**Luồng B & Luồng C**).
3. **Trải nghiệm chấm điểm tập trung:** Đảm bảo Phỏng vấn viên (Interviewer) có thể chấm điểm chuyên môn (thang điểm 1 - 10) ngay trên cùng một màn hình chia đôi đối chiếu trực tiếp với CV ứng viên mà không cần mở tab thứ hai (**Luồng B — Điền Scorecard**).
4. **Không làm gián đoạn công việc khi AI gặp sự cố:** Đảm bảo khi Dịch vụ AI (AI Service) bị quá thời gian xử lý hoặc gặp sự cố (mã lỗi 503), người dùng vẫn xem được CV gốc và ra quyết định thủ công mà không bị kẹt (**Luồng D — Dự phòng sự cố AI**).

---

## 2. Các Chân Dung Người Dùng Chủ Đạo (Key Personas)

| Chân dung (Persona) | Vai trò thực tế (Role) | Nhiệm vụ chính trong hệ thống | Thao tác trên giao diện |
|:---|:---|:---|:---|
| **Lan** | Chuyên viên tuyển dụng (`RECRUITER`) | Xem tin tuyển dụng, sàng lọc CV ứng viên mới (`NEW`), duyệt đạt hoặc từ chối, lên lịch phỏng vấn | Sử dụng `/dashboard`, `/cv-review`, `/schedule-interview` |
| **Mai** | Phỏng vấn viên chuyên môn (`INTERVIEWER`) | Xem lịch phỏng vấn được phân công, đối chiếu CV và chấm điểm chuyên môn vào Scorecard | Sử dụng `/my-interviews`, `/scorecard` |
| **Huy** | Quản lý tuyển dụng (`HIRING_MANAGER`) | Xem bảng tổng hợp điểm phỏng vấn các vòng, tạo mức lương đề xuất và xác nhận chốt Offer | Sử dụng `/scorecard-summary`, `/offer-approval` |
| **An** | Ứng viên tuyển dụng (`CANDIDATE`) | Tìm kiếm vị trí đang mở, nộp hồ sơ kèm CV (PDF/DOCX/TXT ≤ 5MB) và theo dõi tiến trình đơn | Sử dụng `/jobs`, `/apply`, `/applications` |

---

## 3. Các Luồng Người Dùng Trọng Yếu Thực Tế (Critical User Flows)

### LUỒNG A — Sàng Lọc Hồ Sơ Ứng Viên (CV Screening Flow)

- **Người thực hiện:** Lan – Chuyên viên tuyển dụng (`RECRUITER` / `ADMIN`)  
- **Màn hình thực tế:** `/cv-review` (Giao diện chia đôi màn hình 60/40)  

#### Kịch bản & Thao tác:
1. Lan truy cập `/cv-review`. Hệ thống nạp danh sách hồ sơ ở trạng thái `NEW` vào dropdown lựa chọn.
2. Cột trái (60%): Xem CV gốc qua iframe PDF hoặc thẻ pre văn bản. Nút **"✨ Tóm tắt CV (AI)"** cho phép chuyển đổi tức thì sang chế độ xem tóm tắt kỹ năng và kinh nghiệm do AI trích xuất.
3. Cột phải (40%): Hiển thị thẻ **AI Match Score** (tính theo tỷ lệ từ khóa xuất hiện trong CV so với JD), danh sách kỹ năng khớp và kỹ năng cần hỏi thêm.
4. Quyết định tuyển dụng:
   - Bấm **"Đạt (Pass)"**: Trạng thái hồ sơ chuyển thành `SCREENING_PASSED`, hệ thống tự động điều hướng sang màn hình xếp lịch phỏng vấn `/schedule-interview?applicationId=:id`.
   - Bấm **"Từ chối (Reject)"**: Bật mở Modal cảnh báo: *"Bạn có chắc chắn muốn từ chối ứng viên này? Quyết định này sẽ được ghi vào Audit Log."* Khi bấm Xác nhận, hồ sơ cập nhật thành `REJECTED` (Backend chặn tuyệt đối không cho hoàn tác lại).

---

### LUỒNG B — Phỏng Vấn & Đánh Giá Scorecard (Interview & Scorecard Flow)

- **Người thực hiện:** Mai – Phỏng vấn viên (`INTERVIEWER` / `ADMIN`)  
- **Màn hình thực tế:** `/my-interviews` → `/scorecard?interviewId=:id`  

#### Kịch bản & Thao tác:
1. Mai vào `/my-interviews`, xem danh sách các ca phỏng vấn được phân công chưa có điểm đánh giá.
2. Bấm nút **"Vào chấm điểm (Scorecard)"** tại ca phỏng vấn cần chấm.
3. Màn hình chia đôi `/scorecard`:
   - Ngăn trái (60%): Hiển thị CV gốc của ứng viên để Mai đối chiếu xuyên suốt buổi phỏng vấn.
   - Ngăn phải (40%): Hiển thị AI Match Score, khối gợi ý câu hỏi từ AI, ô nhập **Điểm chuyên môn (1 - 10)** và ô **Ghi chú đánh giá**.
4. **Kiểm tra nghiệp vụ thời gian:** Nếu ca phỏng vấn chưa đến giờ (`scheduledAt > now`), nút bấm hiển thị *"Chưa đến thời gian phỏng vấn"* và bị khóa mờ để ngăn chặn việc chấm điểm khống trước giờ.
5. Khi phỏng vấn xong, Mai nhập điểm (1-10) và ghi chú rồi bấm **"Lưu đánh giá (Submit)"**. Hệ thống hiển thị hộp thoại xác nhận lưu thành công và cho phép quay về danh sách.

---

### LUỒNG C — Quản Lý Tuyển Dụng Tổng Hợp Điểm & Phê Duyệt Offer (Hiring Manager Flow)

- **Người thực hiện:** Huy – Quản lý tuyển dụng (`HIRING_MANAGER` / `ADMIN`)  
- **Màn hình thực tế:** `/scorecard-summary` → `/offer-approval?applicationId=:id`  

#### Kịch bản & Thao tác:
1. Huy truy cập `/scorecard-summary` để xem bảng tổng hợp kết quả: Điểm Vòng 1, Điểm Vòng 2 và Điểm trung bình của từng ứng viên.
2. Bấm **"Tạo Offer"** tại hàng ứng viên đã có điểm để chuyển sang `/offer-approval`.
3. Nhập mức lương đề xuất và bấm **"Tạo Offer nháp"** (bản ghi Offer được tạo với trạng thái `DRAFT`).
4. Bấm **"Xác nhận Offer"**:
   - Bật mở Hộp thoại **Human Confirmation Modal**.
   - Yêu cầu bắt buộc: Huy phải gõ chính xác từ khóa token **`XAC NHAN`** vào ô nhập.
   - Bấm **"Chốt Offer"**: Máy chủ kiểm tra token và phân quyền, cập nhật trạng thái Offer thành `CONFIRMED` và ghi nhận lịch sử vào bảng `AuditLog`.

---

### LUỒNG D — Dự Phòng Sự Cố AI (AI Service Fallback Flow)

- **Người thực hiện:** Lan / Mai / Toàn bộ người dùng  
- **Kịch bản thực tế:**
  1. Khi tệp CV là định dạng DOCX hoặc PDF dạng ảnh quét không trích xuất được chữ: API `/api/applications/:id/match` trả về trạng thái `INSUFFICIENT_DATA`, điểm hiển thị `N/A` và thông báo rõ ràng cho người dùng biết để tự đọc file thủ công.
  2. Khi dịch vụ tóm tắt AI gặp lỗi kết nối hoặc nhận tham số `simulateError=true`: Hệ thống trả về mã lỗi 503 kèm thông báo *"Dịch vụ AI đang gián đoạn"*. Người dùng vẫn xem toàn bộ CV gốc bình thường và nút Pass/Reject vẫn hoạt động trơn tru.

---

## 4. Dữ Liệu Mẫu Hệ Thống Thực Tế (Sample Data Structure)

```json
{
  "job": {
    "title": "Senior Frontend Developer",
    "department": "Engineering",
    "location": "Hà Nội",
    "requirements": "React TypeScript 3+ years experience English B2",
    "status": "PUBLISHED"
  },
  "candidate": {
    "name": "Nguyễn Văn A",
    "email": "nguyen.vana@example.com",
    "cv_file": "cv_nguyen_van_a.pdf"
  },
  "ai_match_result": {
    "status": "OK",
    "matchScore": 75,
    "matchedSkills": ["react", "typescript"],
    "missingSkills": ["english", "b2"],
    "explanation": "2/4 từ khóa yêu cầu xuất hiện trong nội dung CV. Điểm chỉ là hỗ trợ quyết định, cần con người xác nhận."
  },
  "scorecard": {
    "score": 9,
    "notes": "Ứng viên nắm rất chắc kiến trúc React và Next.js App Router, trả lời tự tin các câu hỏi tình huống."
  },
  "offer": {
    "salary": 35000000,
    "status": "CONFIRMED",
    "confirmationToken": "XAC NHAN"
  }
}
```

---

> 💡 **Quy chuẩn kỹ thuật:** Toàn bộ các luồng nguyên mẫu đã tuân thủ chặt chẽ Thang điểm Scorecard 1-10, giới hạn CV 5MB, cơ chế Token XAC NHAN / Audit Log và kiểm soát thời gian phỏng vấn (Xem chi tiết tại [decision-log-design.md](./decision-log-design.md)).


