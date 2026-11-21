import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import type { Express } from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { initializeDatabase } from "../src/config/database.js";

const sampleMovies = [
  { title: "Iron Man", releaseYear: 2008, runtimeMinutes: 126, prerequisiteTitles: [] },
  { title: "Captain America: The First Avenger", releaseYear: 2011, runtimeMinutes: 124, prerequisiteTitles: [] },
  {
    title: "The Avengers",
    releaseYear: 2012,
    runtimeMinutes: 143,
    prerequisiteTitles: ["Iron Man", "Captain America: The First Avenger"],
  },
  { title: "Captain America: Civil War", releaseYear: 2016, runtimeMinutes: 147, prerequisiteTitles: ["The Avengers"] },
  { title: "Thor: Ragnarok", releaseYear: 2017, runtimeMinutes: 130, prerequisiteTitles: [] },
  {
    title: "Avengers: Infinity War",
    releaseYear: 2018,
    runtimeMinutes: 149,
    prerequisiteTitles: ["Captain America: Civil War", "Thor: Ragnarok"],
  },
  { title: "Avengers: Endgame", releaseYear: 2019, runtimeMinutes: 181, prerequisiteTitles: ["Avengers: Infinity War"] },
  { title: "Avengers: Doomsday", releaseYear: 2026, runtimeMinutes: 150, prerequisiteTitles: ["Avengers: Endgame"] },
] as const;

describe("movie API", () => {
  let database: DatabaseType;
  let app: Express;

  beforeEach(() => {
    database = new Database(":memory:");
    initializeDatabase(database);
    app = createApp(database);
  });

  afterEach(() => database.close());

  const createMovie = async (
    title: string,
    runtimeMinutes = 120,
    prerequisiteIds: number[] = [],
  ): Promise<{ id: number; title: string }> => {
    const response = await request(app)
      .post("/api/movies")
      .send({ title, runtimeMinutes, prerequisiteIds });
    expect(response.status).toBe(201);
    return response.body as { id: number; title: string };
  };

  const seedSampleMovies = async (): Promise<Map<string, number>> => {
    const ids = new Map<string, number>();
    for (const movie of sampleMovies) {
      const prerequisiteIds = movie.prerequisiteTitles.map((title) => {
        const id = ids.get(title);
        if (!id) throw new Error(`Test fixture prerequisite missing: ${title}`);
        return id;
      });
      const response = await request(app).post("/api/movies").send({
        title: movie.title,
        releaseYear: movie.releaseYear,
        runtimeMinutes: movie.runtimeMinutes,
        prerequisiteIds,
      });
      expect(response.status).toBe(201);
      ids.set(movie.title, (response.body as { id: number }).id);
    }
    return ids;
  };

  it("returns all seven Doomsday prerequisites in valid order", async () => {
    const ids = await seedSampleMovies();
    const response = await request(app).get(`/api/movies/${ids.get("Avengers: Doomsday")}/rewatch-order`);
    const result = response.body as { order: Array<{ id: number; title: string }> };
    const positionById = new Map(result.order.map((movie, index) => [movie.id, index]));

    expect(response.status).toBe(200);
    expect(result.order).toHaveLength(7);
    expect(new Set(result.order.map((movie) => movie.id)).size).toBe(7);
    expect(result.order.map((movie) => movie.title)).not.toContain("Avengers: Doomsday");
    for (const movie of sampleMovies) {
      const movieId = ids.get(movie.title)!;
      for (const prerequisiteTitle of movie.prerequisiteTitles) {
        const prerequisiteId = ids.get(prerequisiteTitle)!;
        if (positionById.has(movieId)) {
          expect(positionById.get(prerequisiteId)).toBeLessThan(positionById.get(movieId)!);
        }
      }
    }
  });

  it("orders Civil War prerequisites before The Avengers", async () => {
    const ids = await seedSampleMovies();
    const response = await request(app).get(`/api/movies/${ids.get("Captain America: Civil War")}/rewatch-order`);

    expect(response.status).toBe(200);
    expect(response.body.order.map((movie: { title: string }) => movie.title)).toEqual([
      "Iron Man",
      "Captain America: The First Avenger",
      "The Avengers",
    ]);
  });

  it("returns an empty order for Thor: Ragnarok", async () => {
    const ids = await seedSampleMovies();
    const response = await request(app).get(`/api/movies/${ids.get("Thor: Ragnarok")}/rewatch-order`);

    expect(response.status).toBe(200);
    expect(response.body.order).toEqual([]);
    expect(response.body.totalCount).toBe(0);
    expect(response.body.remainingRuntimeMinutes).toBe(0);
  });

  it("rejects an Endgame to Iron Man circular dependency without saving it", async () => {
    const ids = await seedSampleMovies();
    const ironManId = ids.get("Iron Man")!;
    const response = await request(app)
      .patch(`/api/movies/${ironManId}`)
      .send({ prerequisiteIds: [ids.get("Avengers: Endgame")] });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CIRCULAR_DEPENDENCY");
    const after = await request(app).get(`/api/movies/${ironManId}/rewatch-order`);
    expect(after.body.order).toEqual([]);
  });

  it("rejects self-dependency with CIRCULAR_DEPENDENCY", async () => {
    const movie = await createMovie("Self Reference");
    const response = await request(app)
      .patch(`/api/movies/${movie.id}`)
      .send({ prerequisiteIds: [movie.id] });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CIRCULAR_DEPENDENCY");
  });

  it("checks proposed prerequisites on movie creation before saving", async () => {
    const response = await request(app)
      .post("/api/movies")
      .send({ title: "Self Cycle", runtimeMinutes: 120, prerequisiteIds: [1] });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CIRCULAR_DEPENDENCY");
    expect((await request(app).get("/api/movies")).body).toEqual([]);
  });

  it("lists diamond dependencies exactly once", async () => {
    const root = await createMovie("Root");
    const left = await createMovie("Left", 120, [root.id]);
    const right = await createMovie("Right", 120, [root.id]);
    const target = await createMovie("Diamond", 120, [left.id, right.id]);
    const response = await request(app).get(`/api/movies/${target.id}/rewatch-order`);
    const orderedIds = response.body.order.map((movie: { id: number }) => movie.id) as number[];

    expect(response.status).toBe(200);
    expect(orderedIds).toHaveLength(3);
    expect(new Set(orderedIds).size).toBe(3);
    expect(orderedIds).toContain(root.id);
    expect(orderedIds).toContain(left.id);
    expect(orderedIds).toContain(right.id);
  });

  it("counts watched movies and sums runtime only for unwatched prerequisites", async () => {
    const ids = await seedSampleMovies();
    await request(app).patch(`/api/movies/${ids.get("Iron Man")}`).send({ watched: true });
    await request(app).patch(`/api/movies/${ids.get("Captain America: The First Avenger")}`).send({ watched: true });
    const response = await request(app).get(`/api/movies/${ids.get("Avengers: Doomsday")}/rewatch-order`);
    const movies = response.body.order as Array<{ watched: boolean; runtimeMinutes: number }>;

    expect(response.status).toBe(200);
    expect(response.body.watchedCount).toBe(2);
    expect(response.body.totalCount).toBe(7);
    expect(response.body.remainingRuntimeMinutes).toBe(
      movies.filter((movie) => !movie.watched).reduce((total, movie) => total + movie.runtimeMinutes, 0),
    );
    expect(response.body.remainingRuntimeMinutes).toBe(750);
  });

  it("returns 404 MOVIE_NOT_FOUND for an unknown target", async () => {
    const response = await request(app).get("/api/movies/999/rewatch-order");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("MOVIE_NOT_FOUND");
  });
});
