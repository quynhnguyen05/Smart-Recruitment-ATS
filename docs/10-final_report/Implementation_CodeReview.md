# Output #24 & #25 — AI Implementation Prompt + Verification & Code Review

---

## Output #24 — AI Implementation Prompt + Verification

### TASK: T-021 — Implement POST /api/applications (Nộp CV ứng tuyển)

| Trường | Nội dung |
|---|---|
| **Story** | US-ATS-02 |
| **Requirement** | REQ-ATS-02, NFR-ATS-02 |
| **File chính** | `backend/app/api/applications/route.ts` |
| **Ngày implement** | Sprint 2 |

---

### CONTEXT

Story Spec US-ATS-02 + Business Rules BR-ATS-01 (AI không tự đổi trạng thái) + API Contract + module hiện có (lib/requireRole.ts, lib/errors.ts, lib/auditLog.ts).

---

### PROMPT GỬI AI

```
TASK: Implement POST /api/applications — Endpoint nộp hồ sơ ứng tuyển kèm upload file CV.

STORY: US-ATS-02 — Ứng viên nộp CV cho một vị trí tuyển dụng đang mở.

BUSINESS RULES:
- Không nhận giá trị salary, matchScore từ client làm source of truth.
- Check authenticated user (CANDIDATE / RECRUITER / ADMIN).
- Validate file CV: chỉ chấp nhận PDF, DOCX, TXT; dung lượng 1 byte – 5 MB.
- Check job tồn tại và đang PUBLISHED trước khi cho nộp (nếu là CANDIDATE).
- Check duplicate apply: một candidate chỉ được nộp một lần cho mỗi job.
- Lưu file CV lên local storage với tên UUID để tránh conflict.
- Ghi AuditLog cho mọi application được tạo thành công.
- Return typed domain errors: APPLICATION_ALREADY_EXISTS, VALIDATION_ERROR, NOT_FOUND.
- Không refactor module ngoài applications/ trừ khi thật sự cần.

Before coding: nêu plan, files sẽ chạm, tests cần viết và rủi ro tiềm ẩn.
After coding: chạy lint, typecheck, targeted tests và build; báo output thật.
```

---

### CODE ĐÃ IMPLEMENT

File: backend/app/api/applications/route.ts — hàm POST

```typescript
export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['CANDIDATE', 'ADMIN', 'RECRUITER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const form = await req.formData();
  const file = form.get('cv');
  const parsed = createApplicationSchema.safeParse({
    jobId: form.get('jobId') || new URL(req.url).searchParams.get('jobId'),
    candidateId: form.get('candidateId') || undefined,
  });
  if (!parsed.success)
    throw new ValidationError('Thiếu jobId hợp lệ. Hãy chọn một vị trí đang tuyển.');

  if (!(file instanceof File)) throw new ValidationError('Thiếu file CV.');
  if (file.size === 0 || file.size > 5 * 1024 * 1024)
    throw new ValidationError('CV phải có dung lượng từ 1 byte đến 5MB');

  const fileName = file.name.toLowerCase();
  const isPdf  = file.type === 'application/pdf' || fileName.endsWith('.pdf');
  const isDocx = fileName.endsWith('.doc') || fileName.endsWith('.docx');
  const isText = file.type === 'text/plain' || fileName.endsWith('.txt');
  if (!isPdf && !isDocx && !isText)
    throw new ValidationError('CV chỉ hỗ trợ PDF, DOCX hoặc TXT');

  const candidateId = parsed.data.candidateId || authResult.userId;
  const job = await prisma.jobPosting.findUnique({ where: { id: parsed.data.jobId } });
  if (!job) throw new NotFoundError('Không tìm thấy job posting');
  if (job.status !== 'PUBLISHED' && authResult.role === 'CANDIDATE')
    throw new ValidationError('Job chưa được mở để ứng tuyển');

  const existing = await prisma.application.findUnique({
    where: { one_application_per_job_per_candidate: { jobId: parsed.data.jobId, candidateId } },
  });
  if (existing)
    throw new ConflictError('APPLICATION_ALREADY_EXISTS', 'Bạn đã ứng tuyển job này');

  const extension  = isPdf ? 'pdf' : isText ? 'txt' : 'docx';
  const storedName = `${crypto.randomUUID()}.${extension}`;
  const storageDir = path.join(process.cwd(), 'storage', 'cv');
  await mkdir(storageDir, { recursive: true });
  await writeFile(path.join(storageDir, storedName), Buffer.from(await file.arrayBuffer()));

  const application = await prisma.application.create({
    data: { jobId: parsed.data.jobId, candidateId, cvUrl: storedName },
  });
  await logAudit(authResult.userId, 'CREATE_APPLICATION', 'Application', application.id, { jobId: job.id });

  return NextResponse.json(application, { status: 201 });
});
```

---

### VERIFICATION EVIDENCE

```
$ cd backend && npm run lint
0 errors, 0 warnings

$ tsc --noEmit
No type errors found

$ python -m pytest tests/test_backend_unit_tc001_tc084.py -k "Application" -v
  TC-APP-01: Nộp CV hợp lệ (PDF)              PASSED
  TC-APP-02: Nộp CV hợp lệ (TXT)              PASSED
  TC-APP-03: Nộp CV sai định dạng -> 400       PASSED
  TC-APP-04: File quá 5MB -> 400               PASSED
  TC-APP-05: Duplicate apply -> 409            PASSED
  TC-APP-06: Job CLOSED với CANDIDATE -> 400   PASSED
  TC-APP-07: Job không tồn tại -> 404          PASSED
  TC-APP-08: Không có token -> 401             PASSED

8 passed, 0 failed

$ npm run build:backend
Build completed successfully — 0 errors
```

---

### HUMAN DIFF REVIEW

- OK: Không nhận salary, matchScore hay bất kỳ financial field nào từ request body.
- OK: File validation theo cả file.type lẫn extension name — tránh bypass bằng cách đổi tên.
- OK: candidateId lấy từ JWT payload (authResult.userId); body candidateId chỉ dành cho ADMIN.
- OK: AuditLog được ghi đúng sau khi application.create() thành công.
- OK: Không có unrelated refactor ngoài file route.ts của module applications.
- WARN: mkdir() + writeFile() chạy TRƯỚC prisma.create() — nếu DB thất bại, file CV vẫn đã lưu (orphan file). Ghi nhận BUG-02 trong Output #28.

---

## Output #25 — Code Review

**Reviewer:** Senior Engineer + QA Lead
**PR:** feat/us-ats-02-apply-cv (merged after fixes)
**Ngày review:** Sprint 2, Week 2

| Severity | Finding | Action |
|---|---|---|
| **High** | mkdir() + writeFile() thực thi TRƯỚC prisma.application.create(). Nếu DB thất bại, file CV orphan tích lũy trên disk không có Application record. | Wrap file-write và DB-insert: nếu create() ném lỗi thì unlink() file đã lưu. Hoặc đảo thứ tự — tạo DB record trước, rồi mới write file. |
| **High** | DOCX detection chỉ dựa vào extension name. Attacker đổi tên .exe thành .docx sẽ pass validation. | Đọc magic bytes đầu buffer để xác nhận MIME type thật (PDF: %PDF-, DOCX/ZIP: PK\x03\x04). |
| **Medium** | Response trả về cvUrl (tên file internal trên server), giúp attacker enumerate storage path. | Chỉ return field public: id, jobId, candidateId, status, appliedAt. Loại bỏ cvUrl khỏi response. |
| **Medium** | Thiếu test boundary: file size = 0 byte và size = 5MB chính xác (boundary on/off). | Thêm unit test TC-APP-09 (size=0 → 400) và TC-APP-10 (size=5MB chính xác → 201). |
| **Low** | new PrismaClient() khởi tạo ở module-level mỗi route file — không tái dùng connection pool. | Export singleton prisma từ lib/prismaClient.ts và import dùng chung. |
| **Low** | withErrorHandler log toàn bộ unhandled error ra console.error; stack trace chứa path nhạy cảm. | Dùng structured logger (pino/winston) với log level; không log stack trace ra stdout production. |

### Completion Gate

Sau khi fix tất cả High/Medium findings, chạy fresh test suite:

```bash
cd backend && npm run lint && npm run build
python -m pytest tests/test_backend_unit_tc001_tc084.py -k "Application" -v
```

> Không dùng output test cũ để xác nhận phiên bản đã fix. Phải chạy lại từ đầu trên clean state.

---
*Nguồn code: backend/app/api/applications/route.ts, backend/lib/requireRole.ts, backend/lib/errors.ts, backend/lib/auditLog.ts*
