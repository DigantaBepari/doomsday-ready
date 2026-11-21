import { Router } from "express";
import { createCinemasRouter } from "./cinemas.routes.js";
import { createMoviesRouter } from "./movies.routes.js";
import type { CinemasService } from "../services/cinemas.service.js";
import type { MoviesService } from "../services/movies.service.js";

export const createApiRouter = (movies: MoviesService, cinemas: CinemasService): Router => {
  const router = Router();
  router.get("/health", (_req, res) => res.json({ status: "ok" }));
  router.use("/movies", createMoviesRouter(movies));
  router.use("/cinemas", createCinemasRouter(cinemas));
  return router;
};
