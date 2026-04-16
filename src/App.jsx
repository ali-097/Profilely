import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import "./App.css";
import GitHubPanel from "./components/GitHubPanel";
import CustomProjects from "./components/CustomProjects";
import ManualInput from "./components/ManualInput";
import Exporter from "./components/Exporter";
import CollapsibleCard from "./components/CollapsibleCard";

function App() {
  const [repos, setRepos] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [featuredIds, setFeaturedIds] = useState(new Set());
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    skills: { technical: [], tools: [] },
    links: [],
  });
  const [theme, setTheme] = useState("list");

  const selectedRepos = useMemo(() => {
    const selected = repos.filter((r) => selectedIds.has(r.id));
    const featured = selected.filter((r) => featuredIds.has(r.id));
    const others = selected.filter((r) => !featuredIds.has(r.id));
    return [...featured, ...others];
  }, [repos, selectedIds, featuredIds]);

  const bcRef = useRef(null);
  const exportRef = useRef(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const publishPreview = useCallback((payload) => {
    try {
      localStorage.setItem("profilely_preview", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not store preview data", e);
    }
    if (bcRef.current) {
      try {
        bcRef.current.postMessage(payload);
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  // Keep preview data in localStorage and broadcast to preview window if open
  useEffect(() => {
    const payload = { userData, repos: selectedRepos, theme };
    publishPreview(payload);
  }, [userData, selectedRepos, theme, publishPreview]);

  const openPreview = useCallback(() => {
    const payload = { userData, repos: selectedRepos, theme };
    try {
      localStorage.setItem("profilely_preview", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not store preview data", e);
    }
    // open a new window and create a BroadcastChannel for live updates
    const w = window.open("/preview.html", "profilely_preview");
    try {
      bcRef.current = new BroadcastChannel("profilely-preview");
      bcRef.current.postMessage(payload);
    } catch (e) {
      // BroadcastChannel not available or cross-origin prevented
      // still the preview page will read from localStorage
    }
    if (w) w.focus();
  }, [userData, selectedRepos, theme]);

  useEffect(() => {
    return () => {
      try {
        if (bcRef.current) bcRef.current.close();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden>
            PL
          </div>
          <div className="brand-text">
            <h1>Profilely</h1>
            <div className="tagline">
              Build portfolio pages from your projects and profile details
            </div>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="theme-switcher">
            <label>
              <span>Preview mode</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                aria-label="Choose preview mode"
              >
                <option value="list">List view</option>
                <option value="grid">Grid view</option>
              </select>
            </label>
          </div>
          <button
            className={`dev-toggle ${devMode ? "active" : ""}`}
            onClick={() => setDevMode((v) => !v)}
            title="Developer mode — enables GitHub import"
          >
            <span className="dev-icon">&lt;/&gt;</span>
            <span className="dev-label">Developer mode</span>
          </button>
          <button
            className="top-action"
            onClick={openPreview}
            title="Open live preview"
          >
            Preview
          </button>
          <button
            className="top-action"
            onClick={() => exportRef.current && exportRef.current.exportZip()}
            title="Export static site"
          >
            Export
          </button>
          <button
            className="top-action"
            onClick={() => setShowDeployModal(true)}
            title="Hosting guide"
          >
            Host
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio design in one workspace</p>
          <h2>
            Shape your developer story with curated projects, GitHub import, and
            polished export tools.
          </h2>
          <p className="muted hero-text">
            Manage your profile in a single streamlined interface with a calm,
            consistent theme and clear page structure.
          </p>
        </div>
        <div className="hero-highlights">
          <div className="hero-card">
            <span className="hero-icon">⚡</span>
            <div>
              <strong>Fast workflow</strong>
              <p className="muted small">
                Import repos, edit details, and export a ready-made portfolio
                with fewer clicks.
              </p>
            </div>
          </div>
          <div className="hero-card">
            <span className="hero-icon">📦</span>
            <div>
              <strong>Clean structure</strong>
              <p className="muted small">
                Every section feels balanced, with generous spacing and
                consistent card design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="workspace">
        <div className="cards-grid">
          <CollapsibleCard title="Custom Projects" defaultOpen={true}>
            <CustomProjects />
          </CollapsibleCard>

          {devMode && (
            <CollapsibleCard title="Developer: GitHub" defaultOpen={true}>
              <GitHubPanel
                repos={repos}
                setRepos={setRepos}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                featuredIds={featuredIds}
                setFeaturedIds={setFeaturedIds}
              />
            </CollapsibleCard>
          )}

          <CollapsibleCard title="Manual info" defaultOpen={false}>
            <ManualInput userData={userData} setUserData={setUserData} />
          </CollapsibleCard>

          <CollapsibleCard title="Export" defaultOpen={false}>
            <Exporter
              ref={exportRef}
              repos={selectedRepos}
              userData={userData}
              theme={theme}
            />
          </CollapsibleCard>
        </div>
      </main>

      {showDeployModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeployModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Deploy to Vercel</h3>
            <ol>
              <li>Unzip the exported archive.</li>
              <li>Initialize a git repo and push to GitHub (optional).</li>
              <li>
                Import the project into Vercel or use the Vercel CLI: `vercel`.
              </li>
            </ol>
            <div className="row" style={{ marginTop: 12 }}>
              <button onClick={() => setShowDeployModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
