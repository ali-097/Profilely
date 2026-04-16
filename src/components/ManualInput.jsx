import React, { useEffect, useState } from "react";

export default function ManualInput({ userData, setUserData }) {
  const [name, setName] = useState(userData.name || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [technical, setTechnical] = useState(
    userData.skills && userData.skills.technical
      ? userData.skills.technical.join(", ")
      : "",
  );
  const [tools, setTools] = useState(
    userData.skills && userData.skills.tools
      ? userData.skills.tools.join(", ")
      : "",
  );
  const [linksText, setLinksText] = useState(
    (userData.links || []).map((l) => `${l.label}|${l.url}`).join("\n"),
  );

  useEffect(() => {
    setName(userData.name || "");
    setBio(userData.bio || "");
  }, [userData]);

  function apply() {
    const skills = {
      technical: technical
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: tools
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const links = linksText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.split("|").map((p) => p && p.trim());
        return { label: label || url || "link", url: url || label || "" };
      });

    setUserData({ name, bio, skills, links });
  }

  return (
    <div className="card manual-input">
      <h2>Manual sections</h2>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Bio / About</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

      <label>Technical skills (comma separated)</label>
      <input value={technical} onChange={(e) => setTechnical(e.target.value)} />

      <label>Tools (comma separated)</label>
      <input value={tools} onChange={(e) => setTools(e.target.value)} />

      <label>Links (one per line, format: Label|https://...)</label>
      <textarea
        value={linksText}
        onChange={(e) => setLinksText(e.target.value)}
      />

      <div className="row">
        <button onClick={apply}>Apply</button>
      </div>
    </div>
  );
}
