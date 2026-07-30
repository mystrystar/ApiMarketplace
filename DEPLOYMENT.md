# Deploy to Netlify with free PostgreSQL

This repository deploys as one Netlify site:

- Next.js frontend: normal site pages
- Express backend: Netlify Function, reached through `/api/*` and `/v1/*`
- PostgreSQL: an external managed database

The frontend and backend share one domain in production. Do not set `NEXT_PUBLIC_API_URL` on Netlify; the frontend will correctly use its default relative `/api` URL.

## 1. Create a free PostgreSQL database with Neon

1. Go to [Neon](https://neon.tech), create a free account, and choose **Create project**.
2. Select a region close to your users and accept the default PostgreSQL version/database name.
3. From the project dashboard, open **Connect** and copy the pooled connection string. It begins with `postgresql://` and normally includes `sslmode=require`.
4. Keep this connection string private. It is the production `DATABASE_URL`.

Use a separate Neon project (or a separate database) for local development if you do not want local test data mixed with production.

## 2. Run the project locally

Install dependencies once from the repository root:

```powershell
npm install
```

Create `backend/.env` by copying `backend/.env.example`, then set values like these:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/local_database?sslmode=require"
JWT_SECRET=replace-this-with-a-long-random-local-secret
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.test
ADMIN_PASSWORD=choose-a-local-password
CONSUMER_EMAIL=consumer@example.test
CONSUMER_PASSWORD=choose-a-local-password
```

Create the database schema and demo records:

```powershell
cd backend
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

Start the backend in one terminal:

```powershell
cd backend
npm run dev
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:3001`. Confirm `http://localhost:3000/api/health` returns `{ "status": "ok" }`.

## 3. Prepare the repository

Commit the PostgreSQL schema and migration before deploying:

```powershell
git add .
git commit -m "Configure PostgreSQL and Netlify deployment"
git push
```

The `.env` files are ignored and must never be committed. The migration at `backend/prisma/migrations/20260730000000_init_postgresql` creates a fresh PostgreSQL database. It replaces the old SQLite migration history; do not use it to convert an existing SQLite database containing data.

## 4. Apply the production migration

Before the first Netlify deploy, run the production migration from a terminal without placing the connection string in a committed file:

```powershell
cd backend
$env:DATABASE_URL = "PASTE_THE_NEON_POOLED_CONNECTION_STRING_HERE"
npm run db:migrate:deploy
```

To add the optional demo accounts and Weather API, temporarily set the seed values too, then run:

```powershell
$env:ADMIN_EMAIL = "admin@your-domain.com"
$env:ADMIN_PASSWORD = "use-a-strong-password"
$env:CONSUMER_EMAIL = "consumer@your-domain.com"
$env:CONSUMER_PASSWORD = "use-a-strong-password"
npm run db:seed
```

For every future schema change: run `npm run db:migrate` locally to create a migration, commit it, then run `npm run db:migrate:deploy` against production before deploying the new application code. Never run `db:push` or `db:migrate` against production.

## 5. Create the Netlify site

1. Push the project to GitHub.
2. In [Netlify](https://app.netlify.com), choose **Add new project** → **Import an existing project** → GitHub, then select this repository.
3. Leave the repository base directory empty. Netlify uses the root `netlify.toml`.
4. Confirm the build command is `npm run build`. Do not set a publish directory; Netlify detects the Next.js application.
5. Before deploying, open **Project configuration** → **Environment variables** and add these production variables:

```env
DATABASE_URL=your-Neon-pooled-connection-string
JWT_SECRET=a-long-unique-random-production-secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

`JWT_SECRET` must be different from the local value. You can generate one in PowerShell with:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

6. Trigger the deploy. When it finishes, open `https://YOUR-SITE.netlify.app/api/health`; it should return `{ "status": "ok" }`.

## 6. Verify the deployed app

1. Open the Netlify site URL and register an account or use the intentionally-created seed account.
2. Log in, browse the marketplace, and make a purchase.
3. Use the generated API key with your public endpoint:

```powershell
curl.exe -X POST "https://YOUR-SITE.netlify.app/v1/weather" -H "x-api-key: YOUR_API_KEY"
```

## Troubleshooting

- **Netlify build fails while generating Prisma Client:** confirm the root build command remains `npm run build` and the project is deployed from the repository root.
- **Function returns database errors:** re-copy the Neon pooled connection string to Netlify's `DATABASE_URL`, including `sslmode=require`, then redeploy.
- **`/api/health` returns 404:** confirm `netlify.toml` is at the repository root and has been committed.
- **Local frontend cannot reach the API:** confirm `frontend/.env.local` points to `http://localhost:3000/api`, then restart the Next.js dev server.
- **A migration fails:** do not delete tables or rerun a development migration against production. Check the migration status first with `npm exec --workspace backend prisma migrate status`.
