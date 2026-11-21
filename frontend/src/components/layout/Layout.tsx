import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";

export const Layout = () => (
  <div className={styles.shell}>
    <Navbar />
    <main className={styles.main}><Outlet /></main>
    <Footer />
  </div>
);
