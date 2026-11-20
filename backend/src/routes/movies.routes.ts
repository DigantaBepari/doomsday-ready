import { Router } from "express";
import { z } from "zod";
import { createMoviesController } from "../controllers/movies.controller.js";
import { validateBody } from "../middleware/validate.js";
import type { MoviesService } from "../services/movies.service.js";

const movieFields = {
  title: z.string().trim().min(1, "Title is required").optional(),
  releaseYear: z.number().int().min(1888).max(3000).optional(),
  runtimeMinutes: z.number().int().min(1).max(300).optional(),
  watched: z.boolean().optional(),
  prerequisiteIds: z.array(z.number().int().positive()).refine((ids) => new Set(ids).size === ids.length, {
    message: "Prerequisite ids must not contain duplicates",
  }).optional(),
};

const createSchema = z.object({
  ...movieFields,
  title: z.string().trim().min(1, "Title is required"),
  runtimeMinutes: z.number().int().min(1).max(300),
}).strict();

const updateSchema = z.object(movieFields).strict().refine((body) => Object.keys(body).length > 0, {
  message: "At least one field must be provided",
});

export const createMoviesRouter = (service: MoviesService): Router => {
  const router = Router();
  const controller = createMoviesController(service);
  router.post("/", validateBody(createSchema), controller.create);
  router.get("/", controller.list);
  router.patch("/:id", validateBody(updateSchema), controller.update);
  return router;
};
