# BufferMate Project Management Engineering Log

## Log Entries

### Entry 1: Architecture & Scope Definition
- Evaluated agile workflows and established technical requirements.
- Established documentation directory: `reverse-engineering/project-management/`.
- Confirmed focus on Core Project and Task Management capabilities:
  1. Project Hierarchies & Atomic Human-Readable Keys (`BM-101`)
  2. Issue Types: Epic, Story, Task, Bug, Subtask
  3. Interactive Drag-and-Drop Agile Boards (Scrum & Kanban)
  4. Sprints & Backlog Planning
  5. Workflows, Transitions & State Machines
  6. Automation Rules (Trigger -> Condition -> Action)
  7. Sprint Metrics: Burndown, Velocity, Cumulative Flow

### Entry 2: Data Schema & Storage Architecture
- Use `work_items` as the unified table for all work item types (Epic, Story, Task, Bug, Subtask) with a `type` discriminator and hierarchical self-referencing `parent_id`.
- Issue Key pattern: `{$project->key}-{$project->issue_counter}` ensures human-readable keys without race conditions by using database atomic increments.

### Entry 3: Notifications & Watchers Scheme Implementation
- Implemented Notification Scheme architecture:
  - Database schema: `jira_notifications` table (UUID, event type, data payload, read status, actor, recipient) and `work_item_watchers` table (issue watchers mapping).
  - Notification triggers:
    1. Issue assignment -> notify new assignee
    2. Status changed -> notify assignee, reporter, and enrolled watchers
    3. Issue commented -> notify assignee, reporter, watchers, and parsed `@username` mentions
    4. Sprint started / completed -> notify team
  - Watchers system: Users can toggle watching an issue (`POST /api/issues/{id}/watchers/toggle`), view watchers count and list. Reporter and commenters are automatically enrolled as watchers.
  - Front-end Notification Center: Top Header notification inbox featuring real-time unread counter badge, filter tabs (`All`, `Unread`, `Assigned`, `Mentions`), event-type badges, single mark-as-read, "Mark all read" action, and direct click-through modal navigation to issues.
