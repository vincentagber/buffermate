# Buffermate AI

A Buffer-like auto-posting web app with AI content generation.

## Features
- **Social Auth**: Connect X, Facebook, LinkedIn (and Mock provider).
- **AI Content**: Generate post suggestions using OpenAI.
- **Scheduling**: Schedule posts for future publication.
- **Worker**: Background worker handles posting at scheduled times.
- **Supabase**: Database, Auth, and Storage.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys.
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Supabase Dashboard.
   - `SUPABASE_SERVICE_ROLE_KEY`: From Supabase Dashboard (Settings > API).
   - `ENCRYPTION_KEY`: Generate a 32-byte base64 key (or use any string for dev).
   - `OPENAI_API_KEY`: Your OpenAI key.

3. **Database Setup**
   Run the SQL in `migrations/init.sql` in your Supabase SQL Editor.

4. **Seed Data (Optional)**
   ```bash
   npx ts-node scripts/seed.ts
   ```

## Running Locally

1. **Start the App**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

2. **Start the Worker**
   Open a new terminal:
   ```bash
   npm run worker
   ```

## Deployment

### Vercel (Frontend + API)
1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables.
4. Deploy.

### Render (Worker)
1. Create a "Background Worker" service.
2. Connect GitHub repo.
3. Set Build Command: `npm install && npm run build` (or just `npm install` if running ts-node).
4. Set Start Command: `npm run worker`.
5. Add Environment Variables.

## Testing
```bash
npm run test
```
