
# PRD - Smart Recruitment & ATS

## Problem
Recruiter và Hiring Manager cần công cụ hỗ trợ AI để sàng lọc, phỏng vấn và ra quyết định
tuyển dụng nhanh hơn, nhưng vẫn giữ toàn quyền kiểm soát quyết định cuối.

## Goals
G1. Rút ngắn thời gian screening CV bằng AI summary + match score.
G2. Chuẩn hóa câu hỏi phỏng vấn theo JD/CV.
G3. Mọi quyết định pass/reject/offer đều do con người xác nhận, có audit trail.
G4. Candidate có visibility về trạng thái ứng tuyển.

## Non-goals
Gửi email offer thật; tích hợp payroll; video call tích hợp sẵn; auto-reject không qua người.

## Users
Recruiter, Hiring Manager, Interviewer, Candidate, Admin.

## Functional Scope
REQ-ATS-01..13.

## Business Rules
BR-ATS-01..03.

## Metrics / Acceptance Signals
- Match score/summary benchmark: đánh giá đúng theo con người ≥80%.
- 5 critical E2E flows pass.
- 0 trường hợp AI tự đổi trạng thái Application.
- 100% Offer đi qua bước confirmation.

## Risks
Chất lượng CV parsing phụ thuộc định dạng file; AI match score có thể thiên lệch nếu JD
mô tả kém; latency của AI service; đảm bảo quyền riêng tư dữ liệu ứng viên.

## Release Slice
MVP-1: Job Posting + Application + CV Parsing/Screening + Interview/Scorecard + Recruiter/Hiring Manager decision + Offer confirmation + Candidate status tracking + Audit Trail.

MVP-2 (nếu còn thời gian): AI Question Suggestion + Match Score explainability + Candidate Status Tracking nâng cao + Dashboard/Reporting.


