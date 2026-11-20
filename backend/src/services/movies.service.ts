import type { MoviesRepository } from "../repositories/movies.repository.js";
import type { CreateMovieInput, Movie, UpdateMovieInput } from "../types/movie.js";
import { AppError } from "../utils/AppError.js";

export class MoviesService {
  constructor(private readonly movies: MoviesRepository) {}

  list(): Movie[] {
    return this.movies.findAll();
  }

  create(input: CreateMovieInput): Movie {
    this.ensureUniqueTitle(input.title);
    this.ensurePrerequisitesExist(input.prerequisiteIds ?? []);
    // TODO(cycle-check): Add prerequisite cycle validation here before persistence.
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
      if (input.prerequisiteIds.includes(id)) {
        throw new AppError(400, "SELF_PREREQUISITE", "A movie cannot be its own prerequisite");
      }
      this.ensurePrerequisitesExist(input.prerequisiteIds);
      // TODO(cycle-check): Validate proposed prerequisite changes for cycles here.
    }
    try {
      return this.movies.update(id, input);
    } catch (error) {
      this.rethrowDuplicateTitle(error);
      throw error;
    }
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

  private rethrowDuplicateTitle(error: unknown): void {
    if (typeof error === "object" && error !== null && "code" in error &&
      (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new AppError(409, "DUPLICATE_TITLE", "A movie with this title already exists");
    }
  }
}
