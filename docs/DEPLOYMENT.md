# BufferMate AI — Production Deployment Guide

This guide outlines the definitive step-by-step procedures for deploying BufferMate AI to production across **Vercel** (Next.js Frontend) and **Render** (Laravel Backend API, Queue Worker, and Cron Scheduler).

---

## 1. Prerequisites & Required Accounts

Before beginning deployment, ensure you have active accounts with:
1. **GitHub:** Repository containing the `buffermate` codebase.
2. **Vercel:** Hosting provider for the Next.js frontend application.
3. **Render:** Cloud container platform for the Laravel API, Queue Worker, and Cron jobs.
4. **Supabase / Managed PostgreSQL:** Production PostgreSQL database instance with connection pooling.
5. **Bachs Payment Gateway:** For subscription billing and checkout sessions.
6. **Google Cloud / AI Studio:** For Gemini API keys.

---

## 2. Architecture & Domain Topology

| Component | Target URL | Platform | Execution Runtime |
|---|---|---|---|
| **Frontend Web App** | `https://yourdomain.com` | Vercel | Node.js 20 / Next.js Edge & Serverless |
| **Backend REST API** | `https://api.yourdomain.com` | Render | Alpine Linux Docker (Nginx + PHP 8.3-FPM) |
| **Background Queue Worker** | *Internal Service* | Render | Docker Background Worker (`artisan queue:work`) |
| **Scheduled Cron Jobs** | *Internal Service* | Render | Docker Cron Job (`* * * * * artisan schedule:run`) |
| **Database** | *Internal Host* | Supabase / Render | PostgreSQL 15+ (with connection pooler) |

---

## 3. Step 1: Database Setup & Migration

1. In Supabase or your managed PostgreSQL provider, create a new production database project.
2. Copy the direct connection string (or pooled connection URI) with password:
   ```text
   postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE]?sslmode=require
   ```
3. Prepare the database schema by executing migrations from your local environment or via a one-off Render deployment shell:
   ```bash
   cd buffermate-backend
   php artisan migrate --force
   ```

---

## 4. Step 2: Backend Deployment on Render

BufferMate provides an automated Infrastructure-as-Code blueprint (`render.yaml`).

### Option A: Automated Deployment via Render Blueprint (Recommended)
1. Log in to your **Render Dashboard** (`dashboard.render.com`).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository (`buffermate`).
4. Render will detect `render.yaml` at the root and automatically define three linked services:
   - `buffermate-api` (Docker Web Service)
   - `buffermate-worker` (Docker Background Worker)
   - `buffermate-scheduler` (Docker Cron Job)
5. Fill in the required secret environment variables prompted in the Render Blueprint UI:
   - `DATABASE_URL`: Your production PostgreSQL connection string.
   - `SUPABASE_URL`: Your Supabase API endpoint.
   - `SUPABASE_JWT_SECRET`: Your Supabase JWT Secret.
   - `FRONTEND_URL`: Your frontend domain (`https://yourdomain.com`).
   - `ENCRYPTION_KEY`: A 32-character encryption key for stored tokens.
   - `GEMINI_API_KEY`: Google Gemini API key.
   - `BACHS_API_KEY` & `BACHS_WEBHOOK_SECRET`: Payment credentials.
6. Click **Apply**. Render will build the Docker container and deploy all three services simultaneously.

### Option B: Manual Service Creation on Render
If configuring services individually:

#### 1. Web API Service:
- **Service Type:** Web Service
- **Runtime:** Docker
- **Root Directory:** (Leave empty, builds from repository root)
- **Docker Context:** `buffermate-backend`
- **DockerfilePath:** `buffermate-backend/Dockerfile`
- **Health Check Path:** `/up`
- **Port:** Render automatically sets `$PORT`. The included Nginx template listens on this port dynamically.

#### 2. Background Queue Worker:
- **Service Type:** Background Worker
- **Runtime:** Docker
- **Docker Context:** `buffermate-backend`
- **DockerfilePath:** `buffermate-backend/Dockerfile`
- **Docker Command:** `php artisan queue:work --tries=3 --timeout=90 --sleep=3`

#### 3. Scheduled Cron Job:
- **Service Type:** Cron Job
- **Runtime:** Docker
- **Docker Context:** `buffermate-backend`
- **DockerfilePath:** `buffermate-backend/Dockerfile`
- **Schedule:** `* * * * *` (Every minute)
- **Docker Command:** `php artisan schedule:run`

---

## 5. Step 3: Frontend Deployment on Vercel

1. Log in to your **Vercel Dashboard** (`vercel.com`).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`buffermate`).
4. In the **Configure Project** screen:
   - **Framework Preset:** Next.js
   - **Root Directory:** Click `Edit` and select `buffermate-frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
5. Configure the following **Environment Variables** in Vercel:
   | Variable | Value / Description | Environment |
   |---|---|---|
   | `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` | Production |
   | `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` | Production |
   | `LARAVEL_API_URL` | `https://api.yourdomain.com` | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production, Preview |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Production |
   | `ENCRYPTION_KEY` | (32 character key matching backend) | Production |
6. Click **Deploy**. Vercel will build and publish the frontend to your assigned edge URL.

---

## 6. Step 4: Custom Domain & DNS Mapping

Configure DNS records with your registrar:

1. **Frontend (`yourdomain.com` and `www.yourdomain.com`):**
   - Add a `CNAME` record pointing `www` to `cname.vercel-dns.com`.
   - Add an `A` record pointing `@` to Vercel's IP: `76.76.21.21`.
2. **Backend API (`api.yourdomain.com`):**
   - In Render, navigate to `buffermate-api` -> **Settings** -> **Custom Domains**.
   - Add `api.yourdomain.com`.
   - In your DNS manager, add a `CNAME` record pointing `api` to your Render service address (e.g. `buffermate-api.onrender.com`).
   - Render automatically provisions a free Let's Encrypt TLS/SSL certificate.

---

## 7. Step 5: Webhook & CORS Final Verification

1. **CORS Verification:** Ensure `FRONTEND_URL` on Render matches your exact custom domain (`https://yourdomain.com`). The backend `config/cors.php` automatically allows this origin and its credentials.
2. **Bachs Payment Webhook:** In your Bachs dashboard, register your production webhook endpoint:
   ```text
   https://api.yourdomain.com/api/v1/payments/webhook
   ```
3. **Health Check Verification:** Test the live health endpoint:
   ```bash
   curl -I https://api.yourdomain.com/up
   # Expected: HTTP/1.1 200 OK
   ```

---

## 8. Rollback & Emergency Procedures

- **Frontend Rollback:** In the Vercel dashboard, open the **Deployments** tab. Locate the previous stable deployment, click the three dots (`...`), and select **Promote to Production**. Rollbacks take effect instantly across the global CDN.
- **Backend Rollback:** In the Render dashboard, open `buffermate-api` -> **Deploys**. Locate the prior successful commit and click **Rollback to this deploy**.
- **Database Rollback:** If a migration requires reversal, execute via an isolated shell:
  ```bash
  php artisan migrate:rollback --step=1 --force
  ```

