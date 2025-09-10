import React from "react";
import "./layout.css";

/**
 * Layout with top navbar and left sidebar.
 * PUBLIC_INTERFACE
 */
export default function Layout({ user, onLogout, children }) {
  return (
    <div className="layout-root">
      <nav className="topnav">
        <div className="brand">
          <div className="logo" aria-hidden>📝</div>
          <div className="brand-text">
            <span className="brand-title">Notes</span>
            <span className="brand-sub">Minimal & Fast</span>
          </div>
        </div>
        <div className="actions">
          {user ? (
            <>
              <span className="user-pill" title={user.email || "User"}>
                {user.email ? user.email : "User"}
              </span>
              <button className="btn btn-accent" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </nav>
      <div className="body">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Navigation</div>
            <ul className="nav-list">
              <li className="active">All Notes</li>
            </ul>
          </div>
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
