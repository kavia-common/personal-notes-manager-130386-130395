import React, { useState } from "react";
import { apiLogin } from "../services/api";
import "./login.css";

/**
 * PUBLIC_INTERFACE
 * Simple login form. It expects backend at /api/auth/login to accept email/password.
 */
export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiLogin({ email, password });
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo" aria-hidden>📝</div>
          <div className="brand-title">Notes</div>
        </div>
        <h2>Welcome back</h2>
        <p className="sub">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <div className="form-error">{error}</div> : null}
          <button className="btn btn-primary login-btn" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
