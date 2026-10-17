# DESIGN.md — Hệ Thống Thiết Kế (Design System) · Smart Recruitment ATS

**Phiên bản:** 1.2 (Cập nhật sau Usability Test vòng 1)
**Cập nhật lần cuối:** 2026-09-15
**Người sở hữu:** UX/UI
**Nguồn tham chiếu:** usability-findings.md (DES-01..04), prototype-brief.md

> ⚠️ Mọi thay đổi về token đều phải cập nhật file này và thông báo cho Engineering **trước** khi implement (triển khai).

---

## 1. Nguyên Tắc Thiết Kế (Design Principles)

> Đây là 5 nguyên tắc tư tưởng xuyên suốt toàn bộ sản phẩm. Mọi quyết định về giao diện đều phải tuân thủ các nguyên tắc này.

| Mã | Nguyên tắc | Áp dụng thực tế |
|:---|:---|:---|
| P1 | **AI hỗ trợ — con người quyết định** | Không có hành động tự động nào được phép thay đổi trạng thái Application (hồ sơ ứng tuyển) |
| P2 | **Minh bạch & Đầy đủ thông tin** | Điểm Match Score luôn đi kèm giải thích số từ khóa trùng khớp và danh sách phân tích kỹ năng có / cần hỏi thêm |
| P3 | **Ngăn sai — không phải cho Undo (hoàn tác)** | Dùng Modal cảnh báo ghi Audit Log cho Từ chối (Reject) và Token bắt buộc "XAC NHAN" cho Chốt Offer |
| P4 | **Không bao giờ để người dùng bị kẹt** | Mọi lỗi AI đều có luồng hiển thị CV gốc và đánh giá thủ công ngay lập tức |
| P5 | **Keyboard-first cho form quan trọng** | Màn hình Screening, Scorecard và Offer Confirmation phải dùng được hoàn toàn bằng bàn phím |

---

### 1.1 Thống Nhất 4 Điểm "Vàng" Kỹ Thuật (4 Golden Rules)

> 🎯 Toàn bộ các thành phần giao diện, luồng xử lý và dữ liệu trong tài liệu này đều tuân thủ tuyệt đối 4 điểm vàng kỹ thuật đã hiện thực hóa trong mã nguồn:
> 1. **Thang điểm Scorecard:** Thống nhất tuyệt đối **Thang điểm 1 - 10** (`min="1" max="10"` trên `/scorecard`, lưu kiểu `Int` trong database).
> 2. **Giới hạn dung lượng CV:** Thống nhất tuyệt đối tệp nộp tối đa **5MB**, hỗ trợ định dạng **PDF, DOCX, TXT** (khớp chính xác với `apply/page.tsx`).
> 3. **Cơ chế xác nhận có kiểm soát (Confirmation):**
>    - Thao tác Từ chối (Reject): Dùng Modal cảnh báo ghi Audit Log, sau khi xác nhận thì chuyển sang `REJECTED` và **tuyệt đối không thể hoàn tác**.
>    - Thao tác Chốt Offer (Offer Approval): Dùng Modal Human Confirmation bắt buộc người dùng phải gõ chính xác cụm từ token **`XAC NHAN`**.
> 4. **Kiểm soát thời gian phỏng vấn:** Nút Submit trên `/scorecard` tự động bị khóa (`disabled`) nếu `scheduledAt > now` kèm thông báo *"Chưa đến thời gian phỏng vấn"*.

---

## 2. Design Tokens (Biến Thiết Kế)

> **Design Token** = một biến số được đặt tên đại diện cho một giá trị thiết kế (màu, cỡ chữ, khoảng cách...). Dùng token thay vì giá trị cứng (hardcode) để dễ thay đổi đồng loạt và đảm bảo nhất quán.

---

### 2.1 Màu Sắc (Color)

> Tất cả màu được đặt tên theo **vai trò ngữ nghĩa**, không đặt theo tên màu vật lý. Ví dụ: dùng `color.danger` thay vì `red`.

| Token | Giá trị (Hex) | Mục đích sử dụng | Tỷ lệ tương phản (Contrast ratio) |
|:---|:---|:---|:---|
| `color.primary` | `#1D4ED8` | Nút hành động chính (CTA), điều hướng đang hoạt động, vòng focus, liên kết | AA (4.5:1 trên nền trắng) |
| `color.primary-hover` | `#1E40AF` | Trạng thái khi di chuột vào nút primary | — |
| `color.primary-light` | `#EFF6FF` | Nền nhạt cho trạng thái đang được chọn/active | — |
| `color.success` | `#059669` | Badge "Phù hợp cao" (High Match), trạng thái đã duyệt, banner thành công | AA trên nền trắng |
| `color.success-light` | `#ECFDF5` | Nền nhạt cho badge "Phù hợp cao" | — |
| `color.warning` | `#D97706` | Badge "Phù hợp trung bình" (Medium Match), cần kiểm tra thủ công | AA trên nền trắng |
| `color.warning-light` | `#FFFBEB` | Nền nhạt cho badge "Phù hợp trung bình" | — |
| `color.danger` | `#DC2626` | Badge "Phù hợp thấp" (Low Match), banner lỗi, từ chối (Reject), nút nguy hiểm | AA trên nền trắng |
| `color.danger-light` | `#FEF2F2` | Nền nhạt cho badge "Phù hợp thấp", nền banner lỗi | — |
| `color.neutral-50` | `#F9FAFB` | Nền trang (Level 0 — lớp nền sâu nhất) | — |
| `color.neutral-100` | `#F3F4F6` | Nền phụ của card, nền pane (ngăn) phân biệt trong split-view | — |
| `color.neutral-200` | `#E5E7EB` | Viền mặc định của Input, Card, Divider (đường kẻ phân cách) | — |
| `color.neutral-600` | `#4B5563` | Chữ phụ, metadata (dữ liệu bổ sung), placeholder (văn bản gợi ý mờ) | AA trên nền trắng |
| `color.neutral-900` | `#111827` | Chữ chính | AAA trên nền trắng |
| `color.white` | `#FFFFFF` | Bề mặt card (Card surface), nền Modal | — |

> 💡 **Contrast ratio (tỷ lệ tương phản):** Chuẩn WCAG AA yêu cầu ≥ 4.5:1 cho chữ thường và ≥ 3:1 cho chữ lớn — đảm bảo người khiếm thị nhẹ vẫn đọc được.

---

### 2.2 Kiểu Chữ (Typography)

> Toàn bộ hệ thống dùng font **Inter** (tải từ Google Fonts). Mỗi token xác định cỡ chữ (font size) / chiều cao dòng (line-height) / độ đậm (font weight).

| Token | Font | Cỡ chữ / Chiều cao dòng | Độ đậm (Weight) | Dùng ở đâu |
|:---|:---|:---|:---|:---|
| `type.heading-lg` | Inter | 24px / 32px | 700 (Bold — đậm) | Tiêu đề trang |
| `type.heading-md` | Inter | 20px / 28px | 700 (Bold) | Tiêu đề section (mục lớn), tiêu đề Modal |
| `type.heading-sm` | Inter | 16px / 24px | 600 (Semibold — hơi đậm) | Tiêu đề card, nhãn pane (ngăn màn hình) |
| `type.body-base` | Inter | 14px / 20px | 400 (Regular — thường) | Nội dung chính, nhãn form, nhãn checkbox |
| `type.body-sm` | Inter | 13px / 18px | 400 | Mô tả phụ, văn bản tóm tắt AI |
| `type.caption` | Inter | 12px / 16px | 400 | Metadata, dấu thời gian (timestamp), nhãn phụ |
| `type.button` | Inter | 14px / 20px | 600 (Semibold) | Chữ trên nút bấm (Button label) |
| `type.badge` | Inter | 12px / 16px | 700 (Bold) | Chữ trên badge điểm Match Score, chip trạng thái |


---

### 2.3 Thang Khoảng Cách (Spacing Scale) — Gốc 8px

> Toàn bộ padding (khoảng đệm bên trong) và margin (khoảng cách bên ngoài) phải là **bội số của 8px** — tạo nhịp điệu thị giác nhất quán.

| Token | Giá trị | Dùng ở đâu |
|:---|:---|:---|
| `space.1` | 4px | Khoảng cách rất nhỏ — giữa icon và chữ, padding chip |
| `space.2` | 8px | Đơn vị gốc — padding bên trong ô nhập liệu (input) |
| `space.3` | 12px | Padding nhỏ của component |
| `space.4` | 16px | Padding chuẩn của component, thân card |
| `space.5` | 20px | Khoảng cách dọc giữa các section |
| `space.6` | 24px | Padding card, padding modal |
| `space.8` | 32px | Khoảng cách giữa các khối lớn |
| `space.10` | 40px | Padding dọc của header trang |

---

### 2.4 Độ Bo Góc (Border Radius)

> **Border radius** = mức độ bo tròn ở góc của các thành phần giao diện.

| Token | Giá trị | Dùng cho |
|:---|:---|:---|
| `radius.sm` | 4px | Bo nhẹ — chip nhỏ, tag (nhãn nhỏ) |
| `radius.md` | 8px | Chuẩn — nút (Button), ô nhập (Input), Card, Modal |
| `radius.lg` | 12px | Bo nhiều — Card lớn, khung chứa panel |
| `radius.full` | 9999px | Bo tròn hoàn toàn dạng viên thuốc (pill shape) — Badge điểm, avatar |

---

### 2.5 Độ Nổi / Bóng Đổ (Elevation / Shadow)

> **Elevation** = hiệu ứng đổ bóng tạo cảm giác một thành phần "nổi lên" trên nền — truyền đạt thứ bậc thị giác (visual hierarchy).

| Token | Giá trị CSS | Dùng cho |
|:---|:---|:---|
| `elevation.1` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)` | Card thông thường, widget điểm, dropdown |
| `elevation.2` | `0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)` | Modal, panel đang được focus — cần nổi bật hơn |
| `elevation.focus` | `0 0 0 3px rgba(29,78,216,0.30)` | Vòng focus (focus ring) — hiển thị trên MỌI phần tử tương tác khi được chọn bằng bàn phím |

---

### 2.6 Bố Cục (Layout)

> Các token quy định tỷ lệ phân chia màn hình và kích thước khung bố cục chính.

| Token | Giá trị | Dùng ở đâu |
|:---|:---|:---|
| `layout.split-left` | 60% | Ngăn trái (pane trái) — hiển thị CV gốc |
| `layout.split-right` | 40% | Ngăn phải (pane phải) — hiển thị AI phân tích hoặc form Scorecard |
| `layout.max-width` | 1440px | Chiều rộng tối đa của container toàn trang |
| `layout.sidebar` | 240px | Chiều rộng thanh điều hướng dọc (navigation sidebar) |

---

## 3. Đặc Tả Component (Component Specifications)

> **Component** = một khối giao diện có thể tái sử dụng (reusable UI block). Mục này mô tả từng component chính, các biến thể (variant), trạng thái (state) và quy tắc sử dụng.

---

### 3.1 MatchScoreBadge — Huy Hiệu Điểm Phù Hợp

**Biến thể (Variants):** `high` (≥80%) | `medium` (50–79%) | `low` (<50%) | `error`

| Trạng thái (State) | Màu nền (Background) | Màu chữ | Viền (Border) | Icon |
|:---|:---|:---|:---|:---|
| `high` — Cao | `color.success-light` | `color.success` | Không có | ✓ checkmark |
| `medium` — Trung bình | `color.warning-light` | `color.warning` | Không có | ⚡ |
| `low` — Thấp | `color.danger-light` | `color.danger` | Không có | ⚠ |
| `error` — Lỗi tính điểm | `color.neutral-100` | `color.neutral-600` | 1px neutral-200 | ? |

**Bố cục & Hiển thị:**
- Thể hiện tỷ lệ phần trăm đối chiếu từ khóa (0% - 100%) hoặc `N/A` khi CV chưa trích xuất được text.
- Đi kèm dòng văn bản giải thích số lượng từ khóa trùng khớp giữa CV và JD.
- Đặt cạnh khối phân tích kỹ năng có (`matchedSkills`) và cần hỏi thêm (`missingSkills`) để cung cấp cái nhìn toàn diện.

**Khả năng tiếp cận (Accessibility):**
- `aria-label="Match Score: 72%, mức trung bình"` — giúp screen reader (phần mềm đọc màn hình) thông báo đúng
- Không dùng màu là cách duy nhất phân biệt — luôn kèm nhãn chữ

---

### 3.2 DecisionButton — Cặp Nút Quyết Định (Pass / Reject)

**Biến thể:** `pass` (màu primary xanh dương `#1D4ED8`) | `reject` (viền đỏ nhạt, chữ đỏ `color.danger`)

| Trạng thái (State) | Nền (Background) | Chữ | Viền |
|:---|:---|:---|:---|
| `default` — Bình thường | `#1D4ED8` (Pass) / Nền trắng (Reject) | Trắng (Pass) / Đỏ `#B91C1C` (Reject) | 1px border-red-200 (Reject) |
| `hover` — Di chuột vào | Xanh đậm hơn (Pass) / Nền đỏ nhạt `bg-red-50` (Reject) | Giữ nguyên | Giữ nguyên |
| `disabled` — Bị vô hiệu hóa | `color.neutral-200` | `color.neutral-600` | Không có |

**Hành vi thực tế:**
- Nằm cùng một hàng ngang ở góc dưới ngăn tác vụ bên phải.
- **Bấm "Từ chối (Reject)":** Bật mở Hộp thoại Modal M01 cảnh báo ghi Audit Log để người dùng xác nhận có ý thức.
- **Bấm "Đạt (Pass)":** Cập nhật trạng thái hồ sơ thành `SCREENING_PASSED` và tự động điều hướng sang màn hình xếp lịch phỏng vấn `/schedule-interview?applicationId=:id`.

**Khả năng tiếp cận:**
- `aria-label="Chuyển ứng viên sang trạng thái Pass"`
- Focus ring hiển thị với `elevation.focus`
- Phím `Enter` = click khi nút đang được focus

---

### 3.3 ConfirmationModal — Hộp Xác Nhận Quyết Định Có Kiểm Soát

Hệ thống triển khai 2 dạng Hộp thoại xác nhận có kiểm soát (Explicit Human Confirmation) tương ứng với mức độ nhạy cảm của từng hành động:

#### A. Modal Xác Nhận Từ Chối Hồ Sơ (`RejectModal` trên `/cv-review`)
- **Bố cục & Nội dung:** Tiêu đề đỏ *"Xác nhận Từ chối"*, cảnh báo nghiêm ngặt: *"Bạn có chắc chắn muốn từ chối ứng viên này? Quyết định này sẽ được ghi vào Audit Log."*
- **Quy tắc cốt lõi:** Sau khi bấm Xác nhận, Backend cập nhật trạng thái `REJECTED` và khóa vĩnh viễn, ngăn chặn tuyệt đối việc chuyển ngược lại trạng thái cũ.

#### B. Modal Xác Nhận Chốt Offer (`OfferConfirmationModal` trên `/offer-approval`)
- **Bố cục & Nội dung:** Tiêu đề *"Human Confirmation"*, nội dung *"Quyết định này cần được xác nhận bởi Hiring Manager hoặc Admin."*
- **Cơ chế Token bắt buộc:** Ô nhập liệu yêu cầu người dùng phải gõ chính xác chuỗi từ khóa **`XAC NHAN`** (`placeholder="Gõ XAC NHAN"`). Nút "Chốt Offer" chỉ mở khóa khi điều kiện này thỏa mãn và được Backend kiểm tra nghiêm ngặt qua schema `{ confirmationToken: 'XAC NHAN' }`.

```
┌─────────────────────────────────────┐
│  ⚠️  Human Confirmation       [×]  │  ← heading-md
│                                     │
│  Quyết định này cần được xác nhận    │  ← body-base
│  bởi Hiring Manager hoặc Admin.     │
│                                     │
│  [ Gõ XAC NHAN                   ]  ← Input bắt buộc nhập token
│                                     │
│  [Hủy]               [Chốt Offer]   │  ← Nút hành động (chỉ sáng khi gõ đúng)
└─────────────────────────────────────┘
```

**Quy tắc chung:**
- Overlay (lớp phủ mờ) phía sau: `rgba(0,0,0,0.5)` — đen 50% độ trong suốt
- Nền modal: `color.white`, bóng `elevation.2`, bo góc `radius.md`
- Phím `Escape` = đóng modal (tương đương Hủy)
- Phím `Enter` = Xác nhận (chỉ khi nút đã enabled)
- Focus trap (bẫy focus bàn phím) bên trong modal khi đang mở


---

### 3.4 AISummaryCard — Chế Độ Tóm Tắt CV Bằng AI

**Kích hoạt & Trạng thái:**
- Khi xem hồ sơ trên `/cv-review`, người dùng bấm nút **"✨ Tóm tắt CV (AI)"** ở ngăn trái.
- Ngăn trái (60%) chuyển từ trình xem tài liệu gốc (PDF/TXT) sang giao diện tóm tắt AI. Nút chuyển đổi đổi nhãn thành **"Hoàn tác (Xem CV Gốc)"**.

| Trạng thái | Bố cục hiển thị | Nội dung chi tiết |
|:---|:---|:---|
| `loading` | Text loading căn giữa | *"Đang tóm tắt CV bằng AI..."* |
| `success` | 2 phân vùng nội dung | - Chip thông báo: *✨ Thông tin được trích xuất tự động bởi AI*<br>- **Kỹ năng cốt lõi (Skills):** Các chip tag màu xanh dương `bg-blue-50 text-blue-700`<br>- **Kinh nghiệm (Experience):** Danh sách bullet points các mốc kinh nghiệm thực tế |
| `error / 503` | Khung thông báo màu đỏ | Hiển thị thông báo lỗi rõ ràng (`bg-red-50 text-red-500 rounded-md p-4`). Trình xem CV gốc và các nút quyết định Pass/Reject vẫn hoạt động bình thường, không gián đoạn quy trình. |

---

### 3.5 SkillsAnalysisPanel — Bảng Phân Tích Kỹ Năng

**Vị trí:** Ngăn tác vụ bên phải (40%) trên `/cv-review`, đặt ngay dưới khối AI Match Score.

| Phân loại | Nhãn hiển thị | Icon / Ký hiệu | Dữ liệu hiển thị |
|:---|:---|:---:|:---|
| **Kỹ năng có** | `Kỹ năng có:` | ✅ | Liệt kê các từ khóa yêu cầu từ JD xuất hiện trong CV (`matchedSkills`) |
| **Cần hỏi thêm** | `Cần hỏi thêm:` | ⚠️ | Liệt kê các từ khóa yêu cầu từ JD chưa tìm thấy trong CV (`missingSkills`) |

---

### 3.6 ScorecardPane — Ngăn Chấm Điểm Phỏng Vấn (trên `/scorecard`)

**Header:** Tiêu đề **"Bảng đánh giá (Scorecard)"** — font `type.heading-md`, màu `color.neutral-900`  
**Bố cục ngăn phải (40%):**

1. **Khối AI Match Score:** Hiển thị điểm số phần trăm và văn bản giải thích số lượng từ khóa trùng khớp giữa CV và JD.
2. **Khối ✨ AI Gợi ý câu hỏi:** Danh sách tĩnh các gợi ý định hướng cho người phỏng vấn dựa trên JD và CV (tập trung vào kỹ năng còn thiếu, nhấn mạnh điểm số chỉ là hỗ trợ và cần phỏng vấn viên đánh giá thực tế).
3. **Form chấm điểm chuyên môn:**
   - Trường **Điểm chuyên môn (1 - 10)**: Ô nhập số nguyên bắt buộc, giới hạn `min="1" max="10"`, placeholder: *"Nhập điểm..."*.
   - Trường **Ghi chú đánh giá**: Khung nhập văn bản nhiều dòng bắt buộc (`textarea rows={5}`), placeholder: *"Nhận xét chi tiết về ứng viên..."*.
4. **Nút gửi đánh giá:**
   - Nút **"Lưu đánh giá (Submit)"**: Gửi POST `/api/interviews/:id/scorecard`.
   - **Khóa thời gian tự động:** Nếu ca phỏng vấn chưa tới giờ (`scheduledAt > now`), nút tự động bị vô hiệu hóa (`disabled`) và hiển thị nhãn: *"Chưa đến thời gian phỏng vấn"*.

---

### 3.7 Thông Báo & Phản Hồi Trạng Thái (Alert Banners & Completion Modals)

Hệ thống sử dụng các thành phần phản hồi trạng thái rõ ràng và trực quan:

1. **Inline Alert Banners (Thông báo tĩnh trên trang):**
   - **Thông báo lỗi (Error Banner):** Khung cảnh báo màu đỏ (`bg-red-50 text-red-700 border border-red-200`) hiển thị trực tiếp trên đầu form khi có lỗi dữ liệu hoặc sự cố máy chủ.
   - **Thông báo thành công (Success Banner):** Khung thông báo màu xanh lá (`bg-green-50 text-green-700 border border-green-200`) xuất hiện khi hoàn thành các tác vụ như chốt lịch phỏng vấn.
2. **Modal M03 — Hoàn tất nộp điểm Scorecard:**
   - Xuất hiện dạng lớp phủ hộp thoại trung tâm sau khi lưu điểm thành công.
   - Biểu tượng dấu tích xanh, tiêu đề *"Đã lưu đánh giá thành công!"*, nội dung *"Hệ thống đã ghi nhận điểm và nhận xét của bạn."* kèm nút **"Quay lại danh sách"** điều hướng về `/my-interviews`.

---

### 3.8 Ô Nhập Liệu và Phần Tử Form (Input Fields & Form Elements)

| Trạng thái | Viền (Border) | Màu nền (Background) | Nhãn (Label) |
|:---|:---|:---|:---|
| `default` — Bình thường | 1px `color.neutral-200` | Trắng | `type.body-base`, `color.neutral-900` |
| `focus` — Đang nhập | 2px `color.primary` + `elevation.focus` | Trắng | — |
| `error` — Lỗi | 1px `color.danger` | `color.danger-light` | Kèm thông báo lỗi bên dưới |
| `disabled` — Bị khóa | 1px `color.neutral-200` | `color.neutral-100` | `color.neutral-600` |

**Quy tắc:**
- Bo góc: `radius.md` (8px)
- Thông báo lỗi: font `type.caption`, màu `color.danger`, hiển thị ngay dưới ô nhập
- Placeholder (văn bản gợi ý mờ): màu `color.neutral-600`, kiểu chữ in nghiêng (italic)

---

## 4. Hệ Thống Bố Cục (Layout System)

### 4.1 Màn Hình Duyệt CV — Screening View (Bố Cục Chia Đôi / Split Layout trên `/cv-review`)

```
┌──────────────────────────────────────────────────────┐
│  Header: Ứng viên: Email | Vị trí: Job Title          │
├──────────────────────┬───────────────────────────────┤
│                      │  Ngăn Phân Tích AI            │
│  Trình xem CV        │  ┌───────────────────────┐   │
│  (PDF iframe / TXT)  │  │ AI Match Score (%)    │   │
│  + Nút Tóm tắt AI    │  └───────────────────────┘   │
│  60%                 │  ┌───────────────────────┐   │
│                      │  │ Phân tích kỹ năng     │   │
│                      │  │ (Kỹ năng có / thiếu)  │   │
│                      │  └───────────────────────┘   │
│                      │  ─────────────────────────   │
│                      │  [ Từ chối ]   [ Đạt (Pass) ] │
│                      │  40%                          │
├──────────────────────┴───────────────────────────────┤
│  Audit Log / Modal M01 khi bấm Từ chối (Reject)      │
└──────────────────────────────────────────────────────┘
```

---

### 4.2 Màn Hình Điền Scorecard — Scorecard View (Bố Cục Chia Đôi trên `/scorecard`)

```
┌──────────────────────────────────────────────────────┐
│  CV Ứng viên: Job Title                              │
├──────────────────────┬───────────────────────────────┤
│  Trình xem CV        │  Bảng đánh giá (Scorecard)    │
│  (PDF iframe / TXT)  │  ─────────────────────────   │
│  60%                 │  AI Match Score (%)           │
│                      │  ✨ AI Gợi ý câu hỏi          │
│                      │  ─────────────────────────   │
│                      │  Điểm chuyên môn (1 - 10) *   │
│                      │  Ghi chú đánh giá *           │
│                      │  [ Lưu đánh giá (Submit) ]    │
│                      │  40%                          │
└──────────────────────┴───────────────────────────────┘
```

---

## 5. Điểm Thích Ứng Màn Hình (Responsive Breakpoints)

> **Responsive** = giao diện tự điều chỉnh theo kích thước màn hình. **Breakpoint** = ngưỡng chiều rộng mà tại đó bố cục thay đổi.

| Breakpoint | Chiều rộng | Bố cục |
|:---|:---|:---|
| Desktop (Máy tính — ưu tiên) | ≥ 1280px | Split-view 60/40 (bố cục chia đôi chính) |
| Tablet (Máy tính bảng) | 768–1279px | Split-view 50/50 hoặc xếp chồng (stacked) với nút toggle chuyển pane |
| Mobile (Điện thoại) | < 768px | Một cột dọc, dùng tab để chuyển giữa ngăn CV và ngăn AI |

---

## 6. Danh Sách Kiểm Tra Khả Năng Tiếp Cận (Accessibility Checklist)

> **Accessibility** (viết tắt: a11y) = khả năng tiếp cận — đảm bảo người khuyết tật (khiếm thị, chỉ dùng bàn phím, dùng screen reader) vẫn sử dụng được toàn bộ hệ thống.

- [ ] Tỷ lệ tương phản màu ≥ 4.5:1 cho tất cả chữ (chuẩn AA theo WCAG)
- [ ] Vòng focus (focus ring) hiển thị rõ trên **MỌI** phần tử có thể tương tác
- [ ] Thông báo lỗi không dùng màu làm cách **DUY NHẤT** — luôn kèm văn bản giải thích
- [ ] Vùng `aria-live` cho nội dung thay đổi động (AI loading, Alert Banner, Modal)
- [ ] Focus trap (bẫy focus bàn phím) bên trong Modal khi đang mở
- [ ] Điều hướng bàn phím: Tab / Shift+Tab / Enter / Escape hoạt động đúng trên tất cả form

---

## 7. Lịch Sử Thay Đổi (Change Log)

| Phiên bản | Ngày | Nội dung thay đổi | Tác giả |
|:---|:---|:---|:---|
| 1.0 | 2026-08-25 | Tạo lần đầu — design tokens + 4 component cơ bản | UX/UI |
| 1.1 | 2026-09-15 | DES-01..04 từ Usability Test: đổi vị trí badge, thêm nhãn pane, cập nhật modal, thêm CTA banner lỗi | UX/UI |
