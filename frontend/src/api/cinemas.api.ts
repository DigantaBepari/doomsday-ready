import { request } from "./client";
import type { BookingResult, Cinema, CreateCinemaInput } from "../types";

export const cinemasApi = {
  list: () => request<Cinema[]>("/api/cinemas"),
  create: (input: CreateCinemaInput) => request<Cinema>("/api/cinemas", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  booking: (cinemaId: number, groupSize: number) => request<BookingResult>(
    `/api/cinemas/${cinemaId}/booking?groupSize=${groupSize}`,
  ),
};
