import type { RequestHandler } from "express";
import type { MoviesService } from "../services/movies.service.js";

export const createMoviesController = (movies: MoviesService) => ({
  create: ((req, res, next) => {
    try {
      res.status(201).json(movies.create(req.body));
    } catch (error) { next(error); }
  }) satisfies RequestHandler,
  list: ((_req, res, next) => {
    try {
      res.json(movies.list());
    } catch (error) { next(error); }
  }) satisfies RequestHandler,
  update: ((req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id < 1) {
        res.status(400).json({ error: { code: "INVALID_ID", message: "Movie id must be a positive integer" } });
        return;
      }
      res.json(movies.update(id, req.body));
    } catch (error) { next(error); }
  }) satisfies RequestHandler,
});
