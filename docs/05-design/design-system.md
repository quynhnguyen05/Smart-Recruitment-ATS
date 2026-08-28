# Output #16 - Figma / Design System Handoff (Kinetic Talent System)

## 1. DESIGN TOKENS

| Token | Value | Use |
| :--- | :--- | :--- |
| `color.primary` | `#1D4ED8` | Primary actions, navigation, active selection states. |
| `color.success` | `#059669` | "High Match" scores, approved statuses, successful AI completions. |
| `color.warning` | `#D97706` | "Medium Match" scores, manual verification needed. |
| `color.danger` | `#DC2626` | "Low Match" scores, rejections, critical system errors. |
| `color.surface-gray` | `Gray 50` / `Gray 200` | Gray 50 cho nền background (Level 0), Gray 200 (1px solid) cho viền input và card inactive. |
| `radius.md` | `8px` | Bán kính bo góc chuẩn cho Button, Input fields, Cards, Modals. |
| `radius.full` | `9999px` | Bán kính hình viên thuốc (Pill) dành riêng cho MatchScoreBadge. |
| `space.grid` | `8px scale` | Hệ thống lưới 8px. Mọi padding, margin phải là bội số của 8px. |
| `layout.split` | `60% / 40%` | 60% màn hình trái cho PDF Viewer, 40% màn hình phải cho Insights Panel. |
| `type.body-base` | `14/20` (Inter) | Cỡ chữ đọc chính: nội dung chi tiết ứng viên, tóm tắt AI. |
| `type.caption` | `12/16` (Inter) | Metadata, nhãn phụ (secondary labels). |
| `type.headline-sm`| `20/28` (Inter) | Tiêu đề cho các Modal (ví dụ: "Xác nhận quyết định"). |
| `elevation.level-1`| `4px blur, 5% op` | Đổ bóng nhẹ cho Cards và Score widgets. |
| `elevation.level-2`| `12px blur, 10% op` | Đổ bóng sâu cho Modals và Dropdowns để tạo điểm nhấn ra quyết định. |

## 2. COMPONENT INVENTORY

| Component | Variants/States | Accessibility / Behavior |
| :--- | :--- | :--- |
| **DecisionButton** | `default`, `hover`, `disabled`, `loading` | Bo góc 8px. Hover: Tối hơn 10%. Disabled: Nền xám nhạt, chữ xám đậm. Loading: Thay text bằng spinner trắng 16px, giữ nguyên chiều rộng nút để tránh layout shift. |
| **MatchScoreBadge** | `high`, `medium`, `low` | Khung hình Pill (bo tròn hoàn toàn). Màu nền nhạt (Light) và màu chữ đậm (Dark) tương ứng theo từng trạng thái Xanh lá/Cam/Đỏ. |
| **ConfirmationModal** | `default`, `loading`, `success` | Container màu trắng, bo góc 8px, đổ bóng Level 2. Tiêu đề `Headline-sm`. Checkbox "Tôi đã đánh giá CV" bắt buộc phải tick thì mới Enable nút DecisionButton. |
| **AISummaryCard** | `loading`, `success`, `fallback` | Loading: Dùng skeleton pulse, hiển thị "Hệ thống AI đang phân tích..." ở cỡ chữ `Body-sm`. Success: Lưới 2 cột (Trái: Matched - icon xanh / Phải: Missing - icon cam). Fallback: Banner viền đỏ kèm Text Area. |
| **Input Fields** | `default`, `focus` | Bo góc 8px, viền mặc định 1px Gray 200. Khi Focus, viền đổi sang Primary Blue kèm hiệu ứng tỏa sáng (outer glow) 2px. |

## 3. UX COPY

| Context | Copy |
| :--- | :--- |
| **AI Loading** | Hệ thống AI đang phân tích... |
| **Match Reason** | Lý do khớp: Ứng viên có kỹ năng [X]. Kỹ năng thiếu: Chưa thấy đề cập [Y]. |
| **Confirmation Modal** | **Tiêu đề:** Xác nhận quyết định<br>**Nội dung:** Bạn đang quyết định trạng thái của ứng viên. Vui lòng xác nhận quyết định này dựa trên đánh giá thực tế của bạn, không hoàn toàn phụ thuộc vào AI.<br>**Checkbox:** Tôi đã đánh giá CV |
| **AI Network Error** | Tính năng AI đang gián đoạn. Vui lòng xem bản gốc CV và thực hiện thao tác thủ công. |
| **Empty Questions** | AI chưa đủ dữ liệu để gợi ý. Vui lòng tạo câu hỏi phỏng vấn thủ công. |
| **Scorecard Draft** | Bản nháp đánh giá phỏng vấn đã được lưu tạm. |
| **Success Offer** | Đã lưu quyết định Offer thành công. |
