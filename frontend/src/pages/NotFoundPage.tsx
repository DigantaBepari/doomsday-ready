import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import styles from "./NotFoundPage.module.css";

export const NotFoundPage = () => (
  <div className={styles.page}>
    <span className={styles.code}>404 · OFF THE TIMELINE</span>
    <div className={styles.mark} aria-hidden="true">✦</div>
    <h1>This page has<br /><em>left the multiverse.</em></h1>
    <p>The coordinates don’t match a known mission. Head back to your movie vault.</p>
    <Link to="/movies"><Button>Return to the vault</Button></Link>
  </div>
);
