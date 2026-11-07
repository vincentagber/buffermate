# BufferMate AI — System Architecture & Technical Design

## 1. Executive Summary & Overview

BufferMate AI is a production-grade multi-tenant Social Media Management & Automated Content Publishing Platform designed for creators, marketing agencies, and modern newsrooms. The platform combines scheduled multi-channel distribution, AI-assisted content drafting and image generation, automated RSS/News syndication (NewsPilot), social inbox management, team collaboration workflows, and tiered subscription monetization.

The system is architected as a cohesive **Monorepo** comprising an optimized Next.js 16 frontend and an asynchronous Laravel 11 REST API backend, coupled with Supabase for centralized PostgreSQL persistence, user authentication, and real-time subscription state.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Clients ["Client Layer"]
        Browser["End User Browser / Mobile Web"]
    end

    subgraph Edge ["Edge & CDN Layer (Vercel)"]
        VercelEdge["Vercel Edge Network / SSL"]
        NextApp["Next.js 16 App Router (React 19)"]
        ClientAPI["Centralized API Client (src/lib/api-client.ts)"]
    end

    subgraph AuthLayer ["Identity & Authorization"]
        SupaAuth["Supabase Auth (JWT ES256/HS256)"]
    end

    subgraph BackendAPI ["API & Execution Layer (Render)"]
        NginxGateway["Nginx Reverse Proxy (Dynamic $PORT)"]
        LaravelApp["Laravel 11 PHP 8.3-FPM API Engine"]
        QueueWorker["Background Queue Worker (queue:work)"]
        CronScheduler["Task Scheduler (schedule:run)"]
    end

    subgraph Persistence ["Persistence & Storage"]
        PostgresDB[("Supabase / Managed PostgreSQL")]
        S3Storage["Persistent Asset Storage (S3 / Cloudinary)"]
    end

    subgraph External ["External Third-Party APIs"]
        SocialPlatforms["Social APIs (Meta, X, TikTok, LinkedIn, Threads)"]
        AIProviders["Google Gemini 1.5 & OpenAI APIs"]
        BachsGateway["Bachs Checkout & Webhook API"]
    end

    Browser -->|HTTPS / Browsing| VercelEdge
    VercelEdge --> NextApp
    NextApp --> ClientAPI
    Browser -->|Login / Session| SupaAuth
    ClientAPI -->|REST API with Bearer JWT & X-Workspace-Id| NginxGateway
    NginxGateway --> LaravelApp
    LaravelApp -->|Verify JWT Cryptographic Signature| SupaAuth
    LaravelApp -->|Read / Write Tenant Scoped Data| PostgresDB
    QueueWorker -->|Process Jobs (Social Post, RSS Scrape)| PostgresDB
    QueueWorker -->|Publish Content| SocialPlatforms
    QueueWorker -->|Generate Captions / Images| AIProviders
    CronScheduler -->|Trigger Periodic Tasks| QueueWorker
    BachsGateway -->|Webhooks with HMAC SHA256| LaravelApp
```

---

## 3. Monorepo Organization

```text
buffermate/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI pipeline for Frontend & Backend
├── buffermate-frontend/           # Next.js 16 Frontend Web Application
│   ├── src/
│   │   ├── app/                   # App Router pages and route handlers
│   │   │   ├── api/               # Server-side proxy and OAuth callback routes
│   │   │   ├── dashboard/         # Multi-tenant workspace authenticated dashboard
│   │   │   └── ...                # Marketing and public landing pages
│   │   ├── components/            # Reusable UI component library (Shadcn/Tailwind)
│   │   ├── hooks/                 # Custom React state and data hooks
│   │   ├── lib/                   # Centralized API client, Supabase browser client, utils
│   │   └── types/                 # TypeScript interfaces and schema types
│   ├── next.config.mjs            # Production proxy rewrites and image security policies
│   ├── vercel.json                # Vercel routing rules and HTTP security headers
│   └── package.json
│
├── buffermate-backend/            # Laravel 11 REST API & Background Engine
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/       # REST API endpoints (Workspace, Post, Payment, NewsPilot)
│   │   │   └── Middleware/        # JWT Verification, CORS, Workspace Tenant Scoping
│   │   ├── Jobs/                  # Asynchronous execution jobs (PublishPost, ScrapeRSS)
│   │   ├── Models/                # Eloquent models with workspace isolation scopes
│   │   └── Services/              # Core business logic (BachsPaymentService, AI Studio)
│   ├── config/                    # Framework configuration (cors, database, services, cache)
│   ├── database/                  # Schema migrations, seeders, and factories
│   ├── docker/                    # Production Alpine Nginx + PHP 8.3-FPM container assets
│   │   ├── nginx.conf.template    # Dynamic Render $PORT substitution template
│   │   ├── opcache.ini            # Production PHP bytecode caching optimization
│   │   └── docker-entrypoint.sh   # Polyglot entrypoint (API Web, Queue Worker, Cron Scheduler)
│   ├── routes/                    # API route definitions (routes/api.php, routes/web.php)
│   ├── tests/                     # Automated PHPUnit / Pest Feature and Unit tests
│   ├── composer.json
│   └── Dockerfile                 # Multi-stage production container build
│
├── docs/                          # Comprehensive technical and deployment documentation
│   ├── ARCHITECTURE.md            # System architecture and design (This document)
│   ├── DEPLOYMENT.md              # Production deployment runbooks for Vercel & Render
│   ├── ENVIRONMENT_VARIABLES.md   # Unified environment variable dictionary
│   ├── SECURITY_AUDIT.md          # Security audit report and vulnerability remediations
│   └── PRODUCTION_READINESS.md    # Production verification checklists
│
├── render.yaml                    # Render Blueprint Infrastructure-as-Code specification
└── README.md                      # Developer onboarding and project overview
```

---

## 4. Frontend Architecture (Next.js 16 / React 19)

### 4.1. Rendering Strategy & Component Boundaries
- **Server Components (Default):** Static marketing layouts, metadata generation, and initial server renders execute at the edge for optimal TTFB and SEO.
- **Client Components (`'use client'`):** Interactive dashboards, visual content schedulers, live preview simulator modals, rich text editors, and chart visualizations operate with fine-grained React state.

### 4.2. Centralized Resilient API Client (`src/lib/api-client.ts`)
All communication with the Laravel backend flows through a unified HTTP client with:
1. **Dynamic Base URL Resolution:** Respects `NEXT_PUBLIC_API_URL` with graceful fallback to relative `/api/v1` rewrites.
2. **Transparent Authentication:** Automatically acquires active Supabase session JWT tokens and injects the `Authorization: Bearer <token>` header.
3. **Tenant Context Propagation:** Automatically reads and attaches the `X-Workspace-Id` header to every outgoing request.
4. **Timeout Handling:** Configured with an 8-second default timeout using `AbortController` to prevent hanging connections.
5. **Standardized Error Handling:** Transforms API responses into typed `ApiError` instances containing HTTP status codes, structured validation messages, and server errors.

---

## 5. Backend Architecture (Laravel 11 / PHP 8.3)

### 5.1. Authentication & Security Middleware
- **VerifySupabaseToken:** Intercepts protected API routes. Validates incoming JWT format and cryptographically checks HMAC-SHA256 signatures against `SUPABASE_JWT_SECRET` / `SUPABASE_SERVICE_ROLE_KEY`. Protects against signature spoofing, rejects expired tokens, and creates or syncs local user records.
- **EnsureWorkspaceAccess:** Validates that the authenticated user possesses authorized membership in the tenant requested via `X-Workspace-Id`.

### 5.2. Asynchronous Queue & Background Architecture
- **Queue System:** Utilizes Laravel's database queue driver configured with exponential retry backoff (`--tries=3 --timeout=90`).
- **Heavy Operations Offloaded:**
  - NewsPilot automated RSS parsing and headline syndication.
  - Multi-platform social media API distribution (Meta Graph API, X API v2, LinkedIn Share API, TikTok Content API).
  - AI copy generation and banner rendering via Google Gemini 1.5.

### 5.3. Task Scheduling Architecture
The Laravel scheduler (`schedule:run`) executes every minute in an independent Render Cron container:
- Triggers scheduled social post dispatching (`posts:publish-scheduled`).
- Runs RSS feed polling and automated syndication cycles.
- Prunes expired cache entries and transient webhook logs.

---

## 6. Multi-Tenant Data Isolation Strategy

Data isolation across workspaces is enforced at multiple layers:
1. **Database Schema:** Every tenant-scoped entity (`posts`, `social_accounts`, `campaigns`, `news_pilot_sources`, `team_members`) maintains a foreign key reference to `workspace_id`.
2. **Eloquent Global Scopes:** Models implement tenant query filtering to prevent cross-tenant data leakage.
3. **Controller-Level Authorization:** Controllers verify `$user->workspaces()->where('workspaces.id', $workspaceId)->exists()` before reading or mutating resources.

