"use client";

import Link from "next/link";
import { ShieldCheck, UserCog, LogOut, ListChecks } from "lucide-react";

const tabs = [
  { id: "automod", label: "AutoMod", icon: ShieldCheck },
  { id: "admin", label: "Admin", icon: UserCog },
  { id: "audit-logging", label: "Audit Logging", icon: LogOut },
  { id: "comand", label: "Commands", icon: ListChecks }, // FIXED
];

export default function ModerationTabs({ guildId, activeTab }) {
  return (
    <div className="mb-6 border-b border-slate-800/70">
      <nav className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          const href =
            tab.id === "automod"
              ? `/dashboard/${guildId}/moderation`
              : `/dashboard/${guildId}/moderation/${tab.id}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg border-b-2 -mb-px transition-all
                ${
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }
              `}
            >
              <Icon size={15} className={isActive ? "text-indigo-400" : "text-slate-500"} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
