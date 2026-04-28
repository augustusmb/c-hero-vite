# C-Hero Training Application

Full-stack maritime crew training platform — React frontend, Express API, PostgreSQL database.

For product, domain, and business context (who the users are, how the training flow works, what the product codes mean), read [CONTEXT.md](./CONTEXT.md).

## Tech Stack
- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, React Query, React Hook Form + Zod, AG Grid, Radix UI (shadcn-style)
- **Backend:** Express (Node.js, ES modules), pg-promise
- **Auth:** Auth0 (JWT verification on API routes)
- **Services:** Twilio (SMS), SendGrid (email)

## Commands
- `npm run start` — run frontend + backend concurrently (dev mode)
- `npm run dev` — Vite dev server only (frontend on :5173)
- `npm run server` — Express server only (on :8080, `node --watch`)
- `npm run build` — `tsc && vite build`
- `npm run lint` — ESLint (zero warnings allowed)

## Project Structure
- `src/` — React frontend
  - `src/@/components/ui/` — shadcn/Radix UI primitives
  - `src/api/` — Axios API client and request functions
  - `src/components/` — feature components
  - `src/hooks/` — custom React hooks
  - `src/types/` — TypeScript type definitions
  - `src/utils/` — utility functions and React Query keys
- `server/` — Express backend (plain JS, ES modules)
  - `server/routes/` — route handlers
  - `server/utils/` — server utilities
  - `server/server.js` — app setup, JWT middleware, CORS
  - `server/routes.js` — route mounting
- `db/` — PostgreSQL
  - `db/db.js` — pg-promise connection
  - `db/queries/` — SQL query files organized by domain
  - `db/migrations/` — schema migrations (canonical source of schema changes)

## Conventions
- Frontend is TypeScript; backend (`server/`) is plain JavaScript with ES modules
- Use React Query (`@tanstack/react-query`) for data fetching — query keys in `src/utils/QueryKeys.ts`
- Use React Hook Form + Zod for form validation
- UI components follow shadcn/ui pattern in `src/@/components/ui/`
- API routes: public at `/api/public/`, protected at `/api/routes/` (JWT required)
- SQL queries live in `.sql` files under `db/queries/`, not inline
- Tailwind for styling; custom color palette from `src/assets/palette-19.json`
- Path alias: `@/*` maps to `src/@/*`
- Vite proxies `/api/` to `localhost:8080` in dev

## Environment
- Requires `.env` with: database URL, Auth0 credentials, Twilio credentials, SendGrid API key
- Deployed to Render.com
