# Reverse Engineering Audit Log & Architectural Decisions

## Session Log: November 5, 2026

### Entry 1: Environment Inspection & Tool Search
- Searched agent marketplace for Jira and reverse-engineering plugins. Located Atlassian Teamwork Graph CLI.
- Verified existing Laravel 11 backend (`buffermate-backend`) and Next.js 16 frontend (`buffermate-frontend`).
- Established reverse engineering documentation directory: `reverse-engineering/jira-project-management/`.

### Entry 2: Scope Boundaries
- Confirmed focus strictly on Jira Project and Task Management capabilities:
  - Projects, Sprints, Backlog, Kanban/Scrum Boards.
  - Work items hierarchy (Epic -> Story/Task/Bug -> Subtask).
  - Issue linking (dependencies, blockers).
  - Agile analytics (Burndown, Velocity).
  - Event-driven automation rules.
  - Role-based permissions within workspace tenant context.
- Explicitly excluded unrelated enterprise modules (Jira Service Management ticketing queues, ITIL CMDB, Confluence).

### Entry 3: Architecture Decisions
- Use `work_items` as the unified table for all Jira issue types (Epic, Story, Task, Bug, Subtask) with a `type` discriminator and hierarchical self-referencing `parent_id`.
- Issue Key pattern: `{$project->key}-{$project->issue_counter}` ensures standard Jira human-readable keys without race conditions by using database atomic increments.
- Use existing `WorkspaceTenantScope` middleware to maintain tenant boundaries without altering existing user authentication.
- Seamlessly integrate with the BufferMate dashboard navigation under Projects & Tasks.

### Entry 4: Jira Notifications & Watchers Scheme Implementation
- Implemented Jira Notification Scheme architecture:
  - Database schema: `jira_notifications` table (UUID, event type, data payload, read status, actor, recipient) and `work_item_watchers` table (issue watchers mapping).
  - Event dispatch triggers:
    - `issue_created`: Notifies assignee and project lead.
    - `issue_assigned`: Notifies new assignee ("Alex Morgan assigned BM-4 to you").
    - `issue_status_changed`: Notifies watchers, assignee, and reporter.
    - `issue_commented`: Scans content for `@mentions` and dispatches `issue_mentioned` alerts, plus general comment alerts to watchers.
    - `sprint_started` & `sprint_completed`: Broadcasts to all project members.
  - Watchers system: Users can toggle watching an issue (`POST /api/jira/issues/{id}/watchers/toggle`), view watchers count and list. Reporter and commenters are automatically enrolled as watchers matching Jira behavior.
  - Front-end Notification Center: Replaced static notifications in the top Header with a live Jira notification inbox featuring real-time unread counter badge, filter tabs (`All`, `Unread`, `Assigned`, `Mentions`), event-type badges, single mark-as-read, "Mark all read" action, and direct click-through modal navigation to issues.


