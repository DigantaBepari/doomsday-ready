import type { Movie } from "../../types";
import { PrerequisiteSelector } from "./PrerequisiteSelector";
import styles from "./MovieItem.module.css";

interface MovieItemProps {
  movie: Movie;
  movies: Movie[];
  disabled?: boolean;
  onUpdate: (id: number, changes: { watched?: boolean; prerequisiteIds?: number[] }) => Promise<unknown>;
}

export const MovieItem = ({ movie, movies, disabled, onUpdate }: MovieItemProps) => (
  <article className={`${styles.item} ${movie.watched ? styles.watched : ""}`}>
    <label className={styles.check} title={movie.watched ? "Mark as unwatched" : "Mark as watched"}>
      <input type="checkbox" aria-label={`Mark ${movie.title} as ${movie.watched ? "unwatched" : "watched"}`} checked={movie.watched} disabled={disabled} onChange={(event) => { void onUpdate(movie.id, { watched: event.target.checked }).catch(() => undefined); }} />
      <span className={styles.box} aria-hidden="true">✓</span>
    </label>
    <div className={styles.info}>
      <h3>{movie.title}</h3>
      <div className={styles.meta}>
        {movie.releaseYear && <span>{movie.releaseYear}</span>}
        <span>{movie.runtimeMinutes} min</span>
        <span className={styles.state}>{movie.watched ? "WATCHED" : "IN THE QUEUE"}</span>
      </div>
      <div className={styles.selector}>
        <PrerequisiteSelector
          id={`movie-${movie.id}-prerequisites`}
          movies={movies}
          value={movie.prerequisiteIds}
          excludeId={movie.id}
          disabled={disabled}
          onChange={(prerequisiteIds) => { void onUpdate(movie.id, { prerequisiteIds }).catch(() => undefined); }}
        />
      </div>
    </div>
    <span className={styles.number}>{String(movie.id).padStart(2, "0")}</span>
  </article>
);
