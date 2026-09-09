# backend

## Tech stack
- Node.js + Express (TypeScript)
- Supabase (Postgres + JS client) for data
- ts-node-dev for local dev, tsc build, deployed via Vercel (`@vercel/node`)

## Features
- `GET /products` — list products, optional `q` search
- `GET /products/:id` — get single product
- `GET /products/:id/care-logs` — list care logs for product
- `POST /products/:id/care-logs` — add care log
- `GET /products/:id/repair-requests` — list repair requests for product
- `POST /products/:id/repair-requests` — add repair request
- `GET /products/:id/next-life-routes` — list next-life routes for product
- `POST /products/:id/next-life-routes` — add next-life route
- `GET /health` — health check
