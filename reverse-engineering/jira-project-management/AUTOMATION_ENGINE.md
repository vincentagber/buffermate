# Jira Automation Engine: Architecture & Execution Pipeline

## 1. Engine Design: Trigger -> Condition -> Action
The automation engine runs in the Laravel backend (`JiraAutomationService`) and hooks into model lifecycle events (`WorkItemObserver` or explicit controller dispatch).

### A. Supported Triggers
- `issue_created`: When any new issue is created in the project.
- `status_changed`: When an issue moves to a target status (e.g., `in_review`, `done`).
- `due_date_approaching`: Scheduled check for tasks due within 24 hours.
- `subtasks_completed`: When all subtasks belonging to a parent task reach `done`.
- `sprint_started`: When a sprint transitions to `active`.
- `sprint_completed`: When a sprint is completed.

### B. Supported Conditions
- `status_equals`: Compares issue status to specified string.
- `type_equals`: Compares issue type (e.g. `bug`, `story`).
- `priority_in`: Checks if priority is in `['highest', 'high']`.
- `unassigned`: Issue has no assignee.

### C. Supported Actions
- `assign_issue`: Assign to a designated user ID or project lead.
- `set_status`: Move issue to a designated workflow status.
- `add_comment`: Append an automated system comment.
- `notify_user`: Emit in-app notification / toast.
- `log_audit`: Write an entry to the automation audit log.

## 2. Pre-Packaged Jira Rules
1. **Auto-Assign to Lead:** When an unassigned `bug` is created, automatically assign to Project Lead.
2. **Review Notification:** When an issue moves to `in_review`, log activity and notify team.
3. **Auto-Complete Parent Task:** When all child subtasks are marked `done`, automatically move parent task to `done`.
4. **Resolution Timestamp:** When issue is moved to `done`, record `completed_at` timestamp.

