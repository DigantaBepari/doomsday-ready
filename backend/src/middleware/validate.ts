import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/AppError.js";

export const validateBody = (schema: ZodSchema): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    next(new AppError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid request body"));
    return;
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema: ZodSchema): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    next(new AppError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid query parameters"));
    return;
  }
  res.locals.validatedQuery = result.data;
  next();
};
