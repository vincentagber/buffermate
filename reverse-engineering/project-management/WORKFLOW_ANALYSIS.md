# BufferMate Workflow Engine Analysis & State Machine Specification

## 1. Workflow Architecture & Philosophy
In enterprise project workflows, an issue cannot move into an arbitrary status unless there is an explicit directed transition path defined in its active Workflow Scheme. Each workflow consists of:
- **Statuses:** Steps representing the state of an issue (e.g. `BACKLOG`, `TO_DO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`).
- **Transitions:** Directed edges connecting a source status to a destination status.
- **Conditions:** Determines whether a user has permission or whether the issue meets criteria to see the transition.
- **Validators:** Checks data integrity before executing the transition (e.g. required resolution, time logged, comment).
- **Post-Functions / Actions:** Automated side-effects executing upon transition (e.g. set resolution, update timestamp, trigger notifications).

## 2. Standard Agile Workflow State Machine

```
                   +------------------+
                   |     BACKLOG      |
                   +--------+---------+
                            |
                   (Move to Ready / Plan)
                            v
                   +------------------+ <-------------------+
     +-----------> |      TO DO       |                     |
     |             +--------+---------+                     |
     |                      |                               |
(Send Back)            (Start Work)                     (Re-open)
     |                      v                               |
     |             +------------------+                     |
     +------------ |   IN PROGRESS    |                     |
                   +--------+---------+                     |
                            |                               |
                    (Submit for QA)                         |
                            v                               |
                   +------------------+                     |
                   |    IN REVIEW     | --------------------+
                   +--------+---------+
                            |
                     (Pass Review)
                            v
                   +------------------+
                   |       DONE       |
                   +------------------+
```

## 3. Configurable Status Dictionary
1. `backlog`: In triage or future sprint planning. Category: `To Do`.
2. `todo`: Committed for active work or sprint. Category: `To Do`.
3. `in_progress`: Currently being actively developed. Category: `In Progress`.
4. `in_review`: Pending code review, QA verification, or stakeholder sign-off. Category: `In Progress`.
5. `blocked`: Blocked by external dependency or impediment. Category: `In Progress`.
6. `done`: Work completed and accepted. Category: `Done`.
7. `cancelled`: Aborted or marked as won't fix. Category: `Done`.

## 4. Status-to-Board-Column Mapping
Boards are flexible viewports over workflows:
- A Kanban or Scrum board defines 3 to 6 columns.
- Multiple workflow statuses can map to a single column (e.g., Column "In Progress" maps to both `in_progress` and `in_review`).
- When a card is dragged into a column, the default status for that column is assigned, or a transition selector appears if multiple paths exist.

