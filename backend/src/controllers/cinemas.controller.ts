import type { RequestHandler } from "express";
import type { CinemasService } from "../services/cinemas.service.js";

export const createCinemasController = (cinemas: CinemasService) => ({
  create: ((req, res, next) => {
    try {
      res.status(201).json(cinemas.create(req.body));
    } catch (error) { next(error); }
  }) satisfies RequestHandler,
  list: ((_req, res, next) => {
    try {
      res.json(cinemas.list());
    } catch (error) { next(error); }
  }) satisfies RequestHandler,
  getBooking: ((req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id < 1) {
        res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Cinema id must be a positive integer" } });
        return;
      }
      const { groupSize } = res.locals.validatedQuery as { groupSize: number };
      res.json(cinemas.getBooking(id, groupSize));
    } catch (error) { next(error); }
  }) satisfies RequestHandler,
});
