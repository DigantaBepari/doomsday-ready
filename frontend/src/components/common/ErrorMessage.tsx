import type { ReactNode } from "react";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  error: Error | string | null;
  title?: string;
  children?: ReactNode;
}

export const ErrorMessage = ({ error, title = "Something went wrong", children }: ErrorMessageProps) => {
  if (!error) return null;
  const code = typeof error === "object" && "code" in error ? String(error.code) : "";
  const message = code === "CIRCULAR_DEPENDENCY"
    ? "That prerequisite creates a loop in your watch order. Choose a different movie."
    : typeof error === "string" ? error : error.message;

  return (
    <div className={styles.error} role="alert">
      <span className={styles.symbol} aria-hidden="true">!</span>
      <div><strong>{title}</strong><p>{message}</p>{children}</div>
    </div>
  );
};
