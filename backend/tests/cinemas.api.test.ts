import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import type { Express } from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { initializeDatabase } from "../src/config/database.js";

describe("cinema API", () => {
  let database: DatabaseType;
  let app: Express;

  beforeEach(() => {
    database = new Database(":memory:");
    initializeDatabase(database);
    app = createApp(database);
  });

  afterEach(() => database.close());

  const createCinema = async (name: string, bundleSizes: number[]) => {
    const response = await request(app).post("/api/cinemas").send({ name, bundleSizes });
    expect(response.status).toBe(201);
    return response.body as { id: number; name: string; bundleSizes: number[] };
  };

  it("creates and lists cinemas with bundle sizes", async () => {
    const cinema = await createCinema("Central Cinema", [2, 5]);
    const response = await request(app).get("/api/cinemas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: cinema.id, name: "Central Cinema", bundleSizes: [2, 5] }]);
  });

  it.each([
    { sizes: [1, 3, 4], groupSize: 6, totalBundles: 2, breakdown: [{ size: 3, count: 2 }] },
    {
      sizes: [2, 5],
      groupSize: 11,
      totalBundles: 4,
      breakdown: [{ size: 5, count: 1 }, { size: 2, count: 3 }],
    },
    {
      sizes: [6, 9, 20],
      groupSize: 44,
      totalBundles: 4,
      breakdown: [{ size: 20, count: 1 }, { size: 9, count: 2 }, { size: 6, count: 1 }],
    },
  ])("returns the minimum booking for $groupSize people", async ({ sizes, groupSize, totalBundles, breakdown }) => {
    const cinema = await createCinema("Test Cinema", sizes);
    const response = await request(app).get(`/api/cinemas/${cinema.id}/booking?groupSize=${groupSize}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      cinemaId: cinema.id,
      groupSize,
      possible: true,
      totalBundles,
      breakdown,
    });
  });

  it("returns the documented response when no exact booking is possible", async () => {
    const cinema = await createCinema("Limited Cinema", [4, 6]);
    const response = await request(app).get(`/api/cinemas/${cinema.id}/booking?groupSize=7`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      cinemaId: cinema.id,
      groupSize: 7,
      possible: false,
      message: "No exact combination possible",
    });
  });

  it("accepts the 10,000 person upper bound", async () => {
    const cinema = await createCinema("Large Cinema", [500]);
    const response = await request(app).get(`/api/cinemas/${cinema.id}/booking?groupSize=10000`);

    expect(response.status).toBe(200);
    expect(response.body.possible).toBe(true);
    expect(response.body.totalBundles).toBe(20);
    expect(response.body.breakdown).toEqual([{ size: 500, count: 20 }]);
  });

  it("rejects duplicate cinema names case-insensitively", async () => {
    await createCinema("Central Cinema", [2, 4]);
    const response = await request(app).post("/api/cinemas").send({ name: "central cinema", bundleSizes: [3] });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("DUPLICATE_NAME");
  });

  it.each([
    { scenario: "duplicate sizes", body: { name: "Duplicate sizes", bundleSizes: [2, 2] } },
    { scenario: "empty sizes", body: { name: "No sizes", bundleSizes: [] } },
    { scenario: "zero size", body: { name: "Zero size", bundleSizes: [0] } },
    { scenario: "size above 500", body: { name: "Too large", bundleSizes: [501] } },
    { scenario: "fractional size", body: { name: "Fractional", bundleSizes: [2.5] } },
    { scenario: "more than ten sizes", body: { name: "Too many", bundleSizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] } },
    { scenario: "missing name", body: { bundleSizes: [2] } },
    { scenario: "blank name", body: { name: "   ", bundleSizes: [2] } },
  ])("rejects invalid cinema input: $scenario", async ({ body }) => {
    const response = await request(app).post("/api/cinemas").send(body);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it.each(["", "abc", "0", "10001", "2.5", "1.0", "1e2", "1&groupSize=2"]) (
    "rejects invalid groupSize query value %s",
    async (groupSize) => {
      const cinema = await createCinema("Query Validation Cinema", [1, 2]);
      const response = await request(app).get(`/api/cinemas/${cinema.id}/booking?groupSize=${groupSize}`);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    },
  );

  it("returns 404 CINEMA_NOT_FOUND for unknown cinema ids", async () => {
    const response = await request(app).get("/api/cinemas/999/booking?groupSize=5");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CINEMA_NOT_FOUND");
  });
});
