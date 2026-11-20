# Doomsday Ready

Backend starter for a Marvel Cinematic Universe rewatch planner and cinema watch-party app. The current API includes movie management and health checks. Cinema endpoints, frontend work, rewatch ordering, and prerequisite cycle detection are intentionally deferred.

## Requirements

- Node.js 20 or newer
- npm

## Setup and run

```sh
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:3000` by default. SQLite creates the configured database file and schema on startup. Set `DATABASE_PATH=:memory:` to use an in-memory database. `CLIENT_ORIGIN` controls the single allowed CORS origin.

## Scripts

- `npm run dev` — run the API with TypeScript watch mode
- `npm run build` — compile TypeScript into `dist/`
- `npm start` — run the compiled API
- `npm test` — run Vitest tests

## API

- `GET /api/health` — returns `{ "status": "ok" }`
- `GET /api/movies` — list movies
- `POST /api/movies` — create a movie
- `PATCH /api/movies/:id` — update supplied movie fields

Movie fields use camelCase in JSON: `title`, `releaseYear`, `runtimeMinutes`, `watched`, and `prerequisiteIds`. Create requires `title` and `runtimeMinutes`; runtime must be 1–300 minutes. The response includes `prerequisiteIds` as an array. Errors use `{ "error": { "code": "...", "message": "..." } }`.

## Database

SQLite schema initialization is in `backend/src/config/database.ts`. Foreign key enforcement is enabled, with cascading deletes for prerequisite and cinema bundle relationships.
