import { useCallback, useEffect, useState } from "react";
import { cinemasApi } from "../api/cinemas.api";
import type { Cinema, CreateCinemaInput } from "../types";

export const useCinemas = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadCinemas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCinemas(await cinemasApi.list());
    } catch (cause) {
      const nextError = cause instanceof Error ? cause : new Error("Could not load cinemas.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCinemas().catch(() => undefined);
  }, [loadCinemas]);

  const createCinema = async (input: CreateCinemaInput) => {
    setSaving(true);
    setError(null);
    try {
      const created = await cinemasApi.create(input);
      setCinemas((current) => [...current, created]);
      return created;
    } catch (cause) {
      const nextError = cause instanceof Error ? cause : new Error("Could not add this cinema.");
      setError(nextError);
      throw nextError;
    } finally {
      setSaving(false);
    }
  };

  return { cinemas, loading, saving, error, clearError: () => setError(null), loadCinemas, createCinema };
};
