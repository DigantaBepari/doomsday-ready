import { getRewatchOrder, wouldCreateCycle } from "../algorithms/graph.js";
import type { MoviesRepository } from "../repositories/movies.repository.js";
import type { CreateMovieInput, Movie, RewatchOrder, UpdateMovieInput } from "../types/movie.js";
import { AppError } from "../utils/AppError.js";

export class MoviesService {
  constructor(private readonly movies: MoviesRepository) {}

  list(): Movie[] {
    return this.movies.findAll();
  }

  create(input: CreateMovieInput): Movie {
    this.ensureUniqueTitle(input.title);
    this.ensureNoCycle(this.movies.nextMovieId(), input.prerequisiteIds ?? []);
    this.ensurePrerequisitesExist(input.prerequisiteIds ?? []);
    try {
      return this.movies.create(input);
    } catch (error) {
      this.rethrowDuplicateTitle(error);
      throw error;
    }
  }

  update(id: number, input: UpdateMovieInput): Movie {
    const existing = this.movies.findById(id);
    if (!existing) throw new AppError(404, "MOVIE_NOT_FOUND", `Movie ${id} was not found`);
    if (input.title !== undefined) this.ensureUniqueTitle(input.title, id);
    if (input.prerequisiteIds !== undefined) {
      this.ensurePrerequisitesExist(input.prerequisiteIds);
      this.ensureNoCycle(id, input.prerequisiteIds);
    }
    try {
      return this.movies.update(id, input);
    } catch (error) {
      this.rethrowDuplicateTitle(error);
      throw error;
    }
  }

  getMovieRewatchOrder(id: number): RewatchOrder {
    const target = this.movies.findById(id);
    if (!target) throw new AppError(404, "MOVIE_NOT_FOUND", `Movie ${id} was not found`);

    const orderedIds = getRewatchOrder(id, this.movies.getPrerequisiteGraph());
    const moviesById = new Map(this.movies.findAll().map((movie) => [movie.id, movie]));
    const order = orderedIds.flatMap((movieId) => {
      const movie = moviesById.get(movieId);
      return movie ? [movie] : [];
    });
    const unwatchedMovies = order.filter((movie) => !movie.watched);

    return {
      target: { id: target.id, title: target.title },
      order,
      watchedCount: order.length - unwatchedMovies.length,
      totalCount: order.length,
      remainingRuntimeMinutes: unwatchedMovies.reduce((total, movie) => total + movie.runtimeMinutes, 0),
    };
  }

  private ensureUniqueTitle(title: string, exceptId?: number): void {
    const match = this.movies.findByTitle(title.trim());
    if (match && match.id !== exceptId) {
      throw new AppError(409, "DUPLICATE_TITLE", "A movie with this title already exists");
    }
  }

  private ensurePrerequisitesExist(ids: number[]): void {
    if (!this.movies.prerequisitesExist(ids)) {
      throw new AppError(400, "PREREQUISITE_NOT_FOUND", "One or more prerequisite movies do not exist");
    }
  }

  private ensureNoCycle(movieId: number, prerequisiteIds: number[]): void {
    if (wouldCreateCycle(movieId, prerequisiteIds, this.movies.getPrerequisiteGraph())) {
      throw new AppError(409, "CIRCULAR_DEPENDENCY", "These prerequisites would create a circular dependency");
    }
  }

  private rethrowDuplicateTitle(error: unknown): void {
    if (typeof error === "object" && error !== null && "code" in error &&
      (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new AppError(409, "DUPLICATE_TITLE", "A movie with this title already exists");
    }
  }
}
