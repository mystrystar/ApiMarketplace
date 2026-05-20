# API Marketplace With Usage Metering

A RapidAPI-inspired marketplace where users purchase API quota, authenticate using API keys, and every API call is securely metered, logged, rate-limited, and deducted from quota.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript

### Backend

* Node.js
* Express

### Database & Auth

* SQLite
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

## Environment Variables

### `backend/.env`

```env
PORT=3000
DATABASE_URL="file:./dev.db"
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

