import { request } from "./client";
import type { CreateMovieInput, Movie, RewatchOrder } from "../types";

export const moviesApi = {
  list: () => request<Movie[]>("/api/movies"),
  create: (input: CreateMovieInput) => request<Movie>("/api/movies", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  update: (id: number, input: Partial<CreateMovieInput> & { watched?: boolean }) => request<Movie>(`/api/movies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  }),
  rewatchOrder: (id: number) => request<RewatchOrder>(`/api/movies/${id}/rewatch-order`),
};
