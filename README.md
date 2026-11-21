
# Doomsday Ready

Full-stack Marvel Cinematic Universe rewatch planner and cinema watch-party app. The API includes movie prerequisites, rewatch ordering, cinema bundle booking, and health checks.

## Requirements

- Node.js 22 or newer (Node 24 is supported by the pinned `better-sqlite3` 13.2.0 dependency)
- npm

## Setup and run

Run the Node and npm commands from `backend/`:

```sh
cd backend
npm install
cp .env.example .env
npm run dev
```

In PowerShell, replace `cp` with `Copy-Item .env.example .env`.

The API listens on `http://localhost:3000` by default. SQLite creates the configured database file and schema on startup. Set `DATABASE_PATH=:memory:` to use an in-memory database. `CLIENT_ORIGIN` controls the single allowed CORS origin.

In a second terminal, start the frontend:

```sh
cd frontend
npm install
npm run dev
```

Vite serves the app locally and proxies `/api` requests to the backend at `http://localhost:3000`.

## Scripts

- `npm run dev` — run the API with TypeScript watch mode
- `npm run build` — compile TypeScript into `dist/`
- `npm start` — run the compiled API
- `npm test` — run Vitest tests
- `npm run seed` — insert sample MCU movies and cinemas, skipping existing titles and names

## API

- `GET /api/health` — returns `{ "status": "ok" }`
- `GET /api/movies` — list movies
- `POST /api/movies` — create a movie
- `PATCH /api/movies/:id` — update supplied movie fields
- `GET /api/movies/:id/rewatch-order` — get prerequisite movies in viewing order
- `GET /api/cinemas` — list cinemas and bundle sizes
- `POST /api/cinemas` — create a cinema with bundle sizes
- `GET /api/cinemas/:id/booking?groupSize=N` — find the fewest bundles for a group

Movie fields use camelCase in JSON: `title`, `releaseYear`, `runtimeMinutes`, `watched`, and `prerequisiteIds`. Create requires `title` and `runtimeMinutes`; runtime must be 1–300 minutes. The response includes `prerequisiteIds` as an array. Errors use `{ "error": { "code": "...", "message": "..." } }`.

## Database

SQLite schema initialization is in `backend/src/config/database.ts`. Foreign key enforcement is enabled, with cascading deletes for prerequisite and cinema bundle relationships. Run the backend from its directory so the default database is created at `backend/data/doomsday-ready.db`.
