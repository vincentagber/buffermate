# BufferMate Project & Task Management Engine

## Executive Summary
This workspace documents the architecture, data models, workflows, and specifications of BufferMate AI's Enterprise Project and Task Management core capabilities. The engine provides production-ready project and task management within the BufferMate monorepo, preserving application architecture, authentication, and database integrity while delivering modern issue hierarchy, agile planning (Scrum & Kanban), automation, custom fields, dependencies, and analytics.

## Core Capabilities
- **Domain:** Project Tracking, Work Item Lifecycle, Agile Boards (Scrum/Kanban), Workflows, Automation Rules, Querying, Velocity & Burndown reporting.
- **Scope Limit:** Project and task management capabilities integrated seamlessly with BufferMate AI social media scheduling and omni-channel customer service desk.

## Target Architecture
- **Backend:** Laravel 11 (`buffermate-backend`), PHP 8.5, SQLite / PostgreSQL, Tenant Scoping via Workspace Isolation.
- **Frontend:** Next.js 16 (`buffermate-frontend`), TypeScript, Tailwind CSS, Lucide Icons, Supabase Realtime & SSE Stream.
- **Database:** Normalized relational schema with foreign key constraints, indexes, cascade policies, and audit trails.

## Directory Manifest
1. `README.md` - Executive summary, tools inventory, and architectural overview.
2. `FEATURE_INVENTORY.md` - Complete functional breakdown with parity status tracking.
3. `PRODUCT_ARCHITECTURE.md` - System architecture, component relationships, data flow, and domain models.
4. `USER_JOURNEYS.md` - Step-by-step user workflows from project inception to delivery.
5. `WORKFLOW_ANALYSIS.md` - Finite state machine, transition conditions, validators, post-functions, and column mapping.
6. `DATABASE_DESIGN.md` - Normalized ERD, tables, columns, indexes, foreign keys, and migration blueprints.
7. `API_SPECIFICATION.md` - RESTful API contract for projects, work items, sprints, boards, workflows, comments, and automations.
8. `RBAC_AND_PERMISSIONS.md` - Role hierarchy (Project Admin, Scrum Master, Lead, Developer, Viewer) and permission scheme matrix.
9. `UI_COMPONENT_INVENTORY.md` - Detailed catalog of frontend views, modals, drawers, board columns, work item detail view, and agile tools.
10. `AUTOMATION_ENGINE.md` - Trigger -> Condition -> Action execution pipeline and event listeners.
11. `REPORTING_AND_ANALYTICS.md` - Computational specifications for Burndown, Velocity, Cumulative Flow, and Workload distributions.
12. `IMPLEMENTATION_ROADMAP.md` - Staged rollout prioritized by P0 (Core), P1 (Agile & Collab), P2 (Automation & Reports), P3 (Enterprise Workflows).
13. `TESTING_STRATEGY.md` - Unit, integration, authorization isolation, and regression verification plan.
14. `REVERSE_ENGINEERING_LOG.md` - Audit log of architectural decisions, implementation milestones, and change history.
