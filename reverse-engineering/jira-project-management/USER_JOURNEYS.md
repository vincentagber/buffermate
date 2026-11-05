# End-to-End User Journeys (Jira Parity)

## User Journey 1: Project Initiation & Setup
1. **Trigger:** User opens Jira / Project Management module.
2. **Action:** Clicks "Create Project".
3. **Form Input:**
   - Selects template: **Scrum Software**, **Kanban Tracking**, or **Basic Task Management**.
   - Enters Project Name: "Core Platform Refactor".
   - Key is auto-suggested: `CPR`. User can customize it (e.g. `CORE`).
   - Assigns Project Lead and Project Category.
4. **Processing:**
   - Backend creates project record within tenant workspace.
   - Automatically initializes default board (e.g. "CORE Board").
   - Creates default columns (`Backlog`, `To Do`, `In Progress`, `Done`).
   - Assigns standard workflow to project.
5. **Outcome:** User is redirected to the project overview with zero initial issues and instant creation shortcuts.

---

## User Journey 2: Backlog Grooming & Sprint Planning (Scrum)
1. **Trigger:** Product Manager / Team Lead opens the Project Backlog.
2. **Issue Creation in Backlog:**
   - Quickly inputs multiple tasks (e.g., "Implement OAuth Refresh Token Handler", "Refactor SQLite Migrations").
   - Assigns Issue Type (Story, Bug, Task).
   - Enters Story Points (e.g. 5, 8, 3).
3. **Sprint Creation:**
   - Clicks "Create Sprint" -> Sprint "CORE Sprint 1" is initialized in `future` state.
   - Sets Sprint Goal: "Stabilize backend authentication and tenant isolation".
   - Sets duration (2 weeks) with automated start/end dates.
4. **Planning & Drag-and-Drop:**
   - Drags candidate stories from Backlog section into "CORE Sprint 1".
   - Team total committed points updates dynamically (e.g. 24 Story Points).
5. **Sprint Start:**
   - Clicks "Start Sprint".
   - System validates no other sprint in the project is currently in `active` state (or confirms parallel sprint).
   - Sprint state transitions to `active`.
   - User is redirected to Active Scrum Board.

---

## User Journey 3: Daily Execution on Kanban / Scrum Board
1. **Trigger:** Developer starts morning standup / daily work.
2. **Filtering:**
   - Clicks "Only My Issues" quick filter.
   - Board instantly filters cards assigned to current user.
3. **Transitioning Work:**
   - Drags card `CORE-12` from `To Do` to `In Progress`.
   - System invokes Workflow Engine:
     - Validates transition permission.
     - Automatically updates status to `in_progress`.
     - Automation rule fires: records `in_progress_at` timestamp and adds activity log.
4. **Subtask Completion:**
   - Developer opens Issue Detail modal for `CORE-12`.
   - Checks off subtasks: "Write unit tests", "Add DB index".
   - Subtask progress bar advances to 100%.
5. **Finishing:**
   - Drags card to `Done`.
   - System prompts for resolution (`Done / Resolved`).
   - Confetti triggers and remaining sprint story points count decreases.

---

## User Journey 4: Issue Dependencies & Blocker Resolution
1. **Trigger:** Developer discovers `CORE-15` cannot proceed until `CORE-10` API is deployed.
2. **Linking Tasks:**
   - Opens `CORE-15` detail view.
   - Clicks "Link Issue" -> Selects link type "is blocked by" -> selects `CORE-10`.
3. **Visualization:**
   - `CORE-15` card now displays a red blocker indicator: "Blocked by CORE-10".
   - In Timeline/Roadmap view, a visual dependency arrow connects `CORE-10` to `CORE-15`.
4. **Resolution:**
   - When `CORE-10` is dragged to `Done`, automation triggers:
   - Removes blocking flag from `CORE-15` and notifies assignee of `CORE-15` that their blocker has resolved.

---

## User Journey 5: Sprint Completion & Retrospective Analytics
1. **Trigger:** Sprint end date is reached.
2. **Review:**
   - Scrum Master views Active Board: 14 issues Completed, 2 issues remaining In Progress.
3. **Completion Action:**
   - Clicks "Complete Sprint".
   - Wizard shows summary: 14 completed (42 pts), 2 incomplete (8 pts).
   - Prompts destination for incomplete tasks: "Move to Backlog" or "Move to Next Sprint (CORE Sprint 2)".
   - System updates sprint state to `closed` and records `completed_at`.
4. **Reporting:**
   - Opens Reports tab.
   - Burndown Chart displays actual vs guideline burndown.
   - Velocity Chart records 42 completed story points for CORE Sprint 1.

