# BufferMate AI — Multi-Tenant Social Media Management & Syndication Platform

[![CI Pipeline](https://github.com/vincentagber/buffermate/actions/workflows/ci.yml/badge.svg)](https://github.com/vincentagber/buffermate/actions/workflows/ci.yml)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![Laravel 11](https://img.shields.io/badge/Backend-Laravel%2011-red?logo=laravel)](https://laravel.com/)
[![PHP 8.3](https://img.shields.io/badge/PHP-8.3-blue?logo=php)](https://php.net/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20Postgres-3ecf8e?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

BufferMate AI is a production-grade multi-tenant social media management, content syndication, and AI-assisted publishing SaaS platform. It enables creators, marketing agencies, and editorial teams to schedule multi-platform posts, automate RSS headline publishing (NewsPilot), collaborate across workspaces, and monetize via tiered subscriptions.

---

## Architecture Overview

BufferMate AI is engineered as an enterprise-grade monorepo designed for independent multi-cloud deployment:

```text
buffermate/
├── buffermate-frontend/     # Next.js 16 App Router (React 19, TypeScript, Tailwind) -> Deploy to Vercel
├── buffermate-backend/      # Laravel 11 REST API (PHP 8.3, Nginx, Docker) -> Deploy to Render
├── render.yaml              # Render Blueprint Infrastructure-as-Code specification
├── .github/workflows/ci.yml # Automated CI pipeline running unit tests, linting, and builds
└── docs/                    # Complete architectural, deployment, and security documentation
```

### Production Deployment Topology

| Component | Target URL | Deployment Host | Technology |
|---|---|---|---|
| **Frontend Web App** | `https://yourdomain.com` | **Vercel** | Next.js 16 (React 19), Edge CDN |
| **Backend API** | `https://api.yourdomain.com` | **Render** | Docker Container (Alpine + Nginx + PHP 8.3-FPM) |
| **Background Worker** | *Private Service* | **Render** | Docker Background Worker (`artisan queue:work`) |
| **Cron Scheduler** | *Private Service* | **Render** | Docker Scheduled Job (`* * * * * artisan schedule:run`) |
| **Database** | *Private Cloud* | **Supabase / Render** | Managed PostgreSQL (v15+) |

---

## Key Features

- **Multi-Tenant Workspaces:** Strict tenant data isolation with role-based member permissions and custom branding.
- **Multi-Platform Publishing:** Schedule and publish content across X (Twitter), Facebook, Instagram, LinkedIn, TikTok, and Threads.
- **NewsPilot Syndication:** Automated RSS feed ingestion, AI headline optimization, and multi-channel editorial syndication.
- **AI Content Studio:** Google Gemini 1.5 & OpenAI integration for high-engagement copy generation, hashtag discovery, and banner visuals.
- **Centralized Social Inbox:** Real-time social engagement tracking, comments, and conversation workflows.
- **Bachs Payment Gateway:** Full subscription checkout flow, plan upgrades (Pro, Agency), and HMAC-verified webhooks.
- **Cryptographic Security:** End-to-end Supabase JWT HMAC-SHA256 signature verification, strict CORS policies, and AES token encryption.

---

## Documentation Suite

Comprehensive engineering documentation is available in the [`docs/`](docs/) directory:

- [**System Architecture (`docs/ARCHITECTURE.md`)**](docs/ARCHITECTURE.md): Detailed component diagrams, request lifecycles, and data model isolation.
- [**Production Deployment Guide (`docs/DEPLOYMENT.md`)**](docs/DEPLOYMENT.md): Step-by-step deployment runbooks for Vercel, Render Blueprints, database migrations, and domain setup.
- [**Environment Variables Dictionary (`docs/ENVIRONMENT_VARIABLES.md`)**](docs/ENVIRONMENT_VARIABLES.md): Authoritative reference for every frontend and backend environment setting.
- [**Security Audit & Remediation (`docs/SECURITY_AUDIT.md`)**](docs/SECURITY_AUDIT.md): Detailed report of security audits, CVE mitigations, and hardening measures.
- [**Production Readiness Checklist (`docs/PRODUCTION_READINESS.md`)**](docs/PRODUCTION_READINESS.md): Verification matrix classifying all layers by operational state.

---

## Local Development Quickstart

### Prerequisites
- Node.js 20+ and npm
- PHP 8.3+ with `pdo_sqlite` or `pdo_pgsql`, `mbstring`, `bcmath`, `curl`
- Composer 2+

### 1. Clone & Setup Frontend
```bash
cd buffermate-frontend
cp .env.example .env.local
npm install
npm run dev
# Running on http://localhost:3000
```

### 2. Setup Backend API
```bash
cd buffermate-backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=8001
# Running on http://localhost:8001
```

### 3. Run Queue Worker & Scheduler (Locally)
```bash
cd buffermate-backend
php artisan queue:work
# In another terminal:
php artisan schedule:work
```

---

## Automated Testing & CI

BufferMate includes automated testing and linting across both applications:

```bash
# Frontend Lint & Production Build
cd buffermate-frontend
npm run lint
npm run build

# Backend Feature & Unit Tests
cd buffermate-backend
php artisan test
```

Continuous integration runs automatically on every commit via GitHub Actions (`.github/workflows/ci.yml`).

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
