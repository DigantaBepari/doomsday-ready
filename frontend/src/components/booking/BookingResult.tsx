import type { BookingResult as BookingResultData } from "../../types";
import { Card } from "../common/Card";
import { LoadingSpinner } from "../common/LoadingSpinner";
import styles from "./BookingResult.module.css";

interface BookingResultProps {
  booking: BookingResultData | null;
  loading: boolean;
  hasRequest: boolean;
}

export const BookingResult = ({ booking, loading, hasRequest }: BookingResultProps) => {
  if (loading) return <Card className={styles.result}><LoadingSpinner label="Finding the best bundle mix…" /></Card>;
  if (!booking) {
    return <Card className={styles.empty}><span className={styles.orbit} aria-hidden="true">◎</span><strong>{hasRequest ? "No booking result yet" : "Your crew is almost ready"}</strong><p>{hasRequest ? "Submit a cinema and group size to see the exact bundle mix." : "Select a cinema and group size to see the best way to book."}</p></Card>;
  }

  if (!booking.possible) {
    return <Card className={`${styles.result} ${styles.impossible}`}>
      <span className={styles.kicker}>BOOKING CHECK</span><div className={styles.noIcon} aria-hidden="true">×</div>
      <h2>This group won’t fit the available bundles.</h2><p>{booking.message}. Try another cinema or adjust the group size.</p>
    </Card>;
  }

  return <Card className={`${styles.result} ${styles.possible}`}>
    <div className={styles.topline}><span className={styles.kicker}>BEST AVAILABLE COMBINATION</span><span className={styles.yes}>EXACT MATCH</span></div>
    <h2>Everyone gets a seat.</h2><p className={styles.subtitle}>{booking.groupSize} guests · {booking.totalBundles} bundles to buy</p>
    <div className={styles.breakdown}>
      {booking.breakdown.map((item) => <span className={styles.bundle} key={item.size}><strong>{item.size}</strong><i>×</i>{item.count}<small>SEATS</small></span>)}
    </div>
    <p className={styles.summary}>{booking.breakdown.map(({ size, count }) => `${size} × ${count}`).join(", ")}, {booking.totalBundles} bundles total</p>
  </Card>;
};
