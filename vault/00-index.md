# Vault Index

## 1. Discovery

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/01-discovery/persona-jtbd.md | Current | Personas và Jobs-to-be-Done của Recruiter, Hiring Manager, Interviewer, Candidate |
| docs/01-discovery/project-charter.md | Current | Project Charter: Problem, Users, Value Proposition, MVP, Scope, Constraints, Success Signals |
| docs/01-discovery/user-research.md | Current | User Research, Research Question, Participant Findings, Research Synthesis và Product Implications |

---

## 2. Requirements

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/02-requirements/requirements.md | Current | Functional Requirements, Non-functional Requirements, Business Rules, Assumptions và Open Questions |
| docs/02-requirements/vault-qa-benchmark.md | Current | Bộ câu hỏi benchmark để kiểm tra khả năng truy xuất thông tin, tuân thủ Business Rules và xử lý Unknown |

---

## 3. Product

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/03-product/PRD.md | Current | Product Requirements Document: Problem, Goals, Non-goals, Users, Functional Scope, Business Rules, Metrics, Risks và Release Slice |
| docs/03-product/mvp-scope.md | Current | Phạm vi MVP theo Must / Should / Could / Out of Scope |
| docs/03-product/usability-test.md | Current | Usability Test Script, Findings, Evidence và các quyết định cải thiện UX |
| docs/03-product/user-flow.md | Current | User Flow của các luồng chính trong hệ thống tuyển dụng |

---

## 4. Backlog

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/04-backlog/taiga-tasks.md | Current | Taiga Backlog: Story, Task, Owner, Estimate và Expected Output |
| docs/04-backlog/user-stories.md | Current | Epics và User Stories US-ATS-01 đến US-ATS-13 |
| docs/04-backlog/user-story-specs.md | Current | Acceptance Criteria, Dependencies, Out of Scope, Security, Error Paths và Test Requirements của User Stories |

---

## 5. Design

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/05-design/design-system.md | Current | Design Tokens, Colors, Typography, Spacing, Radius, Elevation và Component Rules |
| docs/05-design/prototype-brief.md | Current | Prototype Brief và 4 critical flows: Screening, Human Confirmation, Question Suggestion, AI Fallback |
| docs/05-design/screen-inventory.md | Current | Danh sách màn hình, trạng thái và hành vi UI của hệ thống |

---

## 6. Technical

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/06-technical/API.md | Current | API Contract, Endpoint, Input, Output và Authorization |
| docs/06-technical/architecture.md | Current | Kiến trúc hệ thống, AI Orchestrator, Domain Services, RBAC và Audit Log |
| docs/06-technical/data-model.md | Current | Database Entities, Fields, Status và Data Rules |

---

## 7. Testing

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/07-testing/test-strategy.md | Current | Test Strategy: Unit, Integration, E2E và Non-functional Testing |
| docs/07-testing/test-cases.md | Current | Test Cases cho các Functional Requirements và Critical Flows |

---

## 8. Project Metadata

| File | Trạng thái | Nội dung |
|---|---|---|
| docs/00-project-index.md | Current | Index tổng thể của toàn bộ project documentation |
| docs/AI_USAGE_LOG.md | Reference | Nhật ký sử dụng AI trong quá trình phát triển project |
| docs/TRACEABILITY.md | Current | Mapping giữa Requirement → User Story → Task → Test Case |

---

## 9. Vault Source of Truth

| File | Trạng thái | Nội dung |
|---|---|---|
| vault/00-index.md | Current | Index và hướng dẫn truy xuất các tài liệu chính thức trong Vault |
| vault/01-source-priority.md | Current | Quy định thứ tự ưu tiên nguồn khi có xung đột thông tin |
| vault/02-requirements/requirements.md | Current | Bản requirements chính thức được sử dụng làm Source of Truth |
| vault/03-decision-log.md | Current | Nhật ký các quyết định đã được xác nhận/Approved |
| vault/04-meeting-notes.md | Current | Bối cảnh, meeting notes và các thông tin đã được nhóm xác nhận |

---

---

## 10. Vault Status Definition

| Trạng thái | Ý nghĩa |
|---|---|
| Current | Tài liệu hiện tại và được phép sử dụng làm nguồn chính |
| Approved | Quyết định đã được xác nhận, có authority cao |
| Reference | Chỉ dùng để tham khảo, không tự tạo Business Rule |
| Draft | Đang phát triển, chưa phải Source of Truth |
| Deprecated | Tài liệu cũ, không sử dụng nếu có phiên bản mới hơn |

---

## 11. Important Rules

- Không coi AI output là Business Rule nếu chưa được xác nhận.
- Không tự tạo thông tin khi Vault không có dữ liệu.
- Với câu hỏi chưa có trong Vault, trả lời `KHÔNG ĐỦ DỮ LIỆU` hoặc chỉ ra Open Question tương ứng.
- Không để AI tự quyết định Pass / Reject / Offer.
- Match Score và CV Summary chỉ là AI Recommendation.
- Mọi quyết định quan trọng phải có Human Confirmation.
- Mọi thay đổi Application Status quan trọng phải có Audit Trail.
- AI phải tạo Grounded Suggestion dựa trên CV/JD.
- Không được suy diễn hoặc bịa thêm thông tin ứng viên.
