import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
