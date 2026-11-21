import { useCallback, useEffect, useState } from "react";
import { moviesApi } from "../api/movies.api";
import type { RewatchOrder } from "../types";

export const useRewatchOrder = (targetId: number | null) => {
  const [rewatchOrder, setRewatchOrder] = useState<RewatchOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let current = true;
    if (targetId === null) {
      setRewatchOrder(null);
      setLoading(false);
      setError(null);
      return () => { current = false; };
    }

    setLoading(true);
    setError(null);
    void moviesApi.rewatchOrder(targetId)
      .then((result) => { if (current) setRewatchOrder(result); })
      .catch((cause: unknown) => {
        if (current) setError(cause instanceof Error ? cause : new Error("Could not load this rewatch plan."));
      })
      .finally(() => { if (current) setLoading(false); });

    return () => { current = false; };
  }, [targetId, revision]);

  const toggleWatched = useCallback(async (movieId: number, watched: boolean) => {
    setError(null);
    try {
      await moviesApi.update(movieId, { watched });
      setRevision((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error("Could not update watched status."));
      throw cause;
    }
  }, []);

  return { rewatchOrder, loading, error, toggleWatched };
};
