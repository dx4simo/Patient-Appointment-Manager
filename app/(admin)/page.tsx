import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Welcome to the clinic admin panel</p>

      <div className={styles.placeholder}>
        <p>Patient and appointment statistics will appear here in Phase 5.</p>
      </div>
    </div>
  );
}
