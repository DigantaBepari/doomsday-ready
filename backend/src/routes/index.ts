import { Router } from "express";
import { createMoviesRouter } from "./movies.routes.js";
import type { MoviesService } from "../services/movies.service.js";

export const createApiRouter = (movies: MoviesService): Router => {
  const router = Router();
  router.get("/health", (_req, res) => res.json({ status: "ok" }));
  router.use("/movies", createMoviesRouter(movies));
  return router;
};
