import { findMinBundles } from "../algorithms/bundles.js";
import type { CinemasRepository } from "../repositories/cinemas.repository.js";
import type { BookingResult, Cinema, CreateCinemaInput } from "../types/cinema.js";
import { AppError } from "../utils/AppError.js";

export class CinemasService {
  constructor(private readonly cinemas: CinemasRepository) {}

  list(): Cinema[] {
    return this.cinemas.findAll();
  }

  create(input: CreateCinemaInput): Cinema {
    if (this.cinemas.findByName(input.name.trim())) {
      throw new AppError(409, "DUPLICATE_NAME", "A cinema with this name already exists");
    }

    try {
      return this.cinemas.create(input);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error &&
        (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new AppError(409, "DUPLICATE_NAME", "A cinema with this name already exists");
      }
      throw error;
    }
  }

  getBooking(id: number, groupSize: number): BookingResult {
    const cinema = this.cinemas.findById(id);
    if (!cinema) throw new AppError(404, "CINEMA_NOT_FOUND", `Cinema ${id} was not found`);

    const solution = findMinBundles(cinema.bundleSizes, groupSize);
    if (!solution) {
      return { cinemaId: id, groupSize, possible: false, message: "No exact combination possible" };
    }

    return { cinemaId: id, groupSize, possible: true, ...solution };
  }
}
