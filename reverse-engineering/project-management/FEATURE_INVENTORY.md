# Feature Inventory & Enterprise Workflows Matrix

Status Definitions:
- `IMPLEMENTED`: Fully developed, tested, persisted in database, and functional in UI.
- `PARTIALLY IMPLEMENTED`: Backend API or basic UI in place; advanced options or secondary edge-cases under development.
- `NOT IMPLEMENTED`: Scheduled in roadmap according to priority tier.
- `BLOCKED`: Blocked by external constraint.
- `NOT APPLICABLE`: Outside project & task management scope (e.g. external billing).

---

## 1. Project Management (P0)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Project Creation | Create Project Modal / Wizard | Create project with Name, Key (prefix), Description, Template, and Lead | P0 | IMPLEMENTED |
| Project Key & Prefix | Issue Key (e.g., `PROJ-101`) | Unique uppercase 2-10 char prefix automatically generating sequential human-readable issue IDs | P0 | IMPLEMENTED |
| Project Templates | Scrum / Kanban / Bug Tracking | Pre-configured board columns, issue types, and default workflows | P0 | IMPLEMENTED |
| Project Categories | Project Categories | Grouping projects by department, client, or initiative | P1 | IMPLEMENTED |
| Project Lead & Members | Project Lead & Role Assignments | Assigning lead user and managing members with custom project roles | P0 | IMPLEMENTED |
| Project Overview & Stats | Project Summary Page | Real-time issue distribution, status completion %, overdue alerts, and sprint status | P0 | IMPLEMENTED |
| Project Settings | Project Settings | Edit key, name, default assignee, visibility, and category | P0 | IMPLEMENTED |
| Project Archiving | Archive Project | Soft-archive project to hide from active boards while preserving audit records | P1 | IMPLEMENTED |
| Project Deletion | Delete Project | Cascade deletion with confirmation safeguard | P0 | IMPLEMENTED |

---

## 2. Task & Issue Management (P0)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Issue Types Hierarchy | Epic -> Story/Task/Bug -> Subtask | Support for Epic, Story, Task, Bug, Feature, Improvement, Milestone, Subtask | P0 | IMPLEMENTED |
| Issue Identifier | Issue Key (`BM-14`) | Unique project key + auto-incrementing integer key for instant referencing | P0 | IMPLEMENTED |
| Issue Creation | Create Issue Dialog | Modal with project selector, issue type, summary, rich description, assignee, priority, labels, story points | P0 | IMPLEMENTED |
| Issue Detail View | Standard Issue Detail View / Panel | 2-column layout: left column (description, activity, subtasks, links), right column (status, assignee, dates, story points) | P0 | IMPLEMENTED |
| Inline Editing | Click-to-edit fields | Live field updating without full form submission | P0 | IMPLEMENTED |
| Priorities | Highest, High, Medium, Low, Lowest | 5-tier standard priority scale with color-coded badges | P0 | IMPLEMENTED |
| Subtasks Engine | Create Subtask | Hierarchical parent-child relationship; progress bar calculates completed subtask % | P0 | IMPLEMENTED |
| Issue Linking & Dependencies | Issue Links (Blocks, Depends on, Relates to) | Direct links between tasks with relationship semantic indicators (e.g. "is blocked by") | P1 | IMPLEMENTED |
| Time Tracking & Estimates | Original Estimate / Time Spent / Remaining | Tracking estimated hours vs logged work hours | P1 | IMPLEMENTED |
| Story Points | Story Points Field | Fibonacci-based effort estimation (1, 2, 3, 5, 8, 13, 21) | P0 | IMPLEMENTED |
| Watchers & Reporter | Watchers & Reporter | Distinguish who reported the task from assigned owner, and support watching for notifications | P1 | IMPLEMENTED |
| Labels & Components | Labels & Components | Multi-select tagging and functional component grouping | P0 | IMPLEMENTED |
| Activity Stream & History | History Tab | Full audit log recording field changes: previous value -> new value, timestamp, user | P1 | IMPLEMENTED |

---

## 3. Agile Project Management: Kanban & Scrum (P0 / P1)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Interactive Kanban Board | Standard Kanban Board | Multi-column board with drag-and-drop status transitions, quick search, and assignee filters | P0 | IMPLEMENTED |
| Configurable Columns | Board Column Configuration | Custom column ordering, naming, and workflow status mapping | P0 | IMPLEMENTED |
| Work in Progress (WIP) Limits | Column WIP Limits (Min / Max) | Visual warnings when cards in column exceed designated threshold | P1 | IMPLEMENTED |
| Scrum Backlog | Product Backlog View | Backlog list view with drag-and-drop sprint planning, backlog reordering, and issue creation | P1 | IMPLEMENTED |
| Sprint Management | Create / Start / Complete Sprint | Sprints with Name, Goal, Start Date, End Date, Duration, and State (`future`, `active`, `closed`) | P1 | IMPLEMENTED |
| Active Sprint Board | Scrum Board | Board filtered strictly to issues assigned to current active sprint | P1 | IMPLEMENTED |
| Sprint Completion & Rollover | Complete Sprint Wizard | Move incomplete sprint issues to backlog or next sprint upon completion | P1 | IMPLEMENTED |
| Quick Filters | Board Quick Filters | 1-click filters: "Only My Issues", "Recently Updated", "Blocked", "High Priority" | P0 | IMPLEMENTED |

---

## 4. Planning & Scheduling: Roadmap & Timeline (P1)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Roadmap Timeline | Standard Timeline / Roadmap | Interactive Gantt-style timeline visualization grouped by Epics and Tasks | P1 | IMPLEMENTED |
| Date Scheduling | Start Date & Due Date | Visual bars indicating work span with duration metrics | P1 | IMPLEMENTED |
| Milestone Tracking | Milestones View | Distinct marker pins representing project delivery deadlines | P1 | IMPLEMENTED |
| Overdue Warning | Overdue flag | Visual red highlights on delayed tasks and roadmap bars | P1 | IMPLEMENTED |

---

## 5. Workflow Management Engine (P0 / P3)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Configurable Statuses | Workflow Statuses | Backlog, To Do, In Progress, In Review, Done, Blocked, Cancelled | P0 | IMPLEMENTED |
| State Machine Transitions | Workflow Transitions | Permitted transition rules between statuses (e.g. cannot jump from Backlog to Done directly) | P1 | IMPLEMENTED |
| Transition Validators | Validators | Required fields (e.g., must enter resolution or time spent before closing) | P2 | IMPLEMENTED |
| Default Workflows | Standard Agile Workflow | Software development workflow with pre-configured step transitions | P0 | IMPLEMENTED |

---

## 6. Team Collaboration & Notifications (P1)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Issue Comments | Comments Tab | Threaded comments with timestamps, user avatars, and delete/edit permissions | P1 | IMPLEMENTED |
| Mentions | @mention support | Mentioning teammates inside comments and descriptions | P1 | IMPLEMENTED |
| In-App Notifications | Notification Center | Toast and notification inbox on task assignment, mention, and status change | P1 | IMPLEMENTED |
| Task Attachments | File & Image Attachments | File upload and preview on issue cards and detail view | P1 | IMPLEMENTED |

---

## 7. Automation Engine (P2)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Trigger -> Condition -> Action | Automation Engine | Event-driven rule builder triggering on issue creation, status transition, or priority update | P2 | IMPLEMENTED |
| Auto-Assignment Rule | Rule: On Create Assign | Automatically assigns tasks based on project default or type | P2 | IMPLEMENTED |
| Auto-Close Subtasks | Rule: Parent completion | When parent is completed or all subtasks completed, transition parent | P2 | IMPLEMENTED |
| Overdue Detection | Scheduled Overdue Checker | Flags tasks whose due date has lapsed | P2 | IMPLEMENTED |
| Automation Audit Logs | Automation Execution Log | Records rule trigger, evaluation outcome, execution time, and status | P2 | IMPLEMENTED |

---

## 8. Reports & Real-Time Analytics (P2)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Sprint Burndown Chart | Burndown Chart | Daily remaining story points / issues vs ideal burn line from actual sprint data | P2 | IMPLEMENTED |
| Velocity Chart | Velocity Report | Story points committed vs story points completed across recent sprints | P2 | IMPLEMENTED |
| Created vs Resolved | Created vs Resolved Chart | Cumulative flow and trend of incoming issues vs resolved issues | P2 | IMPLEMENTED |
| Team Workload Distribution | Workload Report | Total issues and estimated hours distributed across assignees | P2 | IMPLEMENTED |
| Priority & Status Breakdown | Pie / Donut Charts | Visual distribution of project health and backlog composition | P1 | IMPLEMENTED |

---

## 9. Search, Filtering & JQL (P0 / P1)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Instant Global Search | Quick Search (`/`) | Real-time search across issue keys, summaries, and descriptions | P0 | IMPLEMENTED |
| Multi-faceted Filter Bar | Basic Issue Filter | Filter by Project, Type, Status, Assignee, Priority, Sprint, Label | P0 | IMPLEMENTED |
| Safe JQL Query Parser | Project Query Language | Query string parsing (e.g., `project = BM AND status = "In Progress" AND priority = High`) | P1 | IMPLEMENTED |
| Saved Filters | Saved Filters / Starred Searches | Save query configurations for quick 1-click retrieval | P1 | IMPLEMENTED |

---

## 10. Role-Based Access Control (RBAC) (P0)

| Feature | Standard Equivalent | Description | Target Priority | Status |
|---|---|---|---|---|
| Role Hierarchy | Project Roles | Super Admin, Project Admin, Scrum Master, Developer, Viewer | P0 | IMPLEMENTED |
| Permission Enforcement | Project Permission Scheme | Server-side validation on issue creation, editing, status change, and project deletion | P0 | IMPLEMENTED |
| Tenant Isolation | Workspace Scoping | Strict isolation ensuring projects and issues never leak between workspaces | P0 | IMPLEMENTED |

