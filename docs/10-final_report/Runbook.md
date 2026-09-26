# Output #30 — README / Runbook

**Dự án:** Smart Recruitment ATS
**Repository:** https://github.com/quynhnguyen05/Smart-Recruitment-ATS
**Stack:** Next.js 16 (Backend API Routes) + Next.js (Frontend) + PostgreSQL (Supabase) + Prisma ORM
**Phiên bản:** v1.0.0

---

## 1. Quick Start (Local Development)

### Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | >= 20.x |
| npm | >= 10.x |
| Python | >= 3.11 (để chạy test suite) |
| PostgreSQL | >= 15 (hoặc Supabase account) |

---

### Bước 1 — Clone & Cài đặt dependencies

```bash
git clone https://github.com/quynhnguyen05/Smart-Recruitment-ATS.git
cd Smart-Recruitment-ATS

# Cài dependencies root (test runner vitest, playwright, supertest)
npm install

# Cài dependencies backend
cd backend && npm install && cd ..

# Cài dependencies frontend
cd frontend && npm install && cd ..
```

---

### Bước 2 — Cấu hình môi trường Backend

```bash
cd backend
cp .env.example .env
```

Mở file `.env` và điền các giá trị:

```env
# Supabase Public API
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_<your-key>

# JWT Secret — dùng chuỗi random đủ dài (>= 32 ký tự)
JWT_SECRET=ats-secret-key-smart-recruitment-2026

# Supabase PostgreSQL (Prisma connection pooling)
DATABASE_URL="postgresql://postgres.<project>:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<project>:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> Lưu ý: Thay [YOUR-PASSWORD] bằng mật khẩu Database Supabase. Không commit file .env vào git.

---

### Bước 3 — Cấu hình môi trường Frontend

```bash
cd frontend
cp .env.example .env.local
```

Điền `NEXT_PUBLIC_API_URL=http://localhost:3001` (URL backend đang chạy).

---

### Bước 4 — Database Migration & Seed

```bash
cd backend

# Chạy migration để tạo schema
npx prisma migrate deploy

# Hoặc trong dev (tạo migration mới nếu schema thay đổi):
npx prisma migrate dev --name init

# Tạo dữ liệu mẫu (seed)
npx prisma db seed
```

Sau seed, các tài khoản demo được tạo:

| Email | Password | Role |
|---|---|---|
| admin@ats.demo | Demo@123 | ADMIN |
| recruiter@ats.demo | Demo@123 | RECRUITER |
| hm@ats.demo | Demo@123 | HIRING_MANAGER |
| interviewer@ats.demo | Demo@123 | INTERVIEWER |
| candidate@ats.demo | Demo@123 | CANDIDATE |
| minh.anh.cv01@ats.demo | Demo@123 | CANDIDATE |

Job mẫu: "Backend Developer" (status: PUBLISHED, requirements: Java, Spring Boot, REST API, PostgreSQL, Redis, Docker, Git, Microservices)

---

### Bước 5 — Chạy ứng dụng

```bash
# Từ thư mục root — chạy song song backend (port 3001) và frontend (port 3000)

# Terminal 1: Backend
npm run dev:backend
# Tương đương: cd backend && npm run dev

# Terminal 2: Frontend
npm run dev:frontend
# Tương đương: cd frontend && npm run dev
```

Truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

---

### Bước 6 — Xác minh hệ thống hoạt động

```bash
# Test login trả token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ats.demo","password":"Demo@123"}'
# Expected: {"token":"<jwt>","role":"ADMIN"}

# Test lấy danh sách jobs (cần token)
curl http://localhost:3001/api/jobs \
  -H "Authorization: Bearer <token>"
# Expected: JSON array chứa job "Backend Developer"
```

---

## 2. Chạy Test Suite

```bash
# Từ thư mục root

# Chạy toàn bộ test Python (unit + integration + security)
npm run test:py
# Tương đương: python -m pytest tests/test_ats_automation.py -v

# Chạy từng nhóm test riêng
python -m pytest tests/test_backend_unit_tc001_tc084.py -v         # Unit tests
python -m pytest tests/test_api_endpoints_tc085_tc125.py -v        # Integration/API tests
python -m pytest tests/test_frontend_ui_tc126_tc165.py -v          # Frontend UI tests
python -m pytest tests/test_security_edgecases_tc166_tc200.py -v   # Security tests

# Chạy vitest (nếu có test JS)
npm test

# Chạy Playwright E2E
cd tests && npx playwright test
```

Lint và typecheck:

```bash
cd backend
npm run lint          # eslint
npx tsc --noEmit      # typecheck
```

---

## 3. Build Production

```bash
# Build backend
npm run build:backend
# Tương đương: cd backend && npm run build

# Build frontend
npm run build:frontend
# Tương đương: cd frontend && npm run build

# Chạy production backend (sau khi build)
cd backend && npm start   # port 3001

# Chạy production frontend (sau khi build)
cd frontend && npm start  # port 3000
```

---

## 4. Deploy

1. Chạy `npx prisma migrate deploy` trên server production (cần DIRECT_URL).
2. Set đầy đủ biến môi trường production (JWT_SECRET mạnh, DATABASE_URL thật).
3. Deploy backend lên hosting (Vercel / Railway / EC2).
4. Deploy frontend lên hosting (Vercel).
5. Trỏ NEXT_PUBLIC_API_URL ở frontend về URL backend production.
6. Chạy smoke test sau deploy (xem mục 6 Release Checklist Output #29).
7. Kiểm tra AuditLog qua Supabase dashboard sau vài thao tác thật.

---

## 5. Rollback & Forward Fix

### Khi nào rollback app:

App release fail **trước khi** migration-dependent writes xảy ra → rollback application về version trước an toàn.

```bash
# Ví dụ với Vercel:
vercel rollback [deployment-url]
```

### Khi nào forward fix:

Migration irreversible đã chạy (ví dụ đã thêm cột NOT NULL) → **không downgrade schema**. Deploy forward-fix patch thay thế.

```bash
# Tạo migration sửa lỗi mới
npx prisma migrate dev --name hotfix_<description>
npx prisma migrate deploy  # trên production
```

### Reset DB trong staging (cẩn thận — mất data):

```bash
cd backend
npx prisma migrate reset   # xóa toàn bộ dữ liệu + migrate + seed lại
```

---

## 6. Known Limitations

- CV dạng DOCX không trích xuất được text trong `GET /api/applications/:id/match` → trả `INSUFFICIENT_DATA`. Đây là thiết kế có chủ ý (không dùng LLM, chỉ keyword matching).
- Conflict check lịch phỏng vấn kiểm tra theo exact `scheduledAt` datetime — không check overlap khoảng thời gian.
- File CV lưu trên local filesystem (`storage/cv/`); cần chuyển sang Supabase Storage / S3 cho môi trường production distributed.
- BUG-01: Scorecard Summary hiển thị null thay vì "—" khi ứng viên chỉ có 1 vòng (xem Output #28).
- BUG-02: Orphan CV file nếu DB create() thất bại sau writeFile() (xem Output #28).

---

*Runbook version: 1.0.0 | Ngày cập nhật: 2026-09-26 | Maintainer: Smart Recruitment ATS Team*
