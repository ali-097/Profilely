import React, { useState } from "react";

export default function GitHubImporter({ onReposFetched }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleImport() {
    setError(null);
    if (!username) {
      setError("Please enter a GitHub username");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=updated&direction=desc`,
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found");
        throw new Error("Failed to fetch repositories");
      }
      const data = await res.json();
      const repos = data.map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        stargazers_count: r.stargazers_count,
        updated_at: r.updated_at,
        language: r.language,
        fork: r.fork,
        html_url: r.html_url,
        hasReadme: null,
        readme: null,
      }));
      onReposFetched(repos);
    } catch (e) {
      setError(e.message || "Error fetching repositories");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card github-importer">
      <h2>Import from GitHub</h2>
      <div className="row">
        <input
          placeholder="GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
        />
        <button onClick={handleImport} disabled={loading}>
          {loading ? "Importing…" : "Import"}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <p className="muted">No authentication required (rate limits apply).</p>
    </div>
  );
}
