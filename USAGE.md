# Production usage

## Seeded accounts

Each production Netlify deploy ensures these accounts exist, using the values you set in Netlify environment variables:

| Account | Netlify variables | Role |
| --- | --- | --- |
| Administrator | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | `ADMIN` |
| Demo consumer | `CONSUMER_EMAIL`, `CONSUMER_PASSWORD` | `USER` |

Sign in at `/login` with the administrator credentials to access the admin pages. Never put these passwords in Git or share them publicly.

## Calling a purchased API

1. Sign in as a consumer.
2. Purchase the API in the Marketplace.
3. Copy the subscription API key from the dashboard.
4. Use that key in the `x-api-key` request header.

The seeded Weather API uses `POST`:

```powershell
curl.exe -X POST "https://apimarketplaceforapi.netlify.app/v1/weather" `
  -H "x-api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d "{}"
```

Replace `YOUR_API_KEY` with the key shown in the consumer dashboard. Do not paste real API keys into public documentation, chat messages, or source control.

## Quick checks

```powershell
# Backend health check
curl.exe "https://apimarketplaceforapi.netlify.app/api/health"

# Public metered API endpoint, with a valid subscription key
curl.exe -X POST "https://apimarketplaceforapi.netlify.app/v1/weather" `
  -H "x-api-key: YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d "{}"
```

Opening `/v1/weather` directly in a browser returns `MISSING_API_KEY`, because browsers do not include the required API-key header.
