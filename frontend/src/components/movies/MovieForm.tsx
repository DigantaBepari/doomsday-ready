import { useState, type FormEvent } from "react";
import type { CreateMovieInput, Movie } from "../../types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PrerequisiteSelector } from "./PrerequisiteSelector";
import styles from "./MovieForm.module.css";

interface MovieFormProps {
  movies: Movie[];
  saving: boolean;
  onSubmit: (input: CreateMovieInput) => Promise<unknown>;
}

export const MovieForm = ({ movies, saving, onSubmit }: MovieFormProps) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [runtime, setRuntime] = useState("");
  const [prerequisiteIds, setPrerequisiteIds] = useState<number[]>([]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input: CreateMovieInput = {
      title: title.trim(),
      runtimeMinutes: Number(runtime),
      prerequisiteIds,
      ...(year ? { releaseYear: Number(year) } : {}),
    };
    try {
      await onSubmit(input);
      setTitle("");
      setYear("");
      setRuntime("");
      setPrerequisiteIds([]);
    } catch {
      // The page-level API error is shown above the form.
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.heading}><span className={styles.kicker}>ADD TO YOUR TIMELINE</span><h2>Queue a movie</h2><p>Build a watch path worth assembling for.</p></div>
      <form onSubmit={submit} className={styles.form}>
        <label className={styles.field}>Movie title<input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={180} placeholder="e.g. Iron Man" /></label>
        <div className={styles.row}>
          <label className={styles.field}>Release year <span className={styles.optional}>OPTIONAL</span><input type="number" value={year} onChange={(event) => setYear(event.target.value)} min={1888} max={3000} placeholder="2008" /></label>
          <label className={styles.field}>Runtime <span className={styles.optional}>MINUTES</span><input type="number" value={runtime} onChange={(event) => setRuntime(event.target.value)} min={1} max={300} required placeholder="126" /></label>
        </div>
        <PrerequisiteSelector id="new-movie-prerequisites" movies={movies} value={prerequisiteIds} onChange={setPrerequisiteIds} disabled={saving} />
        <Button type="submit" disabled={saving}>{saving ? "Adding…" : "Add to movie list"}<span aria-hidden="true"> ↗</span></Button>
      </form>
    </Card>
  );
};
