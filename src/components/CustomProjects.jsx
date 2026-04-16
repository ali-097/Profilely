import React from "react";

export default function CustomProjects() {
  // Placeholder structure for future custom project cards feature.
  // Fields: title, description, link, tags — UI only for now.
  return (
    <div className="custom-projects">
      <h2>Custom Projects (optional)</h2>
      <p className="muted">
        Add projects manually instead of importing from GitHub. (Coming soon)
      </p>

      <div className="row" style={{ marginTop: 10 }}>
        <input placeholder="Project title" disabled />
        <input placeholder="Link (optional)" disabled />
      </div>

      <div style={{ marginTop: 8 }}>
        <textarea
          placeholder="Short description (optional)"
          rows={4}
          disabled
        />
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button disabled>Add project</button>
        <div className="muted small">
          Structure is in place; implementation pending.
        </div>
      </div>
    </div>
  );
}
