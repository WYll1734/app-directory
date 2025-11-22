"use client";

import Link from "next/link";

const tabs = [
  { id: "automod", label: "AutoMod" },
  { id: "admin", label: "Admin" },
  { id: "audit-logging", label: "Audit logging" },
  { id: "commands", label: "Commands" },
];

export default function ModerationTabs({ guildId, activeTab }) {
  return (
    <div className="mb-6 border-b border-slate-800">
      <nav className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const href =
            tab.id === "automod"
              ? `/dashboard/${guildId}/moderation`
              : `/dashboard/${guildId}/moderation/${tab.id}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-2 text-sm rounded-t-lg border-b-2 -mb-px transition 
                ${
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
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
