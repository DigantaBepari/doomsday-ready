import { useEffect, useState } from "react";
import { cinemasApi } from "../api/cinemas.api";
import type { BookingResult } from "../types";

export const useBooking = (cinemaId: number | null, groupSize: number | null) => {
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let current = true;
    if (cinemaId === null || groupSize === null) {
      setBooking(null);
      setLoading(false);
      setError(null);
      return () => { current = false; };
    }

    setLoading(true);
    setError(null);
    void cinemasApi.booking(cinemaId, groupSize)
      .then((result) => { if (current) setBooking(result); })
      .catch((cause: unknown) => {
        if (current) setError(cause instanceof Error ? cause : new Error("Could not calculate this booking."));
      })
      .finally(() => { if (current) setLoading(false); });

    return () => { current = false; };
  }, [cinemaId, groupSize]);

  return { booking, loading, error };
};
