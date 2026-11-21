import cors from "cors";
import express from "express";
import type { Database as DatabaseType } from "better-sqlite3";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createApiRouter } from "./routes/index.js";
import { CinemasRepository } from "./repositories/cinemas.repository.js";
import { MoviesRepository } from "./repositories/movies.repository.js";
import { CinemasService } from "./services/cinemas.service.js";
import { MoviesService } from "./services/movies.service.js";

export const createApp = (database: DatabaseType) => {
  const movies = new MoviesService(new MoviesRepository(database));
  const cinemas = new CinemasService(new CinemasRepository(database));
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use("/api", createApiRouter(movies, cinemas));
  app.use(errorHandler);

  return app;
};
