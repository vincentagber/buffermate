# Frontend UI Component Inventory & Views

## 1. Views Hierarchy
- **Project Hub (`/dashboard/projects`):**
  - Project Cards grid: key, icon, completion %, active sprint indicator, lead avatar.
  - Quick filter by category.
  - "Create Project" wizard.
- **Project Main View (`ProjectHub.tsx`):**
  - **Sub-Tabs Navigation:**
    1. **Summary / Overview:** Real-time health statistics, status distributions, upcoming deadlines, lead info.
    2. **Board (Kanban / Scrum):** Drag-and-drop columns, quick filters, WIP limit warnings, rapid issue creator.
    3. **Backlog:** Sprint planner section with collapsible sprint containers, story points accumulator, backlog drag-and-drop.
    4. **Timeline / Roadmap:** Gantt-style schedule bar chart with start/end dates and milestone pins.
    5. **Reports & Velocity:** Burndown charts, velocity bars, priority distribution donuts.
    6. **Automations:** Active rules list, trigger-condition-action rule cards, execution logs.
    7. **Project Settings:** Edit project key, name, members, categories, and danger zone (archive/delete).

## 2. Modals & Interactive Drawers
- **Create Issue Modal (`CreateIssueModal.tsx`):**
  - Fast issue creation with project switcher, type pills (Epic/Story/Task/Bug), summary, description, priority selector, story points, and assignee selector.
- **Issue Detail Drawer / Modal (`IssueDetailModal.tsx`):**
  - Left pane: Breadcrumbs (`PROJECT-KEY / ISSUE-KEY`), editable title, markdown description, subtask checklist with % progress bar, linked issues, comments timeline, and audit activity stream.
  - Right pane: Status dropdown with workflow transition indicators, priority badge, assignee picker, story points, due date picker, reporter info, and delete action.
- **Create / Edit Sprint Modal:**
  - Sprint name, goal, start/end dates, duration picker.
- **Complete Sprint Modal:**
  - Incomplete issue rollover selector (Backlog or next sprint).
- **Create Project Modal (`CreateProjectModal.tsx`):**
  - Template selection (Scrum, Kanban, Basic), Project Name, Project Key auto-generation, Lead picker.

