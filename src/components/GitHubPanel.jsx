import React, { useState } from "react";
import { format } from "date-fns";

export default function GitHubPanel({
  repos,
  setRepos,
  selectedIds,
  setSelectedIds,
  featuredIds,
  setFeaturedIds,
}) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [excludeForks, setExcludeForks] = useState(false);
  const [excludeNoReadme, setExcludeNoReadme] = useState(false);
  const [checkingReadmes, setCheckingReadmes] = useState(false);

  async function handleImport() {
    setError(null);
    if (!username) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=updated&direction=desc`,
      );

      if (!response.ok) {
        if (response.status === 404) throw new Error("User not found");
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      const mapped = data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        updated_at: repo.updated_at,
        language: repo.language,
        fork: repo.fork,
        html_url: repo.html_url,
        hasReadme: null,
        readme: null,
      }));

      setRepos(mapped);
      setSelectedIds(new Set(mapped.map((repo) => repo.id)));
      setFeaturedIds(new Set());
    } catch (fetchError) {
      setError(fetchError.message || "Error fetching repositories");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function toggleFeatured(id) {
    const next = new Set(featuredIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFeaturedIds(next);
  }

  const visibleRepos = (repos || []).filter((repo) => {
    if (excludeForks && repo.fork) return false;
    if (excludeNoReadme && repo.hasReadme === false) return false;
    return true;
  });

  async function checkReadmesAll() {
    setCheckingReadmes(true);
    const concurrency = 5;
    let currentIndex = 0;
    const repoList = (repos || []).slice();

    async function worker() {
      while (true) {
        const index = currentIndex++;
        if (index >= repoList.length) return;

        const repo = repoList[index];
        try {
          const response = await fetch(
            `https://api.github.com/repos/${repo.full_name}/readme`,
            {
              headers: { Accept: "application/vnd.github.v3.raw" },
            },
          );
          if (response.ok) {
            repo.hasReadme = true;
            repo.readme = await response.text();
          } else {
            repo.hasReadme = false;
            repo.readme = null;
          }
        } catch {
          repo.hasReadme = false;
          repo.readme = null;
        }
      }
    }

    await Promise.all(new Array(concurrency).fill().map(() => worker()));
    setRepos(repoList);
    setCheckingReadmes(false);
  }

  return (
    <div className="github-panel">
      <div className="github-panel-header">
        <div className="github-panel-inputs">
          <input
            placeholder="GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
          />
          <button onClick={handleImport} disabled={loading}>
            {loading ? "Importing…" : "Import"}
          </button>
        </div>

        <div className="github-panel-filters">
          <div className="github-panel-options">
            <label className="github-filter">
              <input
                type="checkbox"
                checked={excludeForks}
                onChange={(e) => setExcludeForks(e.target.checked)}
              />
              Exclude forks
            </label>
            <label className="github-filter">
              <input
                type="checkbox"
                checked={excludeNoReadme}
                onChange={(e) => setExcludeNoReadme(e.target.checked)}
              />
              Exclude repos without README
            </label>
            <button
              className="github-panel-check"
              onClick={checkReadmesAll}
              disabled={checkingReadmes || (repos || []).length === 0}
            >
              {checkingReadmes ? "Checking READMEs…" : "Check READMEs"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <ul className="repo-items">
        {visibleRepos.map((repo) => (
          <li key={repo.id} className="repo-item">
            <div className="repo-row">
              <label className="repo-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.has(repo.id)}
                  onChange={() => toggleSelect(repo.id)}
                />
              </label>
              <div className="repo-content">
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  <strong>{repo.name}</strong>
                </a>
                <div className="muted small">
                  {repo.language || "—"} • ⭐ {repo.stargazers_count || 0} •{" "}
                  {repo.updated_at
                    ? format(new Date(repo.updated_at), "PPP")
                    : "—"}
                </div>
                <div className="desc">
                  {repo.hasReadme && repo.readme
                    ? repo.readme.split("\n\n")[0]
                    : repo.description || "No description"}
                </div>
              </div>
            </div>
            <div className="repo-actions">
              <button onClick={() => toggleFeatured(repo.id)}>
                {featuredIds.has(repo.id) ? "Unfeature" : "Feature"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
