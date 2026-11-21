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
  prerequisiteIds: number[];
}

export interface Cinema {
  id: number;
  name: string;
  bundleSizes: number[];
}

export interface CreateCinemaInput {
  name: string;
  bundleSizes: number[];
}

export interface BundleBreakdown {
  size: number;
  count: number;
}

export type BookingResult =
  | {
      cinemaId: number;
      groupSize: number;
      possible: true;
      totalBundles: number;
      breakdown: BundleBreakdown[];
    }
  | {
      cinemaId: number;
      groupSize: number;
      possible: false;
      message: string;
    };

export interface RewatchOrder {
  target: { id: number; title: string };
  order: Movie[];
  watchedCount: number;
  totalCount: number;
  remainingRuntimeMinutes: number;
}
