# Product Architecture & Domain Model

## 1. High-Level Architectural Diagram

```
+---------------------------------------------------------------------------------------+
|                                    BUFFERMATE UI                                      |
|                                                                                       |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  |  Project Overview  |  |  Kanban/Scrum Boards |  |  Backlog & Sprint Planner     |  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  |  Issue Detail View |  |  Timeline & Roadmap  |  |  Agile Reports & Analytics    |  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
+-------------------------------------------+-------------------------------------------+
                                            | REST API & SSE / Realtime Sync
                                            v
+---------------------------------------------------------------------------------------+
|                                  LARAVEL 11 BACKEND                                   |
|                                                                                       |
|  +------------------------+  +-------------------------+  +------------------------+  |
|  |  ProjectController     |  |  IssueController        |  |  SprintController      |  |
|  +------------------------+  +-------------------------+  +------------------------+  |
|  +------------------------+  +-------------------------+  +------------------------+  |
|  |  BoardController       |  |  WorkflowEngineService  |  |  AutomationEngine      |  |
|  +------------------------+  +-------------------------+  +------------------------+  |
|  +------------------------+  +-------------------------+  +------------------------+  |
|  |  ReportAnalyticsService|  |  JqlQueryParserService  |  |  PermissionMiddleware  |  |
|  +------------------------+  +-------------------------+  +------------------------+  |
+-------------------------------------------+-------------------------------------------+
                                            | Eloquent ORM
                                            v
+---------------------------------------------------------------------------------------+
|                             RELATIONAL DATABASE (SQLite / PG)                         |
|                                                                                       |
|  workspaces -> projects -> boards -> board_columns                                    |
|               |         -> sprints -> issues                                          |
|               |         -> issues -> subtasks, links, comments, history, attachments  |
|               |         -> workflows -> workflow_statuses, workflow_transitions       |
|               |         -> automation_rules -> automation_executions                  |
+---------------------------------------------------------------------------------------+
```

## 2. Core Domain Models & Relationships

### A. Workspace (Tenant Root)
- `1 : N` Projects
- `1 : N` Workspace Members

### B. Project
- Belongs to `Workspace`
- Has unique `key` (e.g. `BM`, `PROJ`, `DEV`)
- Auto-generates human readable issue keys (`BM-1`, `BM-2`)
- Has a `lead_user_id` and assigned `project_members`
- `1 : N` Issues (Work Items)
- `1 : N` Sprints
- `1 : N` Boards
- `1 : 1` Default Workflow

### C. Issue (Work Item)
- Belongs to `Project`
- Belongs to optional `Sprint`
- Parent-child relation: `parent_id` (Epic -> Story/Task -> Subtask)
- Attributes:
  - `key` (string, indexed, unique per workspace/project)
  - `title` (string)
  - `description` (markdown/text)
  - `type` (`epic`, `story`, `task`, `bug`, `subtask`)
  - `status` (`backlog`, `todo`, `in_progress`, `in_review`, `done`, `blocked`)
  - `priority` (`highest`, `high`, `medium`, `low`, `lowest`)
  - `story_points` (integer, nullable)
  - `estimated_hours` / `logged_hours` (numeric)
  - `assignee_user_id` / `reporter_user_id`
  - `start_date` / `due_date`
  - `resolution` (`resolved`, `wont_fix`, `duplicate`, `incomplete`)
- `1 : N` Issue Comments
- `1 : N` Issue Links & Dependencies
- `1 : N` Issue Audit History Logs
- `1 : N` Attachments

### D. Sprint
- Belongs to `Project`
- `name` (e.g. "Sprint 1")
- `goal` (text)
- `status` (`future`, `active`, `closed`)
- `start_date` / `end_date` / `completed_at`
- `1 : N` Issues

### E. Board & Board Column
- Belongs to `Project`
- `type` (`kanban`, `scrum`)
- `1 : N` Columns (`To Do`, `In Progress`, `Code Review`, `Done`)
- Each column maps to 1 or more issue statuses and optional WIP limits.

### F. Workflow & Transition Engine
- Statuses: Finite state graph nodes
- Transitions: Directed edges between statuses with optional permission restrictions and pre/post validation rules.

### G. Automation Rule
- Event Trigger: `issue_created`, `status_changed`, `assignee_changed`, `sprint_started`, `sprint_completed`
- Conditions: `status_is`, `priority_is`, `has_unresolved_subtasks`
- Actions: `assign_to`, `set_status`, `notify_user`, `log_audit`

