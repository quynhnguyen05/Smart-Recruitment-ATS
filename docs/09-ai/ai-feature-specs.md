# AI Feature Spec — AI Screening Assistant

## 1. Business Value

Giảm thời gian Recruiter đọc CV thủ công bằng cách cung cấp tóm tắt và điểm phù hợp (match score) có giải thích rõ ràng.

AI không thay thế quyết định của Recruiter, theo BR-ATS-01 và BR-ATS-02 đã chốt từ Bài 1.

## 2. Scope

### 2.1. AI Feature chính

Tập trung vào US-ATS-05 — Match Score. Đây là AI feature chính và có eval set đầy đủ.

### 2.2. AI Features bổ sung

- US-ATS-04 — CV Summary: Should. Nếu triển khai, eval set ở mức đơn giản.
- US-ATS-08 — Question Suggestion: Should. Nếu triển khai, eval set ở mức đơn giản.

Hai feature trên không bắt buộc phải triển khai đầy đủ như Match Score.

## 3. AI Context

AI chỉ nhận các dữ liệu cần thiết để đánh giá mức độ phù hợp giữa Job Description và CV đã parse.

### 3.1. Job Description

Lấy từ bảng `JobPosting`:

- `title`
- `description`
- `requirements`

### 3.2. Parsed CV

Sử dụng dữ liệu CV đã được parse:

- `skills`
- `yearsOfExperience`
- `education`

### 3.3. Data Exclusion

Không đưa vào AI:

- Email
- Số điện thoại
- Các thông tin định danh cá nhân không cần thiết cho việc tính match score

## 4. US-ATS-05 — Match Score

### 4.1. Structured Output

Backend phải validate response từ AI trước khi lưu vào `MatchResult` hoặc hiển thị trên UI.

#### Response Schema

Response từ AI phải có cấu trúc:

    {
      "summary": "string",
      "matchScore": 0,
      "matchedSkills": ["string"],
      "missingSkills": ["string"],
      "confidence": "high | medium | low"
    }

### 4.2. Output Requirements

| Field | Requirement |
|---|---|
| `summary` | Tóm tắt ngắn về mức độ phù hợp của ứng viên |
| `matchScore` | Điểm phù hợp trong khoảng `0–100` |
| `matchedSkills` | Các kỹ năng được xác định là phù hợp giữa Job Description và CV |
| `missingSkills` | Các kỹ năng/yêu cầu quan trọng chưa được thể hiện trong CV |
| `confidence` | Chỉ nhận `high`, `medium` hoặc `low` |

### 4.3. Mapping với `MatchResult`

| AI Output | `MatchResult` |
|---|---|
| `matchScore` | `matchScore` |
| `matchedSkills` | `matchedSkills` |
| `missingSkills` | `missingSkills` |
| `summary` | `explanation` |
| `confidence` | Không bắt buộc lưu DB; chỉ sử dụng trong validation/response |

## 5. Validation Rules

Backend chịu trách nhiệm validate toàn bộ AI response trước khi lưu hoặc hiển thị.

- `matchScore` ngoài khoảng `0–100` → reject response và sử dụng fallback.
- `matchedSkills` và `missingSkills` cùng rỗng → lưu `MatchResult.status = INSUFFICIENT_DATA`.
- `INSUFFICIENT_DATA` không được coi là `matchScore = 0`.
- Response không parse được thành JSON đúng schema → retry gọi AI 1 lần.
- Nếu retry vẫn không hợp lệ → lưu `MatchResult.status = ERROR` và sử dụng fallback.
- Response hợp lệ → lưu `MatchResult.status = OK`.
- `matchScore` có thể là `null` khi:
  - `status = INSUFFICIENT_DATA`
  - `status = ERROR`
- Không lưu hoặc hiển thị response AI trước khi hoàn tất validation.

## 6. Fallback & Error Handling

Khi AI timeout, API lỗi hoặc trả về response không hợp lệ:

- Recruiter vẫn xem được CV gốc thông qua `Application.cvUrl`.
- Recruiter vẫn có thể thực hiện Pass/Reject thủ công.
- Không sử dụng `matchScore = 0` để biểu thị AI bị lỗi.
- Không đủ dữ liệu để đánh giá → `MatchResult.status = INSUFFICIENT_DATA`.
- AI/API gặp lỗi → `MatchResult.status = ERROR`.
- Backend phải log lỗi ở server để phục vụ debugging.
- Không hiển thị raw error, stack trace hoặc thông tin kỹ thuật nhạy cảm trên UI.

## 7. Human-in-the-Loop

AI chỉ đóng vai trò hỗ trợ Recruiter đánh giá ứng viên.

- AI không tự động quyết định Pass/Reject.
- Recruiter vẫn là người đưa ra quyết định cuối cùng.
- Match Score và explanation chỉ là thông tin hỗ trợ cho quá trình đánh giá.

## 8. Status Flow

    AI Request
        │
        ▼
    AI Response
        │
        ▼
    Backend Validation
        │
        ├── Valid ───────────────► status = OK
        │                           │
        │                           ▼
        │                       Save Result
        │
        ├── Insufficient Data ───► status = INSUFFICIENT_DATA
        │                           │
        │                           ▼
        │                       matchScore = null
        │
        └── Invalid / Error
                │
                ▼
            Retry 1 lần
                │
                ├── Valid ────────► status = OK
                │
                └── Still Invalid ► status = ERROR
                                    │
                                    ▼
                             Use Fallback

## 9. Final AI Response Contract

Backend chỉ chấp nhận AI response theo đúng schema sau:

    {
      "summary": "string",
      "matchScore": 0,
      "matchedSkills": ["string"],
      "missingSkills": ["string"],
      "confidence": "high | medium | low"
    }

### Contract Requirements

- `summary`: kiểu `string`.
- `matchScore`: kiểu `number`, giá trị từ `0` đến `100`.
- `matchedSkills`: mảng `string`.
- `missingSkills`: mảng `string`.
- `confidence`: chỉ nhận một trong ba giá trị:
  - `high`
  - `medium`
  - `low`

Response không đúng schema phải được xử lý theo Validation Rules và Fallback & Error Handling ở các mục trên.

## 10. Guardrail đã áp dụng (đối chiếu ngược với Business Rules đã chốt ở Bài 1)
- BR-ATS-01: AI không bao giờ tự đổi Application.status — chỉ Recruiter bấm nút mới đổi.
- BR-ATS-02: Mọi match score đều kèm matchedSkills/missingSkills, không hiển thị số trần trụi.
- Schema validation ở tầng server chặn output sai định dạng trước khi tới UI — không tin
  tưởng tuyệt đối output AI trả về.