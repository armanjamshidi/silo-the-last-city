"use client";

import { Component, lazy, Suspense, type ReactNode } from "react";

const SiloExperience = lazy(() => import("./SiloExperience"));

class ArchiveBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  render() {
    if (this.state.failed) {
      return <main className="archive-loading" role="alert">
        <div className="archive-error">
          <h1>The archive could not open</h1>
          <p>Check your connection and reload to try again.</p>
          <button className="primary-button" onClick={() => window.location.reload()}>Reload archive</button>
        </div>
      </main>;
    }
    return this.props.children;
  }
}

function ArchiveLoading() {
  return (
    <main className="archive-loading" aria-label="Loading the Silo 18 structural archive" aria-busy="true">
      <div className="archive-loading__brand"><span>18</span><div><small>THE LAST CITY</small><b>SILO</b></div></div>
      <div className="archive-loading__model" aria-hidden="true">
        <div className="archive-loading__cap" />
        <div className="archive-loading__floors">{Array.from({ length: 44 }, (_, index) => <i key={index} />)}</div>
        <div className="archive-loading__core" />
        <div className="archive-loading__deep" />
      </div>
      <div className="archive-loading__copy"><span>STRUCTURAL ARCHIVE</span><b>OPENING SILO 18</b><small>Loading the interactive cutaway and evidence ledger…</small></div>
    </main>
  );
}

export default function ExperienceShell() {
  return <ArchiveBoundary><Suspense fallback={<ArchiveLoading />}><SiloExperience /></Suspense></ArchiveBoundary>;
}
