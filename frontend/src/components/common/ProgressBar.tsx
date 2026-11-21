import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export const ProgressBar = ({ value, max, label }: ProgressBarProps) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={styles.wrapper}>
      <div className={styles.track} role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <span className={styles.fill} style={{ width: `${percentage}%` }} />
      </div>
      <span className={styles.percent}>{Math.round(percentage)}%</span>
    </div>
  );
};
