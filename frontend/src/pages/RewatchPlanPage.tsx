import { useEffect, useState } from "react";
import { Card } from "../components/common/Card";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { RewatchList } from "../components/rewatch/RewatchList";
import { RewatchSummary } from "../components/rewatch/RewatchSummary";
import { useMovies } from "../hooks/useMovies";
import { useRewatchOrder } from "../hooks/useRewatchOrder";
import styles from "./RewatchPlanPage.module.css";

export const RewatchPlanPage = () => {
  const { movies, loading: moviesLoading, error: moviesError } = useMovies();
  const [targetId, setTargetId] = useState<number | null>(null);
  const { rewatchOrder, loading, error, toggleWatched } = useRewatchOrder(targetId);

  useEffect(() => {
    if (targetId === null && movies.length > 0) setTargetId(movies[0]!.id);
  }, [movies, targetId]);

  return (
    <div className={styles.page}>
      <header className={styles.intro}><div><span className={styles.eyebrow}>YOUR STORY, IN ORDER</span><h1>Plan the <em>rewatch.</em></h1><p>Choose a destination. We’ll line up every prerequisite on the way there.</p></div><span className={styles.stamp}>FIELD<br />GUIDE <b>✦</b></span></header>
      {moviesError && <ErrorMessage error={moviesError} title="Couldn't load the movie list" />}
      {error && <ErrorMessage error={error} title="Couldn't load this rewatch plan" />}
      {moviesLoading ? <LoadingSpinner label="Loading your movies…" /> : movies.length === 0 ? (
        <Card className={styles.empty}><span>01 / FIRST CONTACT</span><h2>Your watch plan starts with a movie.</h2><p>Add a few films in the Movies view, then pick a target here.</p></Card>
      ) : (
        <>
          <Card className={styles.targetCard}>
            <label htmlFor="rewatch-target">Choose a target movie</label>
            <select id="rewatch-target" value={targetId ?? ""} onChange={(event) => setTargetId(Number(event.target.value))}>
              {movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}{movie.releaseYear ? ` (${movie.releaseYear})` : ""}</option>)}
            </select>
            <span className={styles.targetHint}>Your target itself stays out of the prerequisite list.</span>
          </Card>
          {loading ? <LoadingSpinner label="Mapping the timeline…" /> : rewatchOrder && (
            <div className={styles.grid}>
              <RewatchSummary plan={rewatchOrder} />
              <RewatchList movies={rewatchOrder.order} onToggleWatched={toggleWatched} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
