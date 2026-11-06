# Role-Based Access Control (RBAC) & Permission Scheme

## 1. Role Hierarchy Matrix

| Capability | Super Admin | Project Admin | Scrum Master | Developer | Viewer / Guest |
|---|---|---|---|---|---|
| Create / Delete Projects | Yes | Workspace-level | No | No | No |
| Edit Project Settings | Yes | Yes | No | No | No |
| Manage Project Members | Yes | Yes | No | No | No |
| Create / Edit Sprints | Yes | Yes | Yes | No | No |
| Start / Complete Sprints | Yes | Yes | Yes | No | No |
| Create Work Items (Issues) | Yes | Yes | Yes | Yes | No |
| Edit Assigned Work Items | Yes | Yes | Yes | Yes | No |
| Transition Issue Status | Yes | Yes | Yes | Yes | No |
| Delete Work Items | Yes | Yes | Yes | Own only | No |
| Comment & Attach Files | Yes | Yes | Yes | Yes | Comment only |
| Configure Board & Columns | Yes | Yes | Yes | No | No |
| Manage Automations | Yes | Yes | Yes | No | No |
| View Boards, Backlog & Reports | Yes | Yes | Yes | Yes | Yes |

## 2. Server-Side Enforcement Pattern
Every API mutation checks:
1. **Workspace Context:** Is user in `workspace_members`?
2. **Project Context:** If user is not workspace owner or admin, check `project_members.role`.
3. **Action Authorization:** Ensure `role` has capability before applying DB changes.

