# REST API Specification & Endpoint Contracts

All endpoints are prefixed with `/api/projects/` (or `/api/issues/`, `/api/sprints/`) and run through tenant authorization middleware (`tenant.scope`).

---

## 1. Projects API

### `GET /api/projects`
List all projects within the active workspace.
- **Query Params:** `category`, `status` (`active`, `archived`), `search`
- **Response:** Array of Project objects with member counts, active sprint summary, and issue completion percentages.

### `POST /api/projects`
Create a new project.
- **Request Body:**
  ```json
  {
    "name": "BufferMate Core Engine",
    "key": "BM",
    "description": "Enterprise social auto-posting infrastructure",
    "template": "scrum",
    "category": "Engineering",
    "lead_user_id": "user-current"
  }
  ```
- **Response (201 Created):** Created project record, default board, and default columns.

### `GET /api/projects/{id}`
Retrieve project summary, active board, members, settings, and metrics.

### `PUT /api/projects/{id}`
Update project metadata, name, description, lead, or settings.

### `DELETE /api/projects/{id}`
Permanently delete project and cascade child items (requires `project_admin` role).

---

## 2. Issues / Tasks API

### `GET /api/projects/{projectId}/issues`
List and filter issues.
- **Query Params:**
  - `status`: e.g. `todo`, `in_progress`, `done`, `all`
  - `sprint_id`: specific sprint ID or `backlog` (where `sprint_id IS NULL`)
  - `type`: `epic`, `story`, `task`, `bug`, `subtask`
  - `assignee_id`: filter by user ID or `unassigned`
  - `priority`: `highest`, `high`, `medium`, `low`
  - `search`: search title, key, or description
- **Response:** Array of WorkItem objects with subtasks, comments count, link indicators, and assignee avatar.

### `POST /api/projects/{projectId}/issues`
Create an issue.
- **Request Body:**
  ```json
  {
    "title": "Build resilient SQLite lock retry loop",
    "description": "Add exponential backoff when database lock occurs.",
    "type": "task",
    "priority": "high",
    "assignee_user_id": "dev_user",
    "sprint_id": null,
    "parent_id": null,
    "story_points": 5,
    "due_date": "2026-11-20T18:00:00Z",
    "labels": ["backend", "database"]
  }
  ```
- **Response (201 Created):** WorkItem with assigned `key` (e.g. `BM-15`).

### `GET /api/issues/{idOrKey}`
Retrieve full issue details by UUID or Key (e.g. `BM-15`), including subtasks, comments, links, and change history.

### `PATCH /api/issues/{id}`
Inline edit any issue field (status, title, description, priority, assignee, story_points, due_date, sprint_id).
- **Automation Hook:** Triggers corresponding automation rules (e.g. status transition, overdue checks).

### `DELETE /api/issues/{id}`
Delete issue and clean up links and subtasks.

### `POST /api/issues/{id}/subtasks`
Create a child subtask under this issue.

---

## 3. Sprints & Backlog API

### `GET /api/projects/{projectId}/sprints`
List all sprints for a project (`future`, `active`, `closed`).

### `POST /api/projects/{projectId}/sprints`
Create a new sprint with `name`, `goal`, `duration_weeks`, `start_date`, `end_date`.

### `POST /api/sprints/{id}/start`
Transition sprint from `future` to `active`.

### `POST /api/sprints/{id}/complete`
Complete active sprint.
- **Request Body:** `{ "incomplete_destination": "backlog" | "next_sprint" }`

### `POST /api/sprints/reorder-issues`
Batch move issues into/out of sprint or change order.

---

## 4. Boards & Columns API

### `GET /api/projects/{projectId}/board`
Fetch board layout, columns, WIP limits, and cards.

### `POST /api/board-columns/reorder`
Persist column reordering or update WIP limits.

---

## 5. Comments & Activity API

### `POST /api/issues/{id}/comments`
Add a comment to an issue with optional `@mentions`.

### `DELETE /api/comments/{id}`
Delete comment (author or admin only).

---

## 6. Automations API

### `GET /api/projects/{projectId}/automations`
List automation rules and execution statistics.

### `POST /api/projects/{projectId}/automations`
Create automation rule (Trigger -> Condition -> Action).

### `POST /api/automations/{id}/toggle`
Activate or deactivate rule.

---

## 7. Reports & Analytics API

### `GET /api/projects/{projectId}/reports/burndown`
Get daily ideal vs actual burndown metrics for a sprint.

### `GET /api/projects/{projectId}/reports/velocity`
Get story points committed vs completed across the last 5 sprints.

### `GET /api/projects/{projectId}/reports/summary`
Get high-level distribution of issues by status, type, priority, and workload by assignee.
