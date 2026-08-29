import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/auth?mode=login");
        } else if (!data.user.biodataCompleted) {
          router.push("/biodata");
        } else {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) return <div className={styles.center}>Memuat...</div>;
  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Halo, {user.fullName} 👋</h1>
        <p>Kamu berhasil login dengan email: {user.email}</p>

        <div className={styles.bioGrid}>
          <div>
            <span className={styles.bioLabel}>No. HP</span>
            <span>{user.phone}</span>
          </div>
          <div>
            <span className={styles.bioLabel}>Jenis Kelamin</span>
            <span>{user.gender}</span>
          </div>
          <div>
            <span className={styles.bioLabel}>Kelas</span>
            <span>{user.kelas}</span>
          </div>
          <div>
            <span className={styles.bioLabel}>Jurusan</span>
            <span>{user.jurusan}</span>
          </div>
          <div className={styles.bioFull}>
            <span className={styles.bioLabel}>Alamat</span>
            <span>{user.address}</span>
          </div>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
