# ReflectAI – Deployment Guide

## Prerequisites
- Node.js 18+
- A [Vercel](https://vercel.com) account (free tier works)
- Vercel CLI: `npm install -g vercel`

## Local development

```bash
cd reflectai
npm install
npm run dev
# Visit http://localhost:3000
```

## Deploy to Vercel (recommended)

### Option A – Vercel CLI

```bash
cd reflectai
npm run build      # Verify build passes locally first
vercel             # First time: follow prompts to link project
vercel --prod      # Deploy to production
```

### Option B – GitHub integration (zero-config)

1. Push the `reflectai/` folder to a GitHub repository.
2. Visit [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no configuration needed.
4. Click **Deploy**. Your app goes live in ~2 minutes.

## Important notes

- **No environment variables required** – ReflectAI is fully client-side for the MVP.
- **No backend / API routes** – no server costs.
- **Data stays on each user's device** – Vercel only serves static assets.
- All data is stored in the visitor's browser (IndexedDB). Data does not transfer between devices or browsers.

## Build output check

```bash
npm run build
# Expected: ✓ Compiled successfully
# All pages should be static or client-side rendered
```

## Custom domain (optional)

1. In Vercel dashboard → your project → **Settings → Domains**.
2. Add your domain and follow DNS instructions.
