import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { db } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createApiRouter } from "./routes/index.js";
import { MoviesRepository } from "./repositories/movies.repository.js";
import { MoviesService } from "./services/movies.service.js";

const movies = new MoviesService(new MoviesRepository(db));
const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use("/api", createApiRouter(movies));
app.use(errorHandler);

export default app;
