import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
    return;
  }

  if (typeof error === "object" && error !== null && "type" in error &&
    (error as { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must contain valid JSON" } });
    return;
  }

  console.error(error);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } });
};
