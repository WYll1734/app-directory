"use client";

import Link from "next/link";

const tabs = [
  { id: "achievements", label: "Achievements" },
  { id: "configuration", label: "Configuration" },
  { id: "commands", label: "Commands" },
];

export default function AchievementsTabs({ guildId, activeTab }) {
  return (
    <div className="mb-6 border-b border-slate-800/70">
      <nav className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          const href =
            tab.id === "achievements"
              ? `/dashboard/${guildId}/achievements`
              : `/dashboard/${guildId}/achievements/${tab.id}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg border-b-2 -mb-px transition-all
                ${
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
