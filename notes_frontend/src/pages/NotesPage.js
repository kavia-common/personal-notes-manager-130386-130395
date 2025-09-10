import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import NoteModal from "../components/NoteModal";
import {
  apiCreateNote,
  apiDeleteNote,
  apiGetProfile,
  apiListNotes,
  apiUpdateNote,
  apiLogout,
} from "../services/api";
import "./notes.css";

/**
 * PUBLIC_INTERFACE
 * NotesPage wraps Layout and renders notes grid with CRUD actions.
 */
export default function NotesPage({ onRequireAuth }) {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const orderedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const da = new Date(a.updated_at || a.created_at || 0).getTime();
      const db = new Date(b.updated_at || b.created_at || 0).getTime();
      return db - da;
    });
  }, [notes]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const profile = await apiGetProfile();
        if (!ignore) setUser(profile);
        const data = await apiListNotes();
        if (!ignore) setNotes(Array.isArray(data) ? data : []);
      } catch (e) {
        // not authenticated or fetch error
        onRequireAuth?.();
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [onRequireAuth]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(note) {
    setEditing(note);
    setModalOpen(true);
  }

  async function handleSave(payload) {
    setError("");
    try {
      if (editing?.id) {
        const updated = await apiUpdateNote(editing.id, payload);
        setNotes((prev) =>
          prev.map((n) => (n.id === editing.id ? updated : n))
        );
      } else {
        const created = await apiCreateNote(payload);
        setNotes((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      setError(e.message || "Failed to save note");
    }
  }

  async function handleDelete(note) {
    const confirm = window.confirm(`Delete note "${note.title}"?`);
    if (!confirm) return;
    try {
      await apiDeleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (e) {
      setError(e.message || "Failed to delete note");
    }
  }

  function handleLogout() {
    apiLogout();
    onRequireAuth?.();
  }

  if (loading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="center">
          <div className="spinner" />
          <div className="muted">Loading notes...</div>
        </div>
      </Layout>
    );
    }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={openCreate}>
          + New Note
        </button>
        {error ? <div className="error">{error}</div> : <div />}
      </div>
      <div className="notes-grid">
        {orderedNotes.map((note) => (
          <article className="note-card" key={note.id}>
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <div className="note-actions">
                <button className="icon" onClick={() => openEdit(note)} title="Edit">✎</button>
                <button className="icon danger" onClick={() => handleDelete(note)} title="Delete">🗑</button>
              </div>
            </div>
            {note.content ? (
              <p className="note-content">
                {note.content.length > 220
                  ? note.content.slice(0, 220) + "..."
                  : note.content}
              </p>
            ) : (
              <p className="note-content muted">No content</p>
            )}
            <div className="note-footer">
              <span className="muted">
                Updated {new Date(note.updated_at || note.created_at).toLocaleString()}
              </span>
            </div>
          </article>
        ))}
        {orderedNotes.length === 0 ? (
          <div className="empty">
            <div className="emoji">🗒️</div>
            <div className="msg">No notes yet</div>
            <div className="sub">Create your first note to get started</div>
            <button className="btn btn-primary" onClick={openCreate}>Create Note</button>
          </div>
        ) : null}
      </div>
      <NoteModal
        open={modalOpen}
        initialValue={editing}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
    </Layout>
  );
}
