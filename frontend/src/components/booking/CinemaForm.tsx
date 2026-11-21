import { useState, type FormEvent } from "react";
import type { Cinema, CreateCinemaInput } from "../../types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import styles from "./CinemaForm.module.css";

interface CinemaFormProps {
  saving: boolean;
  onSubmit: (input: CreateCinemaInput) => Promise<Cinema>;
}

export const CinemaForm = ({ saving, onSubmit }: CinemaFormProps) => {
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState("");
  const [validationError, setValidationError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokens = sizes.split(/[\s,]+/).filter(Boolean);
    const bundleSizes = tokens.map(Number);
    if (bundleSizes.length < 1 || bundleSizes.length > 10 || tokens.some((token) => !/^\d+$/.test(token)) || bundleSizes.some((size) => size < 1 || size > 500)) {
      setValidationError("Enter 1–10 whole-number bundle sizes between 1 and 500.");
      return;
    }
    if (new Set(bundleSizes).size !== bundleSizes.length) {
      setValidationError("Bundle sizes must be unique.");
      return;
    }
    setValidationError("");
    try {
      await onSubmit({ name: name.trim(), bundleSizes });
      setName("");
      setSizes("");
    } catch {
      // The page-level API error is displayed with the booking controls.
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.heading}><span className={styles.kicker}>EXPAND THE CIRCUIT</span><h2>Add a cinema</h2><p>Bring another screen and its bundle sizes into the plan.</p></div>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>Cinema name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} placeholder="e.g. Midtown Screens" /></label>
        <label className={styles.field}>Bundle sizes <span>SEPARATE WITH COMMAS</span><input value={sizes} onChange={(event) => setSizes(event.target.value)} required placeholder="e.g. 2, 5, 8" /></label>
        <p className={styles.hint}>Add 1–10 unique sizes from 1 to 500 seats.</p>
        {validationError && <p className={styles.validation} role="alert">{validationError}</p>}
        <Button type="submit" variant="secondary" disabled={saving}>{saving ? "Adding cinema…" : "Add cinema"}</Button>
      </form>
    </Card>
  );
};
