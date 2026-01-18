# Buffermate AI

![Buffermate Banner](https://raw.githubusercontent.com/vincentagber/buffermate/main/assets/banner.png)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org/) [![OpenAI](https://img.shields.io/badge/OpenAI-API-green)](https://openai.com/api/)

---

## Overview
Buffermate is a modern, **Buffer‑like** auto‑posting web application that leverages **AI** to generate compelling social media content. It integrates with major platforms (X, Facebook, LinkedIn) and provides a sleek scheduling experience backed by Supabase.

---

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Features
- **Social Auth** – Connect X, Facebook, LinkedIn (and a mock provider for testing).
- **AI‑Powered Content** – Generate post suggestions using the OpenAI API.
- **Scheduling** – Queue posts for future publication with a robust background worker.
- **Supabase Backend** – Utilises Supabase for database, authentication, and storage.
- **Responsive UI** – Built with Next.js and Tailwind CSS for a smooth experience.

---

## Demo
> *A live demo is hosted on Vercel. Replace the placeholder below with a screenshot or GIF of the app in action.*

![Demo Screenshot](https://raw.githubusercontent.com/vincentagber/buffermate/main/assets/demo.png)

---

## Installation
```bash
# Clone the repository
git clone https://github.com/vincentagber/buffermate.git
cd buffermate

# Install dependencies
npm install
```

---

## Configuration
1. **Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and provide the following keys:
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` – from your Supabase dashboard.
   - `SUPABASE_SERVICE_ROLE_KEY` – Supabase Service Role key (Settings → API).
   - `ENCRYPTION_KEY` – 32‑byte base64 string (or any dev string).
   - `OPENAI_API_KEY` – your OpenAI API key.
2. **Database Setup** – Run the SQL in `migrations/init.sql` via the Supabase SQL editor.
3. **Optional Seed Data**
   ```bash
   npx ts-node scripts/seed.ts
   ```

---

## Running Locally
### Frontend
```bash
npm run dev
```
Visit <http://localhost:3000>.

### Background Worker
Open a second terminal and run:
```bash
npm run worker
```
The worker processes scheduled posts.

---

## Deployment
### Vercel (Frontend + API)
1. Push the code to GitHub.
2. Import the repository in Vercel.
3. Add the same environment variables as in `.env.local`.
4. Deploy.

### Render (Worker)
1. Create a **Background Worker** service.
2. Connect the GitHub repo.
3. Build Command: `npm install && npm run build` (or just `npm install` for ts‑node).
4. Start Command: `npm run worker`.
5. Add the required environment variables.

---

## Testing
```bash
npm run test
```
Run the test suite to ensure core functionality works as expected.

---

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. Follow the existing code style and include tests for new features.

---

## License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Credits
**Developed significantly by Vincent Agber.**

---
