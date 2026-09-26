# Output #28 — Bug Report

---

## BUG-01 — Scorecard Summary hiển thị "N/A" khi chỉ có 1 vòng chấm điểm

**ID:** BUG-01
**Mức độ:** Medium
**Trạng thái:** Open
**Phát hiện:** Sprint 3, QA Review — phân tích code `backend/app/api/scorecards/summary/route.ts`

---

### Summary

`GET /api/scorecards/summary` trả về `roundTwoScore: null` cho ứng viên chỉ qua 1 vòng phỏng vấn — đây là hành vi đúng về mặt dữ liệu. Tuy nhiên Frontend hiển thị `null` thành chữ **"N/A"** ở cột *Vòng 2* trong bảng Scorecard Summary, khiến Hiring Manager đọc nhầm là "ứng viên đã được chấm nhưng điểm không hợp lệ" thay vì "vòng 2 chưa diễn ra". Đồng thời trường `average` tính bình quân chỉ từ `availableScores[0]` — tức chính là điểm vòng 1 — mà không có label nào thể hiện rằng trung bình này chỉ dựa trên 1 vòng.

---

### Environment

- **Nền tảng:** Frontend Next.js 16 / Backend Next.js API Route
- **Endpoint:** `GET /api/scorecards/summary`
- **File backend:** `backend/app/api/scorecards/summary/route.ts`
- **Màn hình:** `/scorecard-summary` (Hiring Manager view)
- **Điều kiện:** Application có đúng 1 InterviewRound đã có Scorecard

---

### Steps to Reproduce

1. Đăng nhập với tài khoản `hm@ats.demo` / `Demo@123`.
2. Recruiter tạo 1 InterviewRound và Interviewer nộp Scorecard (score = 85).
3. Hiring Manager mở màn hình **Scorecard Summary**.
4. Quan sát cột "Điểm Vòng 2" và cột "Trung bình".

---

### Expected vs Actual

| Trường | Expected | Actual |
|---|---|---|
| Cột Vòng 2 | Hiển thị "—" hoặc "Chưa có" rõ ràng | Hiển thị `null` được render thành "N/A" |
| Cột Trung bình | "85 (1 vòng)" hoặc tooltip cảnh báo | Hiển thị `85` — không có chú thích số vòng |
| Tính năng đọc | HM hiểu "chưa có dữ liệu vòng 2" | HM dễ nhầm là vòng 2 đã chấm nhưng lỗi |

---

### Root Cause (Phân tích code)

**Backend** — `backend/app/api/scorecards/summary/route.ts`, dòng 38–39:

```typescript
roundOneScore: availableScores[0] ?? null,
roundTwoScore: availableScores[1] ?? null,   // null nếu chỉ có 1 vòng
average:       availableScores.length
                 ? Number((...).toFixed(2))
                 : null,
```

Backend trả `roundTwoScore: null` — đây là dữ liệu đúng. Vấn đề nằm ở **Frontend**: component bảng Scorecard Summary render `null` thành chuỗi "N/A" bằng JavaScript optional chaining mà không phân biệt *"chưa có vòng"* với *"vòng có lỗi"*.

Ngoài ra, trường `average` không kèm metadata `roundsCount` — Frontend không biết trung bình được tính từ bao nhiêu vòng.

---

### Proposed Solution

**Backend** — Bổ sung `roundsCount` vào response:

```typescript
return {
  id,
  candidateName: ...,
  position: ...,
  roundOneScore: availableScores[0] ?? null,
  roundTwoScore: availableScores[1] ?? null,
  roundsCount:   availableScores.length,   // <-- thêm field này
  average,
  status: ...,
};
```

**Frontend** — Cập nhật render logic:

```tsx
// Thay vì: {row.roundTwoScore ?? 'N/A'}
// Dùng:
{row.roundsCount < 2 ? '—' : row.roundTwoScore ?? 'Lỗi'}

// Hiển thị average kèm context:
{row.average !== null ? `${row.average} (${row.roundsCount} vòng)` : '—'}
```

---

### Regression Risk

**Thấp** — Chỉ ảnh hưởng display logic của màn hình Scorecard Summary. Không chạm đến business logic tạo/cập nhật Scorecard.

---

### Test Plan

| Layer | Test case | Expected |
|---|---|---|
| Unit | Trả về `roundsCount: 1` khi chỉ có 1 Scorecard | `roundsCount === 1` |
| Integration | `GET /api/scorecards/summary` với 1 round | `roundTwoScore === null`, `roundsCount === 1` |
| UI Manual | Màn hình HM với ứng viên 1 vòng | Cột Vòng 2 hiển thị "—", Trung bình hiển thị "85 (1 vòng)" |

---

## BUG-02 — Orphan CV file khi DB create() thất bại

**ID:** BUG-02
**Mức độ:** High
**Trạng thái:** Open — phát hiện trong Code Review Output #25
**File:** `backend/app/api/applications/route.ts`, dòng 86–94

### Summary

`writeFile()` ghi file CV lên disk **trước** `prisma.application.create()`. Nếu DB thất bại (network timeout, constraint race condition), file CV đã tồn tại trên disk nhưng không có Application record tham chiếu → orphan file tích lũy vô hạn.

### Root Cause

```typescript
// Hiện tại — sai thứ tự:
await writeFile(path.join(storageDir, storedName), ...);   // bước 1
const application = await prisma.application.create(...);  // bước 2 — nếu fail, bước 1 không rollback
```

### Solution

```typescript
// Đảo thứ tự:
const application = await prisma.application.create(
  { data: { jobId, candidateId, cvUrl: storedName } }      // bước 1
);
await writeFile(path.join(storageDir, storedName), ...);   // bước 2 chỉ chạy nếu bước 1 thành công
```

Hoặc wrap bằng try/finally để unlink file nếu create() throw.

### Regression Risk: Medium — chạm trực tiếp vào flow lưu CV.

---
*Nguồn phân tích: backend/app/api/scorecards/summary/route.ts, backend/app/api/applications/route.ts*
