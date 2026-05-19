# API Marketplace With Usage Metering

Mini RapidAPI-style platform where admins list dummy APIs, users buy quota packs, receive API keys, and every public API call is authenticated, metered, logged, and deducted from quota.

## Stack

- Frontend: Next.js, React, TypeScript
- Backend: Node.js, Express
- Database: SQLite
- ORM: Prisma
- Auth: JWT, bcrypt

## Features

- User signup/login and admin/user role protection
- Admin catalog CRUD with GET/POST method support
- Optional upstream base URL
- Mock API purchase and quota refill/top-up
- API key generation, regeneration, and hashed lookup
- Public metered endpoint: `/v1/:apiSlug`
- Quota decrement, call logging, status codes, response time, IP tracking
- User dashboard, recent activity, logs, CSV export
- Admin dashboard: users, purchases, logs, revenue, top APIs/users
- Soft delete for APIs
- Auto-generated docs page per API
- In-memory API key rate limit: `10 calls/sec`

## Setup

Backend:

```powershell
cd backend
npm install
copy .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

URLs:

```text
Frontend: http://localhost:3001
Backend:  http://localhost:3000
Health:   http://localhost:3000/api/health
```

## Environment

`backend/.env`

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@marketplace.local
ADMIN_PASSWORD=admin123
```

Optional `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Seeded Logins

Admin:

```text
admin@marketplace.local / admin123
```

Sample user:

```text
consumer@marketplace.local / consumer123
```

## Main API Routes

Auth:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Catalog/user:

```text
GET  /api/apis
GET  /api/apis/:id
POST /api/apis/:id/purchase
GET  /api/users/dashboard
GET  /api/users/logs
POST /api/users/subscriptions/:subscriptionId/api-key/regenerate
```

Admin:

```text
GET    /api/admin/analytics
GET    /api/admin/users
GET    /api/admin/users/:id
GET    /api/admin/apis
POST   /api/admin/apis
PATCH  /api/admin/apis/:id
DELETE /api/admin/apis/:id
GET    /api/admin/purchases
GET    /api/admin/logs
```

Create API example:

```json
{
  "title": "Weather API",
  "slug": "weather",
  "method": "POST",
  "description": "Sample weather API",
  "baseUrl": null,
  "category": "data",
  "pricePerCall": 0.01,
  "defaultQuota": 10,
  "dummyResponse": { "message": "Sunny" },
  "status": "APPROVED"
}
```

## Metered Calls

Public endpoint:

```text
GET|POST /v1/:apiSlug
Header: x-api-key: YOUR_API_KEY
```

POST example:

```powershell
curl -X POST "http://localhost:3000/v1/weather" `
  -H "x-api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d "{ `"sample`": true }"
```

GET example:

```powershell
curl -X GET "http://localhost:3000/v1/weather" `
  -H "x-api-key: YOUR_API_KEY"
```

Metering flow:

```text
validate API key -> check subscription -> check method -> check quota
-> rate limit -> decrement quota -> log call -> return dummy response
```

Common errors:

```text
401 MISSING_API_KEY / INVALID_API_KEY
403 NO_SUBSCRIPTION
405 METHOD_NOT_ALLOWED
429 QUOTA_EXHAUSTED / RATE_LIMITED
```

## Frontend Pages

User:

```text
/marketplace
/marketplace/:id/docs
/dashboard
/logs
```

Admin:

```text
/admin
/admin/apis
/admin/users
/admin/purchases
/logs
```

## Notes

- Payments are mocked with Buy/Refill buttons.
- API keys are looked up by hash.
- Rate limiting is in-memory and resets on backend restart.
- If Prisma Client generation fails on Windows, stop the backend and rerun `npm run db:generate`.
