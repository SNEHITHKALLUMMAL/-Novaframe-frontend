# NovaFrame Client

React 18 + Vite SPA for the NovaFrame AI video generation platform.
Redux Toolkit (client state) + TanStack Query (server state) + Axios +
React Hook Form + Zod + Tailwind CSS + Framer Motion + React Router +
Socket.IO client. Plain JavaScript — no TypeScript.

## Local development

```bash
cp .env.example .env.local   # leave VITE_API_URL/VITE_SOCKET_URL blank for local dev
npm install
npm run dev                  # :5173, proxies /api and /socket.io to the local API
```

Requires the API (`novaframes-backend-main/server`) running locally —
`VITE_API_PROXY_TARGET` in `.env.local` controls where the dev proxy points
(defaults to `http://localhost:5000`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with API/socket proxy |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over `src/` |

## Production configuration

The frontend (Vercel) and API (Render) are different origins in production.
Set at build time:

- `VITE_API_URL` — full API origin + `/api/v1`, e.g. `https://api.example.com/api/v1`
- `VITE_SOCKET_URL` — the API's origin, e.g. `https://api.example.com`

Both fall back to relative paths (same-origin) when unset, which only works
if the frontend is served from the same origin as the API (e.g. both behind
one reverse proxy). Auth relies on an httpOnly cookie sent cross-origin via
`withCredentials: true` — the API's `FRONTEND_URL` env var must exactly
match the deployed Vercel origin for CORS to allow this.

## Structure

`pages/` (routed screens) → `components/` (feature + `ui/` primitives) →
`services/` (one Axios-based module per API resource, all through the
shared `services/apiClient.js`) → `store/` (Redux Toolkit) for client state,
TanStack Query for server state. Real-time job status comes through
`lib/socket.js` / `hooks/useRealtimeConnection.js`.
