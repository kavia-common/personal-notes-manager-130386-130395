import React, { useEffect, useState } from "react";
import "./modal.css";

/**
 * Modal dialog for creating/editing a note
 * PUBLIC_INTERFACE
 */
export default function NoteModal({ open, initialValue, onCancel, onSave }) {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [content, setContent] = useState(initialValue?.content || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialValue?.title || "");
    setContent(initialValue?.content || "");
    setError("");
  }, [initialValue, open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSave({ title: title.trim(), content: content });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{initialValue?.id ? "Edit Note" : "New Note"}</h3>
          <button className="icon-btn" aria-label="Close" onClick={onCancel}>
            ✕
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
            />
          </div>
          {error ? <div className="error">{error}</div> : null}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialValue?.id ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
