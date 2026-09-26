# AI Evaluation Results — Match Score

| #  | Human      | AI Score | AI Label   | Matched Skills                               | Missing Skills                      | Kết quả |
| -- | ---------- | -------: | ---------- | -------------------------------------------- | ----------------------------------- | ------- |
| 1  | Tốt        |       94 | Tốt        | Java, Spring Boot, REST API, PostgreSQL      | -                                   | Đúng    |
| 2  | Tốt        |       96 | Tốt        | React, JavaScript, TypeScript, HTML, CSS     | -                                   | Đúng    |
| 3  | Tốt        |       93 | Tốt        | Figma, UX Research, Wireframe, Prototype     | -                                   | Đúng    |
| 4  | Tốt        |       91 | Tốt        | Manual Testing, Test Case, API, Postman, SQL | -                                   | Đúng    |
| 5  | Tốt        |       95 | Tốt        | Requirements, UML, Use Case, User Story, SQL | -                                   | Đúng    |
| 6  | Tốt        |       88 | Tốt        | Selenium, Java, API Testing, SQL, Git        | -                                   | Đúng    |
| 7  | Tốt        |       78 | Tốt        | Agile, Jira, Risk, Stakeholder, SDLC         | UML, BPMN                           | Đúng    |
| 8  | Kém        |       20 | Kém        | Figma, UX Research                           | Java, Spring Boot, REST API, SQL    | Đúng    |
| 9  | Kém        |       24 | Kém        | Git, REST API                                | Test Case, API Testing, SQL, Jira   | Đúng    |
| 10 | Kém        |       10 | Kém        | -                                            | Java, Python, REST API, SQL, Docker | Đúng    |
| 11 | Kém        |       16 | Kém        | Figma, Design System                         | Testing, Postman, SQL, Jira         | Đúng    |
| 12 | Kém        |       15 | Kém        | Git                                          | HTML, CSS, JavaScript, React        | Đúng    |
| 13 | Kém        |       18 | Kém        | Documentation, SQL                           | Figma, UX Research, Prototype       | Đúng    |
| 14 | Kém        |       31 | Trung bình | Documentation, Communication                 | UML, BPMN, Use Case                 | **Sai** |
| 15 | Trung bình |       69 | Tốt        | C#, .NET, SQL Server, Git                    | Java, Spring Boot, PostgreSQL       | **Sai** |
| 16 | Trung bình |       63 | Trung bình | Figma, UI, User Flow, REST API               | UX Research, Prototype              | Đúng    |
| 17 | Trung bình |       58 | Trung bình | Testing, Test Case, SQL, Jira                | UML, BPMN, User Story               | Đúng    |
| 18 | Trung bình |       82 | Tốt        | Business Analysis, Documentation, SQL        | UML, BPMN, Use Case                 | **Sai** |
| 19 | Trung bình |       84 | Tốt        | Java, Spring Boot, REST API, SQL             | PostgreSQL, Docker                  | **Sai** |
| 20 | Trung bình |       61 | Trung bình | Requirements, BPMN, UML, SQL, Agile          | Project Planning, Budget            | Đúng    |

## Tổng kết

* **Tổng test cases:** 20
* **AI đúng:** 15/20
* **AI sai:** 5/20
* **Accuracy:** **75%**

| Nhóm       | Số case | AI đúng |
| ---------- | ------: | ------: |
| Tốt        |       7 |     7/7 |
| Trung bình |       6 |     3/6 |
| Kém        |       7 |     6/7 |

### Nhận xét

AI nhận diện tốt các trường hợp **match rõ ràng**, nhưng khó hơn với nhóm **Trung bình**.

Các lỗi chủ yếu xảy ra khi:

* Keyword phù hợp nhưng technology stack khác.
* CV có title giống Job nhưng thiếu skill quan trọng.
* CV junior có nhiều skill phù hợp nhưng thiếu kinh nghiệm.

**Human vẫn là người quyết định cuối cùng; AI chỉ cung cấp Match Score và thông tin hỗ trợ.**
