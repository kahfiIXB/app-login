import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Auth.module.css";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (router.query.mode === "register") {
      setIsLogin(false);
    }

    if (router.query.mode === "login") {
      setIsLogin(true);
    }
  }, [router.query.mode]);

  function switchMode(login) {
    setError("");
    setIsLogin(login);
  }

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/dashboard");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div
        className={`${styles.card} ${
          !isLogin ? styles.signUpMode : ""
        }`}
      >
        {/* =================================
            FORM SIDE
        ================================= */}

        <div className={styles.formsSide}>
          {/* LOGIN FORM */}

          <form
            className={`${styles.form} ${styles.loginForm}`}
            onSubmit={handleLogin}
          >
            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              required
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password: e.target.value,
                })
              }
            />

            {error && isLogin && (
              <p className={styles.error}>{error}</p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "..." : "LOGIN"}
            </button>
          </form>

          {/* SIGN UP FORM */}

          <form
            className={`${styles.form} ${styles.registerForm}`}
            onSubmit={handleRegister}
          >
            <h2>Sign Up</h2>

            <input
              type="text"
              placeholder="Full name"
              required
              value={registerForm.fullName}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  fullName: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email address"
              required
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  password: e.target.value,
                })
              }
            />

            {error && !isLogin && (
              <p className={styles.error}>{error}</p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "..." : "SIGN UP"}
            </button>
          </form>
        </div>

        {/* =================================
            PANEL SIDE
        ================================= */}

        <div className={styles.panelsSide}>
          <div className={styles.panel}>
            <div className={styles.panelContent}>
              {isLogin ? (
                <>
                  <h3>Hello there</h3>

                  <p>
                    Begin your journey using this app, and start
                    managing your account now.
                  </p>

                  <button
                    className={styles.ghostBtn}
                    onClick={() => switchMode(false)}
                    type="button"
                  >
                    SIGN UP
                  </button>
                </>
              ) : (
                <>
                  <h3>Welcome back</h3>

                  <p>
                    Login to access your account and continue.
                  </p>

                  <button
                    className={styles.ghostBtn}
                    onClick={() => switchMode(true)}
                    type="button"
                  >
                    LOGIN
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}