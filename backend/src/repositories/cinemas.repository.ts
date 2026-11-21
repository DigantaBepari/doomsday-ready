import type { Database } from "better-sqlite3";
import type { Cinema, CreateCinemaInput } from "../types/cinema.js";

interface CinemaRow {
  id: number;
  name: string;
}

export class CinemasRepository {
  constructor(private readonly database: Database) {}

  findAll(): Cinema[] {
    const rows = this.database.prepare("SELECT id, name FROM cinemas ORDER BY id").all() as CinemaRow[];
    return rows.map((row) => this.toCinema(row));
  }

  findById(id: number): Cinema | undefined {
    const row = this.database.prepare("SELECT id, name FROM cinemas WHERE id = ?").get(id) as CinemaRow | undefined;
    return row ? this.toCinema(row) : undefined;
  }

  findByName(name: string): Cinema | undefined {
    const row = this.database.prepare(
      "SELECT id, name FROM cinemas WHERE name = ? COLLATE NOCASE",
    ).get(name) as CinemaRow | undefined;
    return row ? this.toCinema(row) : undefined;
  }

  create(input: CreateCinemaInput): Cinema {
    const transaction = this.database.transaction(() => {
      const result = this.database.prepare("INSERT INTO cinemas (name) VALUES (?)").run(input.name);
      const cinemaId = Number(result.lastInsertRowid);
      const insertSize = this.database.prepare(
        "INSERT INTO cinema_bundle_sizes (cinema_id, size) VALUES (?, ?)",
      );
      for (const size of input.bundleSizes) insertSize.run(cinemaId, size);
      return this.findById(cinemaId)!;
    });
    return transaction();
  }

  private toCinema(row: CinemaRow): Cinema {
    const bundleSizes = this.database.prepare(
      "SELECT size FROM cinema_bundle_sizes WHERE cinema_id = ? ORDER BY size",
    ).all(row.id) as Array<{ size: number }>;
    return { id: row.id, name: row.name, bundleSizes: bundleSizes.map(({ size }) => size) };
  }
}
