import { useEffect, useState, type FormEvent } from "react";
import { BookingForm } from "../components/booking/BookingForm";
import { BookingResult } from "../components/booking/BookingResult";
import { CinemaForm } from "../components/booking/CinemaForm";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useBooking } from "../hooks/useBooking";
import { useCinemas } from "../hooks/useCinemas";
import styles from "./BookingPage.module.css";

export const BookingPage = () => {
  const { cinemas, loading: cinemasLoading, saving, error: cinemasError, createCinema } = useCinemas();
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [groupSize, setGroupSize] = useState("6");
  const [search, setSearch] = useState<{ cinemaId: number; groupSize: number } | null>(null);
  const parsedGroupSize = /^\d+$/.test(groupSize) && Number(groupSize) >= 1 && Number(groupSize) <= 10_000
    ? Number(groupSize)
    : null;
  const { booking, loading: bookingLoading, error: bookingError } = useBooking(search?.cinemaId ?? null, search?.groupSize ?? null);

  useEffect(() => {
    if (selectedCinemaId === null && cinemas.length > 0) setSelectedCinemaId(cinemas[0]!.id);
  }, [cinemas, selectedCinemaId]);

  const handleCreateCinema = async (input: Parameters<typeof createCinema>[0]) => {
    const cinema = await createCinema(input);
    setSelectedCinemaId(cinema.id);
    setSearch(null);
    return cinema;
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCinemaId !== null && parsedGroupSize !== null) {
      setSearch({ cinemaId: selectedCinemaId, groupSize: parsedGroupSize });
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.intro}><div><span className={styles.eyebrow}>CINEMA WATCH PARTY</span><h1>Bring the <em>whole crew.</em></h1><p>Match your group to the exact seat bundles. No one left in the lobby.</p></div><span className={styles.ticket}>ADMIT<br /><b>ALL</b></span></header>
      {cinemasError && <ErrorMessage error={cinemasError} title="Cinema update didn't stick" />}
      {bookingError && <ErrorMessage error={bookingError} title="Couldn't calculate the booking" />}
      {cinemasLoading ? <LoadingSpinner label="Loading cinemas…" /> : (
        <>
          {cinemas.length === 0 && <div className={styles.emptyNote}>No cinemas yet. Add one below to plan your first watch party.</div>}
          <div className={styles.bookingGrid}>
            <BookingForm
              cinemas={cinemas}
              selectedCinemaId={selectedCinemaId}
              groupSize={groupSize}
              disabled={cinemasLoading}
              onCinemaChange={(id) => { setSelectedCinemaId(id); setSearch(null); }}
              onGroupSizeChange={(value) => { setGroupSize(value); setSearch(null); }}
              onSubmit={handleSearch}
            />
            <BookingResult booking={booking} loading={bookingLoading} hasRequest={search !== null} />
          </div>
          <div className={styles.addCinema}><div className={styles.sectionTitle}><span className={styles.eyebrow}>YOUR LOCAL CIRCUIT</span><h2>Know a better screen?</h2></div><CinemaForm saving={saving} onSubmit={handleCreateCinema} /></div>
        </>
      )}
    </div>
  );
};
