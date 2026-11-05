# Testing Strategy & Quality Assurance Plan

## 1. Scope of Testing
- **Unit & Model Tests:** Foreign key cascading, auto-incrementing project issue key generation (`BM-1`, `BM-2`), parent-child subtask relationships.
- **API Functional Tests:** Endpoint verification with tenant isolation checks.
- **Workflow State Tests:** Ensuring valid transitions succeed and invalid transitions fail with 422.
- **Agile Logic Tests:** Sprint start and completion rollover logic (moving incomplete tasks to backlog).
- **Automation Engine Tests:** Ensuring trigger -> condition -> action execution is recorded in logs.
- **Frontend Component Verification:** Board drag-and-drop, filter updates, modal submissions, and real-time updates.

## 2. Test Cases Matrix
| Test Case ID | Module | Scenario | Expected Result |
|---|---|---|---|
| TC-PROJ-01 | Projects | Create project with key `PROJ` | Returns 201, initializes default board and columns |
| TC-ISSUE-01 | Issues | Create issue in project `PROJ` | Key is automatically assigned `PROJ-1` |
| TC-ISSUE-02 | Issues | Create child subtask under `PROJ-1` | Subtask has `parent_id`, type `subtask`, key `PROJ-2` |
| TC-SPRINT-01 | Sprints | Start a future sprint | Status updates to `active`, start date recorded |
| TC-SPRINT-02 | Sprints | Complete sprint with incomplete tasks | Incomplete tasks rolled over to backlog, status `closed` |
| TC-AUTO-01 | Automations | Status change to `done` | `completed_at` timestamp populated |
| TC-REPORT-01 | Reports | Compute burndown for active sprint | Returns daily remaining points array matching DB records |

