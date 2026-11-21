export interface Movie {
  id: number;
  title: string;
  releaseYear: number | null;
  runtimeMinutes: number;
  watched: boolean;
  prerequisiteIds: number[];
}

export interface CreateMovieInput {
  title: string;
  releaseYear?: number;
  runtimeMinutes: number;
  watched?: boolean;
  prerequisiteIds?: number[];
}

export type UpdateMovieInput = Partial<CreateMovieInput>;

export interface RewatchOrder {
  target: Pick<Movie, "id" | "title">;
  order: Movie[];
  watchedCount: number;
  totalCount: number;
  remainingRuntimeMinutes: number;
}
