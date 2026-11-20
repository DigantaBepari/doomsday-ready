import type { Database } from "better-sqlite3";
import type { CreateMovieInput, Movie, UpdateMovieInput } from "../types/movie.js";

interface MovieRow {
  id: number;
  title: string;
  release_year: number | null;
  runtime_minutes: number;
  watched: number;
}

export class MoviesRepository {
  constructor(private readonly database: Database) {}

  findAll(): Movie[] {
    const rows = this.database.prepare("SELECT * FROM movies ORDER BY id").all() as MovieRow[];
    return rows.map((row) => this.toMovie(row));
  }

  findById(id: number): Movie | undefined {
    const row = this.database.prepare("SELECT * FROM movies WHERE id = ?").get(id) as MovieRow | undefined;
    return row ? this.toMovie(row) : undefined;
  }

  findByTitle(title: string): Movie | undefined {
    const row = this.database.prepare("SELECT * FROM movies WHERE title = ? COLLATE NOCASE").get(title) as MovieRow | undefined;
    return row ? this.toMovie(row) : undefined;
  }

  prerequisitesExist(ids: number[]): boolean {
    if (ids.length === 0) return true;
    const placeholders = ids.map(() => "?").join(",");
    const result = this.database.prepare(`SELECT COUNT(*) AS count FROM movies WHERE id IN (${placeholders})`).get(...ids) as { count: number };
    return result.count === new Set(ids).size;
  }

  create(input: CreateMovieInput): Movie {
    const transaction = this.database.transaction(() => {
      const result = this.database.prepare(
        "INSERT INTO movies (title, release_year, runtime_minutes, watched) VALUES (?, ?, ?, ?)",
      ).run(input.title, input.releaseYear ?? null, input.runtimeMinutes, input.watched ? 1 : 0);
      const id = Number(result.lastInsertRowid);
      this.replacePrerequisites(id, input.prerequisiteIds ?? []);
      return this.findById(id)!;
    });
    return transaction();
  }

  update(id: number, input: UpdateMovieInput): Movie {
    const transaction = this.database.transaction(() => {
      const current = this.findById(id)!;
      this.database.prepare(`
        UPDATE movies SET title = ?, release_year = ?, runtime_minutes = ?, watched = ? WHERE id = ?
      `).run(
        input.title ?? current.title,
        input.releaseYear ?? current.releaseYear,
        input.runtimeMinutes ?? current.runtimeMinutes,
        (input.watched ?? current.watched) ? 1 : 0,
        id,
      );
      if (input.prerequisiteIds !== undefined) this.replacePrerequisites(id, input.prerequisiteIds);
      return this.findById(id)!;
    });
    return transaction();
  }

  private replacePrerequisites(movieId: number, prerequisiteIds: number[]): void {
    this.database.prepare("DELETE FROM movie_prerequisites WHERE movie_id = ?").run(movieId);
    const insert = this.database.prepare("INSERT INTO movie_prerequisites (movie_id, prerequisite_id) VALUES (?, ?)");
    for (const prerequisiteId of prerequisiteIds) insert.run(movieId, prerequisiteId);
  }

  private toMovie(row: MovieRow): Movie {
    const prerequisites = this.database.prepare(
      "SELECT prerequisite_id FROM movie_prerequisites WHERE movie_id = ? ORDER BY prerequisite_id",
    ).all(row.id) as Array<{ prerequisite_id: number }>;
    return {
      id: row.id,
      title: row.title,
      releaseYear: row.release_year,
      runtimeMinutes: row.runtime_minutes,
      watched: row.watched === 1,
      prerequisiteIds: prerequisites.map((item) => item.prerequisite_id),
    };
  }
}
