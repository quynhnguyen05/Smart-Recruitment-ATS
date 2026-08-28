# Screen Inventory & State Matrix

## 1. Screen Flow (Sơ đồ luồng màn hình)
- **FLOW A (CV Screening):** `Job List` → Click Application → `Screening View (Loading)` → `Screening View (Split-view Success)`
- **FLOW B (Human Confirmation):** `Screening View` → Click Pass/Reject → `Confirmation Modal (Overlay)` → Click Xác nhận → `Screening View (Success Toast)`
- **FLOW C (Question Suggestion):** `Interview Schedule` → Click Bắt đầu phỏng vấn → `Scorecard View (Loading)` → `Scorecard View (Gợi ý câu hỏi)` → Edit/Delete → `Scorecard View (Draft/Submitting)`
- **FLOW D (AI Fallback):** `Screening View` → Bấm Phân tích CV → `Processing` → Network Error → `Screening View (Manual Fallback Form)`

## 2. Screen Inventory & State Matrix (Ma trận trạng thái)
| Tên Màn hình / Component | Trạng thái (States) bắt buộc phải có | Component UI tương ứng |
| :--- | :--- | :--- |
| **1. Màn hình Screening (Split-view)** | `Idle` (Chưa thao tác), `Loading` (Đang parse CV), `Empty` (CV trống/hỏng), `Fallback` (Lỗi mạng, chuyển form nhập tay) | `AISummaryCard`, `MatchScoreBadge` |
| **2. Cửa sổ Xác nhận (Modal)** | `Hidden` (Mặc định), `Visible - Default` (Chưa tick xác nhận), `Visible - Enabled` (Đã tick), `Loading` (Đang submit) | `ConfirmationModal`, `DecisionButton` |
| **3. Màn hình Điền Scorecard** | `Loading` (Đang sinh câu hỏi), `Success` (Hiển thị list), `Edit-mode` (Đang sửa câu hỏi), `Error` (Bỏ trống trường bắt buộc) | `ScorecardForm`, `QuestionItem` |
| **4. Bảng điểm Match Score** | `High` (≥ 80%), `Medium` (50-79%), `Low` (< 50%), `Error` (Không tính được) | `MatchScoreBadge` |
