import type { ChangeEvent, FormEvent } from "react";
import type { Cinema } from "../../types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  cinemas: Cinema[];
  selectedCinemaId: number | null;
  groupSize: string;
  disabled?: boolean;
  onCinemaChange: (id: number | null) => void;
  onGroupSizeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const BookingForm = ({ cinemas, selectedCinemaId, groupSize, disabled, onCinemaChange, onGroupSizeChange, onSubmit }: BookingFormProps) => (
  <Card className={styles.card}>
    <div className={styles.heading}><span className={styles.kicker}>THEATER MISSION</span><h2>Find your seats.</h2><p>Choose a cinema and tell us how many are assembling.</p></div>
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}>Cinema
        <select value={selectedCinemaId ?? ""} onChange={(event: ChangeEvent<HTMLSelectElement>) => onCinemaChange(event.target.value ? Number(event.target.value) : null)} disabled={disabled || cinemas.length === 0} required>
          {cinemas.length === 0 ? <option value="">Add a cinema to get started</option> : <option value="">Choose a cinema…</option>}
          {cinemas.map((cinema) => <option key={cinema.id} value={cinema.id}>{cinema.name} · {cinema.bundleSizes.join(" / ")}</option>)}
        </select>
      </label>
      <label className={styles.field}>Group size <span className={styles.unit}>PEOPLE</span>
        <input type="number" min={1} max={10000} step={1} value={groupSize} onChange={(event: ChangeEvent<HTMLInputElement>) => onGroupSizeChange(event.target.value)} placeholder="6" />
      </label>
      <Button type="submit" disabled={disabled || !selectedCinemaId}>Find bundle combination <span aria-hidden="true"> ↗</span></Button>
    </form>
  </Card>
);
