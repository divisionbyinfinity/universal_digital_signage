import React from "react";
import { useConfig } from "../contexts/ConfigContext";

const supportCards = [
  {
    title: "Repository",
    description: "Review the source, setup notes, and deployment guidance.",
    suffix: "Repository",
  },
  {
    title: "Wiki",
    description: "Read implementation details and workflow instructions.",
    suffix: "wiki",
  },
  {
    title: "Issues",
    description: "Track bugs, requests, and operational follow-ups.",
    suffix: "issues",
  },
];

export default function Help() {
  const { configData } = useConfig();
  const githubUrl = configData?.github?.url || "";
  const githubText = configData?.github?.text || "repository";

  return (
    <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="enterprise-surface-strong overflow-hidden page-backdrop">
        <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
          <span className="status-badge">Help center</span>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">
            Universal Digital Signage support hub
          </h1>
          <p className="mt-3 max-w-3xl text-base text-slate-600">
            Use this space to find implementation notes, repository guidance, and operational references for the signage platform.
          </p>
        </div>

        <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] sm:px-8">
          <div className="space-y-5">
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl font-semibold text-slate-950">What this platform does</h2>
              <p className="mt-3 text-slate-600">
                This is a centralized digital signage solution for web-capable players, kiosks, and screens. It is designed to keep playlists, media, and schedules coordinated across deployments.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="button-primary inline-flex items-center justify-center"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open {githubText}
                </a>
                <a
                  className="button-secondary inline-flex items-center justify-center"
                  href={`${githubUrl}wiki`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View wiki
                </a>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {supportCards.map((card) => (
                <div key={card.title} className="metric-card">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {card.title}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{card.description}</p>
                  <a
                    className="support-link mt-4"
                    href={`${githubUrl}${card.suffix}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open {card.title.toLowerCase()}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-[26px] border border-slate-200 bg-slate-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <span className="status-badge">Quick reference</span>
            <h2 className="text-2xl font-semibold text-slate-950">Operational notes</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                Manage users, hosts, groups, playlists, and schedules from the main console after signing in.
              </p>
              <p>
                For deployment or recovery workflows, use the documented backup and restore procedures from the repository guidance.
              </p>
              <p>
                If you need platform metadata or an integration reference, start with the repository, then move to the wiki and issues tracker.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Support link
              </div>
              <div className="mt-2 break-all text-sm font-medium text-slate-900">
                {githubUrl || "No repository URL configured"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
