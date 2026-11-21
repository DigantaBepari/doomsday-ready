import { Router } from "express";
import { z } from "zod";
import { createCinemasController } from "../controllers/cinemas.controller.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import type { CinemasService } from "../services/cinemas.service.js";

const createCinemaSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  bundleSizes: z.array(z.number().int().min(1).max(500))
    .min(1, "At least one bundle size is required")
    .max(10, "No more than 10 bundle sizes are allowed")
    .refine((sizes) => new Set(sizes).size === sizes.length, "Bundle sizes must be distinct"),
}).strict();

const bookingQuerySchema = z.object({
  groupSize: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(10_000)),
}).strict();

export const createCinemasRouter = (service: CinemasService): Router => {
  const router = Router();
  const controller = createCinemasController(service);
  router.post("/", validateBody(createCinemaSchema), controller.create);
  router.get("/", controller.list);
  router.get("/:id/booking", validateQuery(bookingQuerySchema), controller.getBooking);
  return router;
};
