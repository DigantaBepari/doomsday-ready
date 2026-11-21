import { useMovies } from "../hooks/useMovies";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { MovieForm } from "../components/movies/MovieForm";
import { MovieList } from "../components/movies/MovieList";
import styles from "./MoviesPage.module.css";

export const MoviesPage = () => {
  const { movies, loading, saving, error, clearError, loadMovies, createMovie, updateMovie } = useMovies();

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div><span className={styles.eyebrow}>THE MARVEL REWATCH PLANNER</span><h1>Build your <em>timeline.</em></h1><p>Collect the films, connect the story, and make every rewatch count.</p></div>
        <div className={styles.counter}><strong>{String(movies.length).padStart(2, "0")}</strong><span>FILMS IN<br />YOUR VAULT</span></div>
      </header>
      {error && <ErrorMessage error={error} title="Movie update didn't stick"><button className={styles.retry} onClick={() => { clearError(); void loadMovies().catch(() => undefined); }}>Retry loading movies</button></ErrorMessage>}
      {loading && movies.length === 0 ? <LoadingSpinner label="Loading your movie vault…" /> : (
        <div className={styles.grid}>
          <MovieForm movies={movies} saving={saving} onSubmit={createMovie} />
          <MovieList movies={movies} disabled={saving} onUpdate={updateMovie} />
        </div>
      )}
    </div>
  );
};
