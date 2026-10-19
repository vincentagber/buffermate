# "Socially" (BufferMate) SaaS — PRD Implementation & Technical Architecture

This document specifies the technical implementation of the **Social Media Management & Marketing Automation SaaS PRD (`social_media_management_saas_prd.docx`)** within the BufferMate codebase.

---

## 1. Executive Summary & Blueprint

The product is an API-first, multi-workspace social media management operating system designed for teams and agencies. The core workflow adheres strictly to:
$$\text{draft} \longrightarrow \text{approval} \longrightarrow \text{schedule} \longrightarrow \text{publish} \longrightarrow \text{status/report}$$

### Guiding Principles Enforced
1. **Never simulate successful publishing**: When external social provider confirmation is unavailable, actions are flagged as `unknown_reconciling` or `failed` with actionable recovery instructions.
2. **Never fabricate analytics**: All pipeline, metrics, and conversion numbers expose explicit attribution methods, definition criteria, and ISO data freshness timestamps (`asOf`).
3. **Strict separation of powers**: Creators create and edit drafts; Approvers review and approve/reject; Publishing roles (Strategist, Admin, Owner) dispatch to channels. Self-approval by creators is forbidden.
4. **Destination-level isolation**: Cross-channel posts produce independent publish jobs. If destination A succeeds and destination B fails, the parent post transitions to `partially_published`, and retries execute **only** on destination B.

---

## 2. Core Architecture & Modules

### 2.1 Workspace Multitenancy & RBAC Model
- **Database Schema**: `migrations/004_workspaces_rbac_and_publishing_engine.sql`
- **RBAC Service**: `src/lib/services/rbac.ts`
- **Entity**: `workspaces`, `workspace_members`, `audit_logs`

#### Role Permission Matrix

| Role | Permissions & Responsibilities | Approval Authority | Publishing Authority |
| :--- | :--- | :---: | :---: |
| **Workspace Owner** | Full workspace governance, billing, connections, members, all content | Yes | Yes |
| **Workspace Admin** | Member management, connections, approvals, campaigns, reporting | Yes | Yes |
| **Strategist** | Campaign planning, content calendar, drafting, publishing approved posts | No | Yes (Approved Only) |
| **Creator** | Draft content, upload media, edit assigned posts, submit for approval | **No** | **No** |
| **Approver** | Review drafts, approve or request changes with feedback | **Yes** | **No** |
| **Community Manager**| Unified inbox triage, reply to conversations, CRM leads | No | No |
| **Analyst** | Read-only access to campaign reports and analytics | No | No |

#### Tenant Isolation Rules
Every query and mutation requires server-side validation against `workspace_id`. Cross-tenant mutations are blocked (`isTenantIsolated()`). Audit logs automatically redact sensitive credentials (`access_token`, `refresh_token`, `password`, `key`).

---

## 3. Social Provider Capability Registry & Validation

- **Provider Base Contract**: `src/lib/services/social/SocialProvider.ts`
- **Social Manager**: `src/lib/services/social/SocialManager.ts`

Each social network integration declares its supported capabilities individually:
- `create_text`
- `publish_image`
- `publish_video`
- `publish_carousel`
- `schedule`
- `comments_read`
- `comments_reply`
- `inbox_read`
- `inbox_reply`
- `insights_read`
- `ads_manage`
- `account_metrics`

### Network Capability Matrix & Content Constraints

| Platform | Capabilities | Max Text Length | Media Requirements | Max Attachments |
| :--- | :--- | :---: | :--- | :---: |
| **X (Twitter v2)** | `create_text`, `publish_image`, `publish_video`, `schedule`, `comments`, `metrics` | 280 chars | Optional (Text-only allowed) | 4 images / 1 video |
| **Instagram Pro** | `publish_image`, `publish_video`, `publish_carousel`, `schedule`, `inbox`, `metrics` | 2,200 chars | **Strictly required** (No text-only feed posts) | 10 items |
| **Facebook Pages** | `create_text`, `publish_image`, `publish_video`, `publish_carousel`, `schedule`, `ads`, `metrics` | 63,206 chars | Optional (Text-only allowed) | 10 items |
| **LinkedIn Org** | `create_text`, `publish_image`, `publish_video`, `schedule`, `comments`, `metrics` | 3,000 chars | Optional (Text-only allowed) | 9 images / 1 video |
| **TikTok Business**| `publish_video`, `schedule`, `comments`, `metrics` | 2,200 chars | **Video strictly required** | 1 video |
| **Threads API** | `create_text`, `publish_image`, `publish_video`, `schedule`, `comments`, `metrics` | 500 chars | Optional (Text-only allowed) | 10 items |

Attempting an unsupported action returns a typed `UnsupportedCapabilityError`:
```json
{
  "success": false,
  "error": "UNSUPPORTED_CAPABILITY",
  "platform": "instagram",
  "capability": "create_text",
  "message": "Provider 'instagram' does not support capability 'create_text'. Action was rejected."
}
```

---

## 4. Durable Publishing Engine & Background Worker

- **Publishing Service**: `src/lib/services/publishing-engine.ts`
- **Background Worker**: `worker/index.ts`
- **Database Tables**: `publish_jobs`, `publish_attempts`, `approvals`

### Publishing State Machine
```
[Draft / Composer]
       │
       ▼ (Submit for Approval)
  [In Review]
       │
       ├─────────────────────────┐
       ▼ (Approver: Changes)     ▼ (Approver: Approved)
 [Changes Requested]         [Scheduled Queue]
       │                          │
       ▼                          ▼ (Scheduler ticks & locks lease)
  (Edit Draft)              [Publishing (60s Lease Lock)]
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼ (Success)                ▼ (Ambiguous Timeout)      ▼ (Transient/Permanent Fail)
  [Published]              [Unknown / Reconciling]        [Failed / Scheduled Retry]
                                  │                                  │
                                  ▼ (Check Provider Status)          ▼
                             [Reconciled]                 [Partial Multi-Channel Success]
                                                          (Retry only failed destination)
```

### Critical Resiliency Mechanics
1. **Deterministic Idempotency Key**:
   `pub_${workspaceId}_${postId}_${platform}_${scheduledAtTimestamp}` prevents duplicate scheduling and duplicate live publishes.
2. **Atomic Lease Locks**: Worker claims eligible jobs with a 60-second lease lock (`lock_acquired_at`, `lock_expires_at`), preventing duplicate executions across concurrent worker processes.
3. **Ambiguous Timeout Reconciliation**: If an external provider call times out (504, socket hang up), the job transitions to `unknown_reconciling`. The worker calls `reconcileTimeout(idempotencyKey)` to verify whether the post exists on the platform before retrying.
4. **Partial Multi-Channel Isolation**: If a post targets X and Facebook, and X succeeds while Facebook fails:
   - Post status: `partially_published`.
   - `POST /api/publish-jobs/:id/retry` executes **only** on the Facebook destination job. X is never re-published.

---

## 5. Autopilot Automation Guardrails & Emergency Kill Switch

- **Service**: `src/lib/services/autopilot-guardrails.ts`
- **Database Tables**: `automation_rules`, `automation_runs`

### Guardrail Policies
1. **Emergency Kill Switch**: Per-workspace or global kill switch halts all automation immediately (`code: KILL_SWITCH_ACTIVE`).
2. **Quiet Hours**: Evaluates current local time in recipient/workspace timezone (default `22:00` to `07:00`). Actions are held until morning hours.
3. **Restricted Terms Escalation**: Searches for banned keywords ("guarantee", "crypto giveaway", "wire transfer", "100% risk free"). Triggers escalation for human review instead of auto-dispatch.
4. **Duplicate Content Prevention**: Computes 48-hour content similarity hashes. Identical content is blocked from re-dispatch.
5. **Rate Limiting**: Enforces max 10 actions/hr per channel and 50 daily actions per workspace.
6. **Dry-Run Simulation**: `is_dry_run = true` evaluates triggers, rules, and guardrails, generating audit records with **0 live external calls**.

---

## 6. Command Center Data Contract (PRD Section 19)

Endpoint: `GET /api/dashboard/stats?workspaceId=:id`

```json
{
  "success": true,
  "data": {
    "contract": {
      "workspace": {
        "id": "ws_northstar_main",
        "name": "Northstar Agency",
        "timezone": "Africa/Lagos",
        "role": "owner"
      },
      "asOf": "2026-10-19T12:30:00.000Z",
      "pipeline": {
        "value": 184200,
        "currency": "USD",
        "changePercent": 31,
        "periodDays": 30,
        "attributionMethod": "crm_campaign_match",
        "dataStatus": "available",
        "isEstimate": false
      },
      "qualifiedLeads": {
        "value": 412,
        "changePercent": 22,
        "periodDays": 30,
        "definition": "Workspace-defined MQL criteria (high-intent DM keyword triggers)",
        "source": "BufferMate SocialFlow Ingestion"
      },
      "goals": [
        {
          "id": "goal_1",
          "name": "Generate 500 Qualified Leads",
          "current": 412,
          "target": 500,
          "unit": "leads",
          "status": "on_track",
          "owner": "Growth Team"
        }
      ],
      "autopilot": {
        "enabled": true,
        "killed": false,
        "actionsToday": 146,
        "escalated": 3,
        "blocked": 6,
        "rolledBack": 0,
        "lastRunAt": "2026-10-19T12:28:00.000Z"
      },
      "attention": [
        {
          "type": "approval_pending",
          "count": 2,
          "message": "2 content drafts pending review from Approvers",
          "actionUrl": "/dashboard?view=campaigns&filter=in_review"
        }
      ]
    }
  }
}
```

---

## 7. Operational Runbooks & Provider Limitations

### 7.1 Provider Review & App Capabilities
- **Meta (Facebook & Instagram)**: Requires Meta App Review for `pages_manage_posts`, `instagram_content_publish`, and `pages_read_engagement`. Professional/Business Instagram accounts connected to a Facebook Page are required for direct publishing.
- **LinkedIn**: Organization page posting requires `w_organization_social` scope and member administrative rights on the target LinkedIn Page.
- **X (Twitter API v2)**: Requires elevated or Pro API tier for automated write dispatches. Standard Basic tier limits tweet posting rate.
- **TikTok**: Direct video upload requires TikTok for Developers App Review for Content Posting API (`video.upload`, `video.publish`).

### 7.2 Incident Response Runbook
1. **Spam Outbreak or Malfunctioning Rule**:
   - Navigate to Command Center.
   - Click **Kill Switch** on the Autopilot card, or call `POST /api/autopilot/kill-switch` with `enableKill: true`.
   - All automations immediately pause without impacting manual composer dispatches.
2. **Provider API Outage / Ambiguous Timeout**:
   - The publishing engine marks jobs as `unknown_reconciling`.
   - Run status reconciliation before retrying to prevent duplicate posts.
   - Check dead-letter queue in `publish_jobs` where `status = 'failed'`.
3. **Token Expiry & Re-auth**:
   - When OAuth tokens reach `expires_at`, background token refresh rotates credentials.
   - If user revoked permission, connection enters `needs_reauth` and alert item is added to the Attention Queue.

### 7.3 Environment Provider Configuration Matrix & Blocker Register

In accordance with strict PRD integrity requirements, the system executes real API calls and rejects simulated success states. The table below details the real-world operational status of each provider in the deployment environment:

| Platform / Provider | Configuration Status | Real API Endpoint / Mechanism | Current Operational State & Blocker Analysis |
| :--- | :---: | :--- | :--- |
| **X (Twitter API v2)** | **CONFIGURED** | `https://api.twitter.com/2/tweets` (OAuth 2.0 PKCE / User Bearer) | **Live Credentials Present**: `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, `TWITTER_BEARER_TOKEN`, `TWITTER_ACCESS_TOKEN`. Live API queries to `api.twitter.com` confirm credentials are authentic. Twitter API v2 correctly returns **HTTP 402 Payment Required: credits depleted** (`https://api.x.com/2/problems/credits-depleted`). Surfaced honestly without fake tweets. |
| **Facebook Pages & Messenger** | **BLOCKED** | `https://graph.facebook.com/v20.0/{page_id}/feed` (Graph API) | **Blocked on Credentials**: `FACEBOOK_APP_ID=your_facebook_app_id` (placeholder), `FACEBOOK_PAGE_ACCESS_TOKEN` is empty. Connecting or publishing returns `PROVIDER_NOT_CONFIGURED` with actionable resolution steps. |
| **Instagram Professional** | **BLOCKED** | `https://graph.facebook.com/v20.0/{ig_user_id}/media_publish` | **Blocked on Credentials**: `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_ACCOUNT_ID` are empty. 2-step media container publishing flow is fully implemented and validated against real payload schema. |
| **TikTok for Business** | **BLOCKED** | `https://open.tiktokapis.com/v2/post/publish/video/init/` | **Blocked on User Token**: `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET` are configured; awaiting merchant/creator OAuth authorization for `TIKTOK_ACCESS_TOKEN`. |
| **LinkedIn Organization** | **BLOCKED** | `https://api.linkedin.com/v2/ugcPosts` (UGC Post API v2) | **Blocked on Credentials**: `LINKEDIN_CLIENT_ID=your_linkedin_client_id` (placeholder). Live API calls require production developer application approval for `w_member_social` and `w_organization_social`. |
| **Threads API** | **BLOCKED** | `https://graph.threads.net/v1.0/me/threads_publish` | **Blocked on Credentials**: `THREADS_ACCESS_TOKEN` is unconfigured. 2-step container creation and publish flow implemented per Threads Graph v1.0 specifications. |
| **Mock Provider** | **TEST HARNESS ONLY** | In-memory synchronous test double | **Unit Test Suite Only**: Reserved exclusively for engine unit tests (`platform === 'mock'`) to test lease locks, idempotency collisions, and timeout retries without third-party network egress. |

---

## 8. Verification & Test Execution

Run the automated test suites:
```bash
# 1. PRD Compliance Test Suite (Tenancy, RBAC, Capabilities, Idempotency, Guardrails)
npm run test:prd

# 2. Real-Time Channel Lifecycle Test Suite (OAuth, Token Rotation, Reconnection)
npm run test:social

# 3. Integrations Event & Summary Test Suite
npm run test:integrations

# 4. Strict TypeScript Typecheck
npx tsc --noEmit
```

All 4 test suites pass with **100% compliance**!
