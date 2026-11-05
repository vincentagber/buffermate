# Database Design & Entity Relationship Model

## 1. Architectural Principles
- **Multi-Tenant Isolation:** All project entities are directly or transitively scoped to `workspace_id`.
- **Primary Keys:** UUIDs (`id`) for security, distributed generation, and non-predictable resource URLs.
- **Human Reference Identifiers:** Composite keys (`key`, e.g. `BM-101`) with per-project auto-incrementing integer sequence counter.
- **Foreign Keys & Constraints:** Cascading deletes where appropriate, indexed foreign keys for sub-millisecond lookups.
- **Audit Trails:** Immutable history tracking (`work_item_history`) recording changes across all critical fields.

---

## 2. Table Schemas Blueprint

### 1. `projects`
- `id` (UUID, PK)
- `workspace_id` (UUID, FK -> `workspaces.id`, cascade)
- `name` (string, 120 chars)
- `key` (string, 10 chars, uppercase, unique per workspace)
- `description` (text, nullable)
- `template` (enum: `scrum`, `kanban`, `basic`, default: `scrum`)
- `category` (string, nullable, e.g. "Core Engine", "Marketing")
- `lead_user_id` (string, nullable)
- `default_assignee_id` (string, nullable)
- `issue_counter` (integer, default: 0 - tracks the next incremental issue number)
- `status` (enum: `active`, `archived`, default: `active`)
- `settings` (json, nullable)
- `created_at`, `updated_at`, `deleted_at` (soft deletes)

### 2. `project_members`
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects.id`, cascade)
- `user_id` (string)
- `role` (enum: `project_admin`, `scrum_master`, `developer`, `viewer`, default: `developer`)
- `created_at`, `updated_at`
- Unique constraint: `[project_id, user_id]`

### 3. `sprints`
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects.id`, cascade)
- `workspace_id` (UUID, FK -> `workspaces.id`, cascade)
- `name` (string, 100 chars, e.g. "Sprint 1")
- `goal` (text, nullable)
- `status` (enum: `future`, `active`, `closed`, default: `future`)
- `start_date` (timestamp, nullable)
- `end_date` (timestamp, nullable)
- `completed_at` (timestamp, nullable)
- `created_at`, `updated_at`

### 4. `work_items` (Jira Issues / Tasks)
- `id` (UUID, PK)
- `workspace_id` (UUID, FK -> `workspaces.id`, cascade)
- `project_id` (UUID, FK -> `projects.id`, cascade)
- `sprint_id` (UUID, FK -> `sprints.id`, null on delete, nullable)
- `parent_id` (UUID, FK -> `work_items.id`, null on delete, nullable - for subtasks or epic links)
- `key` (string, indexed, unique per workspace - e.g. `BM-14`)
- `issue_number` (integer, indexed - e.g. `14`)
- `title` (string, 255 chars)
- `description` (long text, nullable)
- `type` (enum: `epic`, `story`, `task`, `bug`, `subtask`, `feature`, `improvement`, `milestone`, default: `task`)
- `status` (enum: `backlog`, `todo`, `in_progress`, `in_review`, `blocked`, `done`, `cancelled`, default: `todo`)
- `priority` (enum: `highest`, `high`, `medium`, `low`, `lowest`, default: `medium`)
- `story_points` (integer, nullable)
- `estimated_hours` (decimal 8,2, nullable)
- `logged_hours` (decimal 8,2, default: 0)
- `assignee_user_id` (string, nullable)
- `reporter_user_id` (string, nullable)
- `labels` (json, nullable - array of strings)
- `components` (json, nullable - array of strings)
- `start_date` (timestamp, nullable)
- `due_date` (timestamp, nullable)
- `completed_at` (timestamp, nullable)
- `resolution` (string, nullable, e.g. `Done`, `Won't Fix`, `Duplicate`)
- `board_order` (integer, default: 0 - for vertical card ordering within columns)
- `created_at`, `updated_at`, `deleted_at`

### 5. `work_item_links` (Dependencies & Relations)
- `id` (UUID, PK)
- `workspace_id` (UUID, FK)
- `source_work_item_id` (UUID, FK -> `work_items.id`, cascade)
- `target_work_item_id` (UUID, FK -> `work_items.id`, cascade)
- `relationship` (enum: `blocks`, `is_blocked_by`, `relates_to`, `duplicates`)
- `created_at`

### 6. `work_item_comments`
- `id` (UUID, PK)
- `work_item_id` (UUID, FK -> `work_items.id`, cascade)
- `user_id` (string)
- `author_name` (string, nullable)
- `content` (text)
- `created_at`, `updated_at`

### 7. `work_item_history` (Audit Trail)
- `id` (UUID, PK)
- `work_item_id` (UUID, FK -> `work_items.id`, cascade)
- `user_id` (string)
- `field` (string - e.g. `status`, `assignee`, `priority`, `story_points`)
- `from_value` (text, nullable)
- `to_value` (text, nullable)
- `created_at`

### 8. `boards`
- `id` (UUID, PK)
- `workspace_id` (UUID, FK)
- `project_id` (UUID, FK -> `projects.id`, cascade)
- `name` (string)
- `type` (enum: `kanban`, `scrum`, default: `kanban`)
- `filter_query` (text, nullable)
- `created_at`, `updated_at`

### 9. `board_columns`
- `id` (UUID, PK)
- `board_id` (UUID, FK -> `boards.id`, cascade)
- `name` (string, e.g. "To Do", "In Progress", "In Review", "Done")
- `mapped_status` (string, e.g. `todo`, `in_progress`, `in_review`, `done`)
- `wip_limit` (integer, nullable)
- `order_index` (integer, default: 0)
- `created_at`, `updated_at`

### 10. `jira_automation_rules`
- `id` (UUID, PK)
- `workspace_id` (UUID, FK)
- `project_id` (UUID, FK, nullable - null applies workspace-wide)
- `name` (string)
- `description` (text, nullable)
- `trigger_event` (string, e.g. `issue_created`, `status_changed`, `due_date_passed`)
- `conditions` (json - criteria evaluations)
- `actions` (json - actions to execute)
- `is_active` (boolean, default: true)
- `execution_count` (integer, default: 0)
- `last_executed_at` (timestamp, nullable)
- `created_at`, `updated_at`

### 11. `jira_automation_executions`
- `id` (UUID, PK)
- `rule_id` (UUID, FK -> `jira_automation_rules.id`, cascade)
- `trigger_payload` (json)
- `status` (enum: `success`, `skipped`, `failed`)
- `execution_log` (text)
- `executed_at` (timestamp)

