# Agile Reporting & Analytics Computation Specifications

All analytics are computed dynamically against live database records.

---

## 1. Sprint Burndown Chart
- **Inputs:** Active sprint start date, end date, total committed story points or issues, and work item completion timestamps (`completed_at`).
- **Ideal Line:** A linear regression line from total committed points at `start_date` down to 0 at `end_date`.
- **Actual Line:** Daily calculation:
  $$\text{Remaining}(d) = \text{TotalCommitted} - \sum_{\text{completed\_at} \le d} \text{StoryPoints}$$

---

## 2. Velocity Report
- **Inputs:** Last 5 completed sprints for the project.
- **Metrics Computed:**
  - **Committed Points:** Total points assigned to the sprint at the moment it transitioned to `active`.
  - **Completed Points:** Total points of issues in status `done` when sprint was marked `closed`.
  - **Velocity Average:** Mean completed points per sprint:
    $$\text{Average Velocity} = \frac{\sum \text{CompletedPoints}}{N}$$

---

## 3. Cumulative Flow & Work in Progress
- Count of active issues grouped by status (`todo`, `in_progress`, `in_review`, `done`) across time.
- Identifies bottlenecks where `in_review` or `in_progress` accumulates beyond team WIP limits.

---

## 4. Team Workload Distribution
- Aggregation of open issues grouped by `assignee_user_id`:
  - Total issue count.
  - Sum of estimated hours vs logged hours.
  - Sum of story points.

