# API Marketplace

A full-stack, RapidAPI-inspired marketplace where users discover APIs, purchase request quota, receive API keys, and monitor every metered call. Providers and administrators can manage the catalog, subscriptions, purchases, and usage analytics from one application.

**Live application:** [apimarketplaceforapi.netlify.app](https://apimarketplaceforapi.netlify.app/)

**Demo walkthrough:** [Watch on Loom](https://www.loom.com/share/300ecca158cc4bc8bfebf70e5f90fea0)

## What you can do

- Create an account, browse the API catalog, and purchase API quota.
- Receive a subscription API key and call a purchased API through `/v1/:apiSlug`.
- Track request logs, response times, quota consumption, and subscriptions.
- Use the administrator portal to manage APIs, users, purchases, and marketplace analytics.
- Deploy the Next.js frontend and Express API together on Netlify, backed by PostgreSQL.

## Quick links

| Need | Start here |
| --- | --- |
| Use the deployed application | [Live app](https://apimarketplaceforapi.netlify.app/) |
| Run locally | [Getting Started](#getting-started) |
| Deploy your own copy | [Netlify + PostgreSQL deployment](#deploy-to-netlify-with-postgresql) |
| Call a purchased API | [Usage guide](USAGE.md) |
| Full deployment details | [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript

### Backend

* Node.js
* Express

### Database & Auth

* PostgreSQL
* Prisma ORM
* JWT Authentication
* bcrypt password hashing

---

## Features

### Authentication & Access

* User signup/login
* JWT-based authentication
* Role-based access (`ADMIN` / `CONSUMER`)

### API Marketplace

* Browse available APIs
* API purchase and quota top-up
* API key generation & regeneration
* Auto-generated API documentation page
* Support for `GET` and `POST` APIs
* Optional upstream base URL support
* Soft delete for APIs

### Usage Metering

* Public metered endpoint: `/v1/:apiSlug`
* API key authentication
* Quota validation & deduction
* API call logging
* Response time tracking
* Status code logging
* IP tracking
* In-memory rate limiting (`10 calls/sec`)

### Consumer Portal

* Dashboard overview
* Purchase history
* Usage logs
* CSV export
* Subscription management
* API key access & regeneration

### Admin Portal

* API catalog management
* User management
* Purchase tracking
* Revenue insights
* Usage logs
* Top APIs & top users analytics

---

## Getting Started

### Backend Setup

```powershell
cd backend
npm install
copy .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

For a complete local-development and free Netlify deployment guide, see [DEPLOYMENT.md](DEPLOYMENT.md).
For admin and API-key usage examples, see [USAGE.md](USAGE.md).

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

---

## Quick Start

Once both servers are running:

1. Login using seeded credentials
2. Browse APIs in the marketplace
3. Purchase an API subscription
4. Use the generated API key to test metered endpoints
5. View logs, quota usage, and subscriptions
6. Login as admin to explore platform analytics and management tools

Suggested flow:

**Consumer → Purchase API → Test API Key → View Logs & Quota**
**Admin → Review APIs → Purchases → Analytics**

---

## Running URLs

```text
Frontend: http://localhost:3001
Backend:  http://localhost:3000
Health:   http://localhost:3000/api/health
```

---

## Deploy to Netlify with PostgreSQL

The frontend and Express backend deploy together as one Netlify site. The Next.js frontend is served normally, while the backend runs as a Netlify Function behind `/api/*` and `/v1/*`. PostgreSQL is hosted externally (the free [Neon](https://neon.tech) tier works well).

1. Create a Neon PostgreSQL project and copy its pooled `postgresql://...` connection string.
2. Import this GitHub repository into Netlify.
3. In Netlify build settings, leave **Base directory** empty and set **Package directory** to `frontend`.
4. Add these Netlify environment variables:

```env
DATABASE_URL=your-neon-pooled-postgresql-connection-string
JWT_SECRET=a-long-unique-random-production-secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=a-strong-admin-password
CONSUMER_EMAIL=consumer@your-domain.com
CONSUMER_PASSWORD=a-strong-demo-password
```

5. Deploy the `main` branch.

Production deploys generate the Linux Prisma Client, apply Prisma migrations, and seed the database. The `ADMIN_EMAIL` account is created or promoted to the `ADMIN` role on every production deploy. Never commit real passwords, database URLs, JWT secrets, or API keys.

After deployment, verify the API:

```powershell
curl.exe "https://YOUR-SITE.netlify.app/api/health"
```

Call the seeded Weather API only with a valid API key from a purchased subscription:

```powershell
curl.exe -X POST "https://YOUR-SITE.netlify.app/v1/weather" `
  -H "x-api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d "{}"
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete walkthrough and [USAGE.md](USAGE.md) for admin and API-key usage.

---

## Environment Variables

### `backend/.env`

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@marketplace.local
ADMIN_PASSWORD=admin123

CONSUMER_EMAIL=consumer@marketplace.local
CONSUMER_PASSWORD=consumer123
```

### Optional `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Seeded Accounts

### Admin

```text
Email: admin@marketplace.local
Password: admin123
```

### Consumer

```text
Email: consumer@marketplace.local
Password: consumer123
```

---

## API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Marketplace & Consumer

```text
GET  /api/apis
GET  /api/apis/:id
POST /api/apis/:id/purchase
GET  /api/users/dashboard
GET  /api/users/logs
POST /api/users/subscriptions/:subscriptionId/api-key/regenerate
```

### Admin

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

---

## Example API Creation Payload

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
  "dummyResponse": {
    "message": "Sunny"
  },
  "status": "APPROVED"
}
```

---

## Metered API Calls

Public endpoint:

```text
GET|POST /v1/:apiSlug
Header: x-api-key: YOUR_API_KEY

OR
curl.exe -X POST "http://localhost:3000/v1/weather" -H "x-api-key: YOUR_API_KEY"
```

### POST Example

```powershell
curl -X POST "http://localhost:3000/v1/weather" `
  -H "x-api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d "{ `"sample`": true }"
```

### GET Example

```powershell
curl -X GET "http://localhost:3000/v1/weather" `
  -H "x-api-key: YOUR_API_KEY"
OR
curl.exe -X GET "http://localhost:3000/v1/weather" -H "x-api-key: YOUR_API_KEY"
```

### Metering Flow

```text
Validate API key
→ Verify subscription
→ Validate request method
→ Check quota
→ Apply rate limiting
→ Deduct quota
→ Log request
→ Return dummy response
```

### Common Errors

```text
401 MISSING_API_KEY / INVALID_API_KEY
403 NO_SUBSCRIPTION
405 METHOD_NOT_ALLOWED
429 QUOTA_EXHAUSTED / RATE_LIMITED
```

---

## Notes

* Payments are mocked via **Buy** and **Refill** actions.
* API keys support **hashed lookup with backward-compatible validation**.
* Rate limiting is **in-memory** and resets when the backend restarts.
* If Prisma Client generation fails on Windows, stop the backend and rerun:

