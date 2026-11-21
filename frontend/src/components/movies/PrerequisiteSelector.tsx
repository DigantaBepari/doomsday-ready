import type { ChangeEvent } from "react";
import type { Movie } from "../../types";
import styles from "./PrerequisiteSelector.module.css";

interface PrerequisiteSelectorProps {
  movies: Movie[];
  value: number[];
  onChange: (ids: number[]) => void;
  excludeId?: number;
  disabled?: boolean;
  id: string;
}

export const PrerequisiteSelector = ({ movies, value, onChange, excludeId, disabled, id }: PrerequisiteSelectorProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(Array.from(event.currentTarget.selectedOptions, (option) => Number(option.value)));
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id}>Must watch first <span>OPTIONAL · SELECT MULTIPLE</span></label>
      <select id={id} multiple value={value.map(String)} onChange={handleChange} disabled={disabled} size={Math.min(4, Math.max(2, movies.length))}>
        {movies.filter((movie) => movie.id !== excludeId).map((movie) => (
          <option key={movie.id} value={movie.id}>{movie.title}</option>
        ))}
      </select>
      <small>Hold Ctrl (Windows) or ⌘ (Mac) to select more than one.</small>
    </div>
  );
};
