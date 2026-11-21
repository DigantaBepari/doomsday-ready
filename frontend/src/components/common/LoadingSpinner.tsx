import styles from "./LoadingSpinner.module.css";

export const LoadingSpinner = ({ label = "Loading" }: { label?: string }) => (
  <div className={styles.loading} role="status"><span className={styles.spinner} />{label}</div>
);
