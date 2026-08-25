import Link from "next/link";
import styles from "../styles/Landing.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <span className={styles.logo}>MyApp</span>
        <div className={styles.navLinks}>
          <Link href="/auth?mode=login" className={styles.navBtnGhost}>
            Login
          </Link>
          <Link href="/auth?mode=register" className={styles.navBtn}>
            Sign Up
          </Link>
        </div>
      </nav>

      <main className={styles.hero}>
        <h1>Selamat Datang di MyApp</h1>
        <p>
          Landing page sederhana dengan sistem register &amp; login,
          terhubung ke database MySQL lewat Laragon.
        </p>
        <div className={styles.heroBtns}>
          <Link href="/auth?mode=register" className={styles.navBtn}>
            Mulai Sekarang
          </Link>
          <Link href="/auth?mode=login" className={styles.navBtnGhost}>
            Sudah punya akun? Login
          </Link>
        </div>
      </main>
    </div>
  );
}
