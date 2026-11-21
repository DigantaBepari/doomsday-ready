import type { Movie } from "../../types";
import { Card } from "../common/Card";
import { MovieItem } from "./MovieItem";
import styles from "./MovieList.module.css";

interface MovieListProps {
  movies: Movie[];
  disabled?: boolean;
  onUpdate: (id: number, changes: { watched?: boolean; prerequisiteIds?: number[] }) => Promise<unknown>;
}

export const MovieList = ({ movies, disabled, onUpdate }: MovieListProps) => (
  <Card className={styles.card}>
    <div className={styles.header}><div><span className={styles.kicker}>YOUR COLLECTION</span><h2>The movie vault</h2></div><span className={styles.count}>{String(movies.length).padStart(2, "0")} TITLES</span></div>
    {movies.length === 0 ? (
      <div className={styles.empty}><span aria-hidden="true">✦</span><strong>Your timeline is waiting.</strong><p>Add your first movie to start building a rewatch plan.</p></div>
    ) : (
      <div className={styles.list}>{movies.map((movie) => <MovieItem key={movie.id} movie={movie} movies={movies} disabled={disabled} onUpdate={onUpdate} />)}</div>
    )}
  </Card>
);
