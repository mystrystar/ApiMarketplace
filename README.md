# ApiMarketplace

```
ApiMarketplace/
├── backend/          # Express API + Prisma (database lives here)
│   ├── prisma/       # schema, migrations, seed, dev.db
│   └── src/
└── frontend/         # Next.js UI
```

## Prisma (run from `backend/`)

Prisma belongs **inside the backend** — only the API uses the database.

```powershell
cd backend
npm install
copy .env.example .env

npm run db:migrate    # apply migrations
npm run db:seed       # sample admin + consumer + weather API
npm run db:generate   # regenerate client after schema changes
npm run db:studio     # optional GUI
```

`DATABASE_URL` in `.env` is relative to `prisma/schema.prisma` → file `backend/prisma/dev.db`.

## Run apps

```powershell
# Terminal 1 — API :3000
cd backend
npm run dev

# Terminal 2 — UI :3001
cd frontend
npm run dev
```

Frontend: http://localhost:3001 · API: http://localhost:3000/api

**Seed logins:** `admin@marketplace.local` / `admin123` · `consumer@marketplace.local` / `consumer123`
