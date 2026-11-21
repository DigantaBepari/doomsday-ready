import { createDatabase } from "../config/database.js";
import { CinemasRepository } from "../repositories/cinemas.repository.js";
import { MoviesRepository } from "../repositories/movies.repository.js";
import { MoviesService } from "../services/movies.service.js";

const sampleMovies = [
  { title: "Iron Man", releaseYear: 2008, runtimeMinutes: 126, prerequisites: [] },
  { title: "Captain America: The First Avenger", releaseYear: 2011, runtimeMinutes: 124, prerequisites: [] },
  {
    title: "The Avengers",
    releaseYear: 2012,
    runtimeMinutes: 143,
    prerequisites: ["Iron Man", "Captain America: The First Avenger"],
  },
  { title: "Captain America: Civil War", releaseYear: 2016, runtimeMinutes: 147, prerequisites: ["The Avengers"] },
  { title: "Thor: Ragnarok", releaseYear: 2017, runtimeMinutes: 130, prerequisites: [] },
  {
    title: "Avengers: Infinity War",
    releaseYear: 2018,
    runtimeMinutes: 149,
    prerequisites: ["Captain America: Civil War", "Thor: Ragnarok"],
  },
  { title: "Avengers: Endgame", releaseYear: 2019, runtimeMinutes: 181, prerequisites: ["Avengers: Infinity War"] },
  { title: "Avengers: Doomsday", releaseYear: 2026, runtimeMinutes: 150, prerequisites: ["Avengers: Endgame"] },
] as const;

const database = createDatabase();
const cinemasRepository = new CinemasRepository(database);
const repository = new MoviesRepository(database);
const service = new MoviesService(repository);

try {
  for (const movie of sampleMovies) {
    if (repository.findByTitle(movie.title)) {
      console.log(`Skipped existing movie: ${movie.title}`);
      continue;
    }

    const prerequisiteIds = movie.prerequisites.map((title) => {
      const prerequisite = repository.findByTitle(title);
      if (!prerequisite) throw new Error(`Missing seed prerequisite "${title}" for "${movie.title}"`);
      return prerequisite.id;
    });

    service.create({
      title: movie.title,
      releaseYear: movie.releaseYear,
      runtimeMinutes: movie.runtimeMinutes,
      prerequisiteIds,
    });
    console.log(`Seeded movie: ${movie.title}`);
  }

  const sampleCinemas = [
    { name: "Downtown Cinema", bundleSizes: [1, 3, 4] },
    { name: "Galaxy Multiplex", bundleSizes: [2, 5] },
    { name: "Stark Screens", bundleSizes: [6, 9, 20] },
  ];
  for (const cinema of sampleCinemas) {
    if (cinemasRepository.findByName(cinema.name)) {
      console.log(`Skipped existing cinema: ${cinema.name}`);
      continue;
    }
    cinemasRepository.create(cinema);
    console.log(`Seeded cinema: ${cinema.name}`);
  }
} finally {
  database.close();
}
