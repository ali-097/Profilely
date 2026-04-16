import React from "react";
import { format } from "date-fns";

function firstParagraph(text) {
  if (!text) return null;
  const p = text.split("\n\n")[0];
  return p.length > 400 ? p.slice(0, 400) + "…" : p;
}

function escapeHtml(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function Preview({
  repos,
  allRepos,
  userData,
  theme,
  setTheme,
}) {
  const initials = (userData.name || "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const langMap = {};
  (allRepos || []).forEach((r) => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  });
  const languages = Object.entries(langMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className={`preview theme-${theme}`}>
      <div className="preview-header">
        <div className="preview-hero">
          <div className="avatar-circle">{initials || "U"}</div>
          <div>
            <h2>{userData.name || "Your Name"}</h2>
            <p className="muted">
              {userData.bio || "Short bio will appear here."}
            </p>
          </div>
        </div>
        <div className="theme-select">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="minimal">Minimal</option>
            <option value="dark">Dark</option>
            <option value="grid">Card Grid</option>
          </select>
          <button
            className="popout-btn"
            onClick={() => {
              const title = userData.name || "Portfolio";
              const head = `<!doctype html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(
                title,
              )}</title><style>:root{--bg:#f7fafc;--card-bg:#ffffff;--text:#0f1724;--muted:rgba(15,23,36,0.68);--accent:#ff6b6b;--accent-bg:rgba(255,107,107,0.08);--border:#e6eef4}body{font-family:system-ui,Segoe UI,Roboto,-apple-system,Arial;padding:24px;background:var(--bg);color:var(--text)}h1{margin:0 0 12px}a{color:var(--accent)} .project{border:1px solid var(--border);padding:12px;border-radius:6px;margin-bottom:12px;background:var(--card-bg)}.muted{color:var(--muted)}</style></head>`;
              const body = `<body><header><h1>${escapeHtml(title)}</h1><p>${escapeHtml(
                userData.bio || "",
              )}</p></header><main>${repos
                .map(
                  (r) =>
                    `<article class="project"><h3><a href="${escapeHtml(
                      r.html_url,
                    )}">${escapeHtml(r.name)}</a></h3><p>${escapeHtml(
                      firstParagraph(
                        r.hasReadme && r.readme
                          ? r.readme
                          : r.description || "No description available",
                      ),
                    )}</p></article>`,
                )
                .join("")}</main></body>`;
              const html = `${head}${body}`;
              const w = window.open("", "_blank", "noopener,noreferrer");
              if (w) {
                w.document.write(html);
                w.document.close();
              } else {
                alert("Unable to open preview - please allow popups.");
              }
            }}
          >
            Open preview
          </button>
        </div>
      </div>

      <section className="preview-section">
        <h3>Skills</h3>
        <div className="chips">
          {(userData.skills?.technical || []).map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
          {(userData.skills?.tools || []).map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="preview-section">
        <h3>Language summary</h3>
        <div className="muted small">
          {languages.length === 0
            ? "No languages detected"
            : languages.map(([l, c]) => `${l}: ${c}`).join(" • ")}
        </div>
      </section>

      <section className="preview-section">
        <h3>Projects</h3>
        <div className={`projects ${theme === "grid" ? "grid" : "list"}`}>
          {repos.map((r) => (
            <article className="project" key={r.id}>
              <div className="project-media">
                <img
                  src={
                    r.owner_avatar ||
                    `https://picsum.photos/seed/${r.id}/600/320`
                  }
                  alt="project"
                />
              </div>
              <h4>
                <a href={r.html_url} target="_blank" rel="noreferrer">
                  {r.name}
                </a>
              </h4>
              <div className="muted small">
                {r.language || "—"} • ⭐ {r.stargazers_count || 0} •{" "}
                {r.updated_at ? format(new Date(r.updated_at), "PPP") : "—"}
              </div>
              <p>
                {firstParagraph(
                  r.hasReadme && r.readme
                    ? r.readme
                    : r.description || "No description",
                )}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
