import type { RewatchOrder } from "../../types";
import { Card } from "../common/Card";
import { ProgressBar } from "../common/ProgressBar";
import styles from "./RewatchSummary.module.css";

interface RewatchSummaryProps {
  plan: RewatchOrder;
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
};

export const RewatchSummary = ({ plan }: RewatchSummaryProps) => (
  <Card className={styles.card}>
    <div className={styles.topline}><span className={styles.kicker}>MISSION READINESS</span><span className={styles.icon} aria-hidden="true">◈</span></div>
    <h2>{plan.watchedCount} <span>of</span> {plan.totalCount} watched</h2>
    <ProgressBar value={plan.watchedCount} max={plan.totalCount} label="Rewatch completion" />
    <div className={styles.footer}>
      <div><span className={styles.caption}>TARGET</span><strong>{plan.target.title}</strong></div>
      <div className={styles.time}><span className={styles.caption}>TIME LEFT</span><strong>{formatDuration(plan.remainingRuntimeMinutes)}</strong></div>
    </div>
  </Card>
);
