import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import NotesPage from "./pages/NotesPage";
import { isAuthenticated } from "./services/api";

// PUBLIC_INTERFACE
function App() {
  /**
   * This top-level component switches between Login and the main Notes page.
   * It also manages the (optional) theme toggle retained from the template.
   */
  const [theme, setTheme] = useState("light");
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  function requireAuth() {
    setAuthed(false);
  }

  function onLoggedIn() {
    setAuthed(true);
  }

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      {authed ? (
        <NotesPage onRequireAuth={requireAuth} />
      ) : (
        <Login onSuccess={onLoggedIn} />
      )}
    </div>
  );
}

export default App;
