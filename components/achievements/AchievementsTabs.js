"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "levels", label: "Levels" },
  { id: "badges", label: "Badges" },
  { id: "leaderboard", label: "Leaderboard" },
];

export default function AchievementsTabs({ guildId }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-3 border-b border-slate-800 mb-6">
      {tabs.map((tab) => {
        const active = pathname.includes(`/achievements/${tab.id}`);

        return (
          <Link
            key={tab.id}
            href={`/dashboard/${guildId}/achievements/${tab.id}`}
            className={`px-4 py-2 rounded-t-md font-medium transition
              ${
                active
                  ? "bg-slate-800 text-white border-b-2 border-emerald-500"
                  : "text-slate-400 hover:text-white"
              }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
