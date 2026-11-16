# NXLink Test API

Tiny endpoint to test NXLink "Invoke API" nodes. Accepts GET/POST, echoes the JSON back, and shows received requests on the home page.

- `POST /v1/escalation` (also `/api/escalation`) – returns `{success, message, body, ...}`
- `GET /api/logs` – last 50 requests (in-memory, best effort)
- `/` – live viewer

## Optional authentication
Set env var `AUTH_TOKEN` in Vercel. Then requests must send `Authorization: Bearer <token>`, Basic auth (password = token), or `x-api-key: <token>`. If unset, no auth is required.

## Deploy (free)
1. Push this folder to a GitHub repo.
2. vercel.com → Add New Project → import the repo → Deploy (no build settings needed).
3. In NXLink use URL `https://<project>.vercel.app/v1/escalation`, Request Method `POST`, Content Type JSON.

## Test
```bash
curl -X POST https://<project>.vercel.app/v1/escalation \
  -H "Content-Type: application/json" \
  -d '{"sku":"A1","customer":"Test"}'
```

Note: logs live in function memory, so they can reset on cold starts or differ between instances. Fine for testing.
