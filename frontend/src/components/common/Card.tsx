import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

export const Card = ({ className = "", ...props }: HTMLAttributes<HTMLElement>) => (
  <section className={`${styles.card} ${className}`} {...props} />
);
