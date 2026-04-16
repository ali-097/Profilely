import React, { useState } from "react";
import { format } from "date-fns";

export default function RepoList({
  repos,
  setRepos,
  selectedIds,
  setSelectedIds,
  featuredIds,
  setFeaturedIds,
}) {
  const [excludeForks, setExcludeForks] = useState(false);
  const [excludeNoReadme, setExcludeNoReadme] = useState(false);
  const [checkingReadmes, setCheckingReadmes] = useState(false);

  function toggleSelect(id) {
    const ns = new Set(selectedIds);
    if (ns.has(id)) ns.delete(id);
    else ns.add(id);
    setSelectedIds(ns);
  }

  function toggleFeatured(id) {
    const ns = new Set(featuredIds);
    if (ns.has(id)) ns.delete(id);
    else ns.add(id);
    setFeaturedIds(ns);
  }

  const visible = repos.filter((r) => {
    if (excludeForks && r.fork) return false;
    if (excludeNoReadme && r.hasReadme === false) return false;
    return true;
  });

  async function checkReadmesAll() {
    setCheckingReadmes(true);
    const concurrency = 5;
    let i = 0;
    const arr = repos.slice();

    async function worker() {
      while (true) {
        const idx = i++;
        if (idx >= arr.length) break;
        const r = arr[idx];
        try {
          const res = await fetch(
            `https://api.github.com/repos/${r.full_name}/readme`,
            {
              headers: { Accept: "application/vnd.github.v3.raw" },
            },
          );
          if (res.ok) {
            r.hasReadme = true;
            r.readme = await res.text();
          } else {
            r.hasReadme = false;
            r.readme = null;
          }
        } catch (e) {
          r.hasReadme = false;
          r.readme = null;
        }
      }
    }

    await Promise.all(new Array(concurrency).fill().map(() => worker()));
    setRepos(arr);
    setCheckingReadmes(false);
  }

  return (
    <div className="card repo-list">
      <h2>Repositories ({repos.length})</h2>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={excludeForks}
            onChange={(e) => setExcludeForks(e.target.checked)}
          />{" "}
          Exclude forks
        </label>
        <label>
          <input
            type="checkbox"
            checked={excludeNoReadme}
            onChange={(e) => setExcludeNoReadme(e.target.checked)}
          />{" "}
          Exclude repos without README
        </label>
        <button
          onClick={checkReadmesAll}
          disabled={checkingReadmes || repos.length === 0}
        >
          {checkingReadmes ? "Checking READMEs…" : "Check READMEs"}
        </button>
      </div>

      <ul className="repo-items">
        {visible.map((r) => (
          <li key={r.id} className="repo-item">
            <div className="repo-main">
              <input
                type="checkbox"
                checked={selectedIds.has(r.id)}
                onChange={() => toggleSelect(r.id)}
              />
              <div className="repo-meta">
                <a href={r.html_url} target="_blank" rel="noreferrer">
                  <strong>{r.name}</strong>
                </a>
                <div className="muted small">
                  {r.language || "—"} • ⭐ {r.stargazers_count || 0} •{" "}
                  {r.updated_at ? format(new Date(r.updated_at), "PPP") : "—"}
                </div>
                <div className="desc">
                  {r.hasReadme && r.readme
                    ? r.readme.split("\n\n")[0]
                    : r.description || "No description available"}
                </div>
              </div>
            </div>
            <div className="repo-actions">
              <button onClick={() => toggleFeatured(r.id)}>
                {featuredIds.has(r.id) ? "Unfeature" : "Feature"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
