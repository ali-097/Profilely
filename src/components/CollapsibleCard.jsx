import React, { useState } from "react";

export default function CollapsibleCard({
  title,
  defaultOpen = false,
  children,
  actions,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`card collapsible ${open ? "open" : "closed"}`}>
      <div
        className="collapsible-header"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        <div className="collapsible-title">{title}</div>
        <div className="collapsible-actions">
          {actions}
          <button
            className="collapse-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? "▾" : "▸"}
          </button>
        </div>
      </div>

      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}
