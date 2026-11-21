import { useCallback, useEffect, useState } from "react";
import { moviesApi } from "../api/movies.api";
import type { CreateMovieInput, Movie } from "../types";

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMovies(await moviesApi.list());
    } catch (cause) {
      const nextError = cause instanceof Error ? cause : new Error("Could not load movies.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMovies().catch(() => undefined);
  }, [loadMovies]);

  const createMovie = async (input: CreateMovieInput) => {
    setSaving(true);
    setError(null);
    try {
      const created = await moviesApi.create(input);
      setMovies((current) => [...current, created]);
      return created;
    } catch (cause) {
      const nextError = cause instanceof Error ? cause : new Error("Could not add this movie.");
      setError(nextError);
      throw nextError;
    } finally {
      setSaving(false);
    }
  };

  const updateMovie = async (id: number, changes: Partial<CreateMovieInput> & { watched?: boolean }) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await moviesApi.update(id, changes);
      setMovies((current) => current.map((movie) => movie.id === id ? updated : movie));
      return updated;
    } catch (cause) {
      const nextError = cause instanceof Error ? cause : new Error("Could not update this movie.");
      setError(nextError);
      throw nextError;
    } finally {
      setSaving(false);
    }
  };

  return { movies, loading, saving, error, clearError: () => setError(null), loadMovies, createMovie, updateMovie };
};
