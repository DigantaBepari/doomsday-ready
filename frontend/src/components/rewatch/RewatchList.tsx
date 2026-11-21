import type { Movie } from "../../types";
import { Card } from "../common/Card";
import styles from "./RewatchList.module.css";

interface RewatchListProps {
  movies: Movie[];
  onToggleWatched: (id: number, watched: boolean) => Promise<unknown>;
}

export const RewatchList = ({ movies, onToggleWatched }: RewatchListProps) => (
  <Card className={styles.card}>
    <div className={styles.header}><div><span className={styles.kicker}>PLAY IN THIS ORDER</span><h2>Operation timeline</h2></div><span className={styles.tag}>PREREQUISITES FIRST</span></div>
    {movies.length === 0 ? (
      <div className={styles.empty}><span>◎</span><strong>No prerequisites on this path</strong><p>This movie can be watched as a standalone mission.</p></div>
    ) : (
      <ol className={styles.list}>
        {movies.map((movie, index) => (
          <li key={movie.id} className={styles.row}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <label className={styles.checkbox}>
              <input type="checkbox" aria-label={`Mark ${movie.title} as ${movie.watched ? "unwatched" : "watched"}`} checked={movie.watched} onChange={(event) => { void onToggleWatched(movie.id, event.target.checked).catch(() => undefined); }} />
              <span className={styles.checkmark} aria-hidden="true">✓</span>
            </label>
            <span className={styles.titleBlock}><strong className={movie.watched ? styles.done : ""}>{movie.title}</strong><small>{movie.releaseYear ?? "Release year unknown"} <i>·</i> {movie.runtimeMinutes} min</small></span>
            <span className={`${styles.status} ${movie.watched ? styles.statusDone : ""}`}>{movie.watched ? "COMPLETE" : "UP NEXT"}</span>
          </li>
        ))}
      </ol>
    )}
  </Card>
);
