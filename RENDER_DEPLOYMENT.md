# 🚀 Deploying BufferMate to Render

This repository is pre-configured for instant deployment on [Render](https://render.com).

---

## ⚡ Option 1: 1-Click Render Blueprint (Recommended)

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\to$ **Blueprint**.
3. Connect your GitHub repository: `https://github.com/vincentagber/buffermate.git`.
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **`buffermate-web`**: Next.js 16 Web Application.
   - **`buffermate-worker`**: Auto-publishing background scheduler.
5. Provide your environment variables (from `.env.production` or table below).
6. Click **Apply** to launch!

---

## 🛠 Option 2: Manual Web Service Setup

If deploying as a standalone Web Service:

1. In Render Dashboard, click **New +** $\to$ **Web Service**.
2. Connect `https://github.com/vincentagber/buffermate.git`.
3. Configure the settings:
   - **Name**: `buffermate-web`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: `Starter` (or `Free`)
4. Under **Environment Variables**, click **Add from .env** or copy the table below.
5. Click **Create Web Service**.

---

## 🔐 Required Production Environment Variables

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables Next.js production optimizations |
| `NEXT_PUBLIC_APP_URL` | `https://buffermate-web.onrender.com` | Your Render app URL or custom domain |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sgsmadjmfwgvtbqrmbhw.supabase.co` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Public Anon Key |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| `sb_publishable_...` | Supabase Publishable Key |
| `SUPABASE_SERVICE_ROLE_KEY`| `eyJhbGciOi...` | Supabase Private Service Role Key |
| `DATABASE_URL` | `postgresql://postgres:...` | Direct Postgres connection string |
| `ENCRYPTION_KEY` | `9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c` | 32-character AES-256 token encryption key |
| `GEMINI_API_KEY` | `AQ.Ab8RN6JX0NB5...` | Google Gemini API Key |
| `GEMINI_TEXT_MODEL` | `gemini-2.5-flash` | Gemini model for content generation |
| `GEMINI_IMAGE_MODEL` | `gemini-2.5-flash-image` | Model for image synthesis |
| `OPENAI_API_KEY` | `f15e73b6e8a777c577...` | Fallback AI provider key |
| `AI_FORCE_MOCK` | `false` | Set to false for live AI responses |
| `SCHEDULER_MAX_CONCURRENT` | `25` | Concurrency limit for post processing |
| `TIKTOK_CLIENT_KEY` | `awdvm98qc28kdjk5` | TikTok Developer Client Key |
| `TIKTOK_CLIENT_SECRET` | `8czka5XteUDakK3jLRj4gSgcpsS90Gmo` | TikTok Developer Client Secret |
