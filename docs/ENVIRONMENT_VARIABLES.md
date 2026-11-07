# BufferMate AI — Master Environment Variables Dictionary

This document serves as the authoritative specification of all environment variables used across the Next.js Frontend and Laravel Backend applications.

> **CRITICAL SECURITY NOTICE:**
> Never commit `.env` or `.env.production` files containing live credentials to version control. All production values must be provisioned securely via the Vercel and Render management dashboards.

---

## 1. Next.js Frontend Variables (Vercel)

| Variable Name | Required? | Visibility / Scope | Description | Production Example / Format |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | **Yes** | Public (Client & Server) | Canonical URL of the frontend application for callbacks & SEO | `https://buffermate.xyz` |
| `NEXT_PUBLIC_API_URL` | **Yes** | Public (Client & Server) | Public base URL of the Laravel REST API used by browser clients | `https://api.buffermate.xyz` |
| `LARAVEL_API_URL` | **Yes** | Private (Server-only) | Internal/direct URL for server-side proxy rewrites in `next.config.mjs` | `https://api.buffermate.xyz` |
| `NODE_ENV` | **Yes** | System | Node execution environment | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Public (Client & Server) | Supabase project API gateway endpoint | `https://[PROJECT-ID].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| **Yes** | Public (Client & Server) | Supabase anonymous public client key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Private (Server-only) | Administrative key for server-side elevated queries | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `DATABASE_URL` | Optional | Private (Server-only) | Direct PostgreSQL connection string for Prisma or server tasks | `postgresql://user:pass@host:5432/db` |
| `ENCRYPTION_KEY` | **Yes** | Private (Server-only) | 32-character AES secret key for encrypting sensitive tokens | `32_character_hex_or_string_key!` |
| `GEMINI_API_KEY` | Optional | Private (Server-only) | Google Gemini API key for server-side AI fallback routes | `AIzaSy...` |
| `BACHS_API_KEY` | Optional | Private (Server-only) | Bachs Payment Gateway server API key | `bachs_sk_...` |
| `NEXT_PUBLIC_BACHS_PAYMENT_URL`| Optional | Public (Client & Server) | Bachs hosted checkout domain | `https://checkout.bachs.io` |

---

## 2. Laravel Backend Variables (Render API, Worker & Cron)

| Variable Name | Required? | Visibility / Scope | Description | Production Example / Format |
|---|---|---|---|---|
| `APP_NAME` | **Yes** | Backend Server | Display name for the Laravel application | `BufferMate API` |
| `APP_ENV` | **Yes** | Backend Server | Application environment (`production` or `local`) | `production` |
| `APP_KEY` | **Yes** | Backend Server | 32-byte base64 application encryption key | `base64:...` |
| `APP_DEBUG` | **Yes** | Backend Server | Toggle detailed exception stack traces (`false` in production) | `false` |
| `APP_URL` | **Yes** | Backend Server | Public base URL of the API | `https://api.buffermate.xyz` |
| `FRONTEND_URL` | **Yes** | Backend Server | Frontend origin allowed for CORS and cookie sharing | `https://buffermate.xyz` |
| `APP_TIMEZONE` | Optional | Backend Server | Default timezone for scheduling and timestamps | `UTC` |
| `LOG_CHANNEL` | **Yes** | Backend Server | Primary logging output channel | `stderr` |
| `LOG_LEVEL` | **Yes** | Backend Server | Minimum logging verbosity level | `info` |
| `DB_CONNECTION` | **Yes** | Backend Server | Database driver name | `pgsql` |
| `DATABASE_URL` | **Yes** | Backend Server | Full PostgreSQL connection URI | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `SESSION_DRIVER` | **Yes** | Backend Server | Session persistence driver | `database` |
| `QUEUE_CONNECTION` | **Yes** | Backend Server | Queue driver for asynchronous job dispatching | `database` |
| `CACHE_STORE` | **Yes** | Backend Server | Cache driver store | `database` |
| `SUPABASE_URL` | **Yes** | Backend Server | Supabase project API gateway endpoint | `https://[PROJECT-ID].supabase.co` |
| `SUPABASE_JWT_SECRET` | **Yes** | Backend Server | Secret key used to verify Supabase JWT signatures | `your_supabase_jwt_secret` |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Backend Server | Supabase Service Role key (used as fallback JWT verifier) | `eyJhbGciOiJIUzI1Ni...` |
| `ENCRYPTION_KEY` | **Yes** | Backend Server | 32-character key for encrypting social OAuth tokens | `32_character_hex_or_string_key!` |
| `GEMINI_API_KEY` | **Yes** | Backend Server | Google AI Studio Gemini API key for copy & caption generation | `AIzaSy...` |
| `BACHS_API_KEY` | **Yes** | Backend Server | Bachs Payment Gateway Secret Key | `bachs_sk_...` |
| `BACHS_WEBHOOK_SECRET` | **Yes** | Backend Server | HMAC signature secret for verifying Bachs webhook events | `whsec_...` |
| `BACHS_DEFAULT_CURRENCY` | Optional | Backend Server | Default ISO currency code for billing | `USD` |
| `NEWSPILOT_PUBLIC_SITE_URL`| Optional | Backend Server | Canonical target website for NewsPilot automated posting | `https://bokoti.com` |

---

## 3. Configuration Integrity Rules

1. **Token Verification Alignment:** Ensure `SUPABASE_JWT_SECRET` in `buffermate-backend` matches the JWT Secret generated in your Supabase Project Settings (**Settings** -> **API** -> **JWT Secret**). This guarantees that user authentication tokens minted by the frontend are validated cryptographically by the backend.
2. **CORS Alignment:** Ensure `FRONTEND_URL` in `buffermate-backend` exactly matches the domain configured in `NEXT_PUBLIC_APP_URL` on `buffermate-frontend` (including protocol and port, without trailing slash).
3. **Queue Connection Uniformity:** In production, both the web service and the background worker must point to the identical `QUEUE_CONNECTION` and `DATABASE_URL` so jobs dispatched by the API are consumed by the worker.

