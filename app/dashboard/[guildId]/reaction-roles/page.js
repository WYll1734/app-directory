"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReactionRolesListPage({ params }) {
  const { guildId } = params;

  const [panels, setPanels] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sm_reaction_panels") || "[]");
    const filtered = saved.filter((p) => p.guildId === guildId);
    setPanels(filtered);
  }, [guildId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Reaction Roles</h1>
          <p className="text-sm text-slate-400">
            Create panels with buttons that give/remove roles.
          </p>
        </div>

        <Link
          href={`/dashboard/${guildId}/reaction-roles/new`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New Panel
        </Link>
      </div>

      {/* Panels */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        {panels.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-10">
            <p>No reaction role panels yet.</p>
            <p className="mt-1">
              Click{" "}
              <span className="font-semibold text-slate-200">New Panel</span> to
              create one.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {panels.map((panel) => (
              <div
                key={panel.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-100">{panel.name}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Channel: <span className="text-slate-200">{panel.channel}</span> •
                    
                    {/* FIXED BUTTON COUNT */}
                    Buttons:{" "}
                    <span className="text-slate-200">
                      {panel.buttons?.length || 0}
                    </span>{" "}
                    •
                    Updated:{" "}
                    <span className="text-slate-200">{panel.lastUpdated}</span>
                  </p>
                </div>

                <div className="flex gap-2 mt-3 md:mt-0">
                  <Link
                    href={`/dashboard/${guildId}/reaction-roles/${panel.id}`}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      const saved = JSON.parse(localStorage.getItem("sm_reaction_panels") || "[]");
                      const updated = saved.filter((p) => p.id !== panel.id);
                      localStorage.setItem("sm_reaction_panels", JSON.stringify(updated));
                      setPanels(updated.filter((p) => p.guildId === guildId));
                    }}
                    className="rounded-lg border border-rose-700/70 bg-rose-700/10 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-700/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
