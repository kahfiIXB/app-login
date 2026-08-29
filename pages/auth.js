import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Auth.module.css";

export default function AuthPage() {
  const router = useRouter();
  const [rightPanelActive, setRightPanelActive] = useState(false); // false = login shown, true = sign up shown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (router.query.mode === "register") setRightPanelActive(true);
    if (router.query.mode === "login") setRightPanelActive(false);
  }, [router.query.mode]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push(data.user.biodataCompleted ? "/dashboard" : "/biodata");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push("/biodata"); // user baru selalu isi biodata dulu
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div
        className={`${styles.container} ${
          rightPanelActive ? styles.rightPanelActive : ""
        }`}
      >
        {/* SIGN UP FORM */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleRegister}>
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Full name"
              required
              value={registerForm.fullName}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, fullName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email address"
              required
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
            />
            {rightPanelActive && error && (
              <p className={styles.error}>{error}</p>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "..." : "SIGN UP"}
            </button>
          </form>
        </div>

        {/* LOGIN FORM */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              required
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            {!rightPanelActive && error && (
              <p className={styles.error}>{error}</p>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "..." : "LOGIN"}
            </button>
          </form>
        </div>

        {/* SLIDING OVERLAY */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h3>Welcome back</h3>
              <p>Login to access your account and continue.</p>
              <button
                className={styles.ghostBtn}
                type="button"
                onClick={() => {
                  setError("");
                  setRightPanelActive(false);
                }}
              >
                LOGIN
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h3>Hello there</h3>
              <p>
                Begin your journey using this app, and start managing your
                account now.
              </p>
              <button
                className={styles.ghostBtn}
                type="button"
                onClick={() => {
                  setError("");
                  setRightPanelActive(true);
                }}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
