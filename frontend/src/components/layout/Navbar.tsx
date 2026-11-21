import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const links = [
  { to: "/movies", label: "Movies", short: "01" },
  { to: "/rewatch", label: "Rewatch plan", short: "02" },
  { to: "/booking", label: "Cinema booking", short: "03" },
];

export const Navbar = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <NavLink to="/movies" className={styles.brand} aria-label="Doomsday Ready home">
        <span className={styles.brandMark} aria-hidden="true">✦</span>
        <span><strong>DOOMSDAY</strong><small>READY</small></span>
      </NavLink>
      <nav className={styles.nav} aria-label="Main navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>
            <span className={styles.linkNumber}>{link.short}</span>{link.label}
          </NavLink>
        ))}
      </nav>
      <span className={styles.status}><i /> PHASE: REWATCH</span>
    </div>
  </header>
);
