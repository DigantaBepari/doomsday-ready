export interface Cinema {
  id: number;
  name: string;
  bundleSizes: number[];
}

export interface CreateCinemaInput {
  name: string;
  bundleSizes: number[];
}

export interface PossibleBooking {
  cinemaId: number;
  groupSize: number;
  possible: true;
  totalBundles: number;
  breakdown: Array<{ size: number; count: number }>;
}

export interface ImpossibleBooking {
  cinemaId: number;
  groupSize: number;
  possible: false;
  message: "No exact combination possible";
}

export type BookingResult = PossibleBooking | ImpossibleBooking;
