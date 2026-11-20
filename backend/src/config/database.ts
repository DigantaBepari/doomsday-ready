import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { env } from "./env.js";

const databasePath = isAbsolute(env.databasePath)
  ? env.databasePath
  : resolve(process.cwd(), env.databasePath);

if (databasePath !== ":memory:") {
  mkdirSync(dirname(databasePath), { recursive: true });
}

export const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    release_year INTEGER,
    runtime_minutes INTEGER NOT NULL CHECK (runtime_minutes BETWEEN 1 AND 300),
    watched INTEGER NOT NULL DEFAULT 0 CHECK (watched IN (0, 1))
  );

  CREATE TABLE IF NOT EXISTS movie_prerequisites (
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    prerequisite_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, prerequisite_id)
  );

  CREATE TABLE IF NOT EXISTS cinemas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS cinema_bundle_sizes (
    cinema_id INTEGER NOT NULL REFERENCES cinemas(id) ON DELETE CASCADE,
    size INTEGER NOT NULL CHECK (size > 0),
    PRIMARY KEY (cinema_id, size)
  );
`);
