//
// PUBLIC_INTERFACE
// api.js - Minimal HTTP client for Notes Backend
// Uses fetch with JSON helpers and exposes typed functions for auth and notes CRUD.
//

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

/**
 * Handle HTTP responses, throwing on non-2xx and parsing JSON when available.
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const hasJSON = contentType.includes("application/json");
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    if (hasJSON) {
      try {
        const data = await res.json();
        message = data?.message || data?.detail || message;
      } catch (e) {
        // ignore JSON parse error
      }
    } else {
      try {
        const text = await res.text();
        if (text) message = text;
      } catch (e) {
        // ignore
      }
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  if (hasJSON) return res.json();
  return null;
}

/**
 * Get auth headers from localStorage if token exists.
 */
function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Build a full URL from base and path
 */
function url(path) {
  if (!API_BASE_URL) return path; // fallback, useful in preview where proxy may be configured
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

// PUBLIC_INTERFACE
export async function apiLogin({ email, password }) {
  /** Login and store token; expects backend to return { access_token, token_type } */
  const res = await fetch(url("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  if (data?.access_token) {
    localStorage.setItem("auth_token", data.access_token);
  }
  return data;
}

// PUBLIC_INTERFACE
export function apiLogout() {
  /** Clear auth token */
  localStorage.removeItem("auth_token");
}

// PUBLIC_INTERFACE
export async function apiGetProfile() {
  /** Get current user profile if authenticated */
  const res = await fetch(url("/api/auth/me"), {
    headers: { ...authHeaders() },
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiListNotes() {
  /** Fetch list of notes */
  const res = await fetch(url("/api/notes"), {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiCreateNote({ title, content }) {
  /** Create a new note */
  const res = await fetch(url("/api/notes"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiUpdateNote(id, { title, content }) {
  /** Update an existing note */
  const res = await fetch(url(`/api/notes/${encodeURIComponent(id)}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiDeleteNote(id) {
  /** Delete a note by id */
  const res = await fetch(url(`/api/notes/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export function isAuthenticated() {
  /** Check if user is authenticated by presence of token */
  return Boolean(localStorage.getItem("auth_token"));
}
