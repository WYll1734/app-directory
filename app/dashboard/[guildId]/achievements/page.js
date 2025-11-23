"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

const mockAchievements = [
  {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send messages",
    tiers: { bronze: 20, silver: 100, gold: 500, diamond: 1000 },
    enabled: true,
  },
  {
    id: "reaction-master",
    name: "Reaction Master",
    description: "Add reactions to messages",
    tiers: { bronze: 50, silver: 250, gold: 1000, diamond: 2000 },
    enabled: true,
  },
  {
    id: "stay-awhile",
    name: "Stay Awhile and Listen",
    description: "Spend minutes in voice channels",
    tiers: { bronze: "10 min", silver: "60 min", gold: "300 min", diamond: "600 min" },
    enabled: true,
  },
  {
    id: "thread-creator",
    name: "Thread Creator",
    description: "Create threads",
    tiers: { bronze: 5, silver: 25, gold: 100, diamond: 200 },
    enabled: true,
  },
];

function ProgressBar({ value = 0 }) {
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function AchievementsOverviewPage({ params }) {
  const { guildId } = params;
  const [achievements, setAchievements] = useState(mockAchievements);
  const [search, setSearch] = useState("");

  const toggleAchievement = (id) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      )
    );
  };

  const filtered = achievements.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold text-white">Achievements</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Beta
            </span>
          </div>
          <p className="text-slate-400 mt-1">
            Let your members hunt achievements for rewards.
          </p>
        </div>

        {/* Active toggle like top-right “Active ON” */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Active
          </span>
          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <AchievementsTabs guildId={guildId} activeTab="achievements" />

      {/* Top type cards & search */}
      <div className="flex flex-wrap gap-6 items-start">
        <div className="flex flex-wrap gap-4">
          {/* Single achievement card */}
          <button className="w-64 h-40 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900/80 transition flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-slate-800" />
            <div className="text-sm font-semibold text-slate-100">
              Single achievement
            </div>
            <div className="text-xs text-slate-400">
              A one-time achievement with no tiers
            </div>
          </button>

          {/* Tiered achievement card */}
          <button className="w-64 h-40 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900/80 transition flex flex-col items-center justify-center gap-3">
            <div className="flex gap-1">
              <div className="w-16 h-16 rounded-lg bg-slate-700" />
              <div className="w-16 h-16 rounded-lg bg-slate-600" />
              <div className="w-16 h-16 rounded-lg bg-slate-500" />
            </div>
            <div className="text-sm font-semibold text-slate-100">
              Tiered achievement
            </div>
            <div className="text-xs text-slate-400 text-center max-w-[210px]">
              Includes tiers that members unlock when they make progress
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="ml-auto flex-1 min-w-[260px] max-w-md">
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2">
            <Search size={16} className="text-slate-500" />
            <input
              className="bg-transparent outline-none text-sm text-slate-100 flex-1 placeholder:text-slate-500"
              placeholder="Search for an achievement"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Achievements grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">
          Achievements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className="relative rounded-xl bg-slate-900/70 border border-slate-800 p-4 flex flex-col gap-3 hover:bg-slate-900/90 transition"
            >
              {/* Toggle */}
              <div className="absolute top-3 right-3">
                <label className="relative inline-flex cursor-pointer items-center shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={ach.enabled}
                    onChange={() => toggleAchievement(ach.id)}
                  />
                  <div className="peer h-5 w-9 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white peer-checked:translate-x-4 transition-all shadow"></div>
                </label>
              </div>

              {/* Click area → editor */}
              <Link
                href={`/dashboard/${guildId}/achievements/${ach.id}`}
                className="flex flex-col gap-3 h-full"
              >
                {/* Icon placeholder */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-400 via-sky-400 to-cyan-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {ach.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {ach.description}
                    </span>
                  </div>
                </div>

                {/* Tiers */}
                <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <span className="text-slate-300">Bronze</span>{" "}
                    <span className="ml-2">{ach.tiers.bronze}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Silver</span>{" "}
                    <span className="ml-2">{ach.tiers.silver}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Gold</span>{" "}
                    <span className="ml-2">{ach.tiers.gold}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Diamond</span>{" "}
                    <span className="ml-2">{ach.tiers.diamond}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-auto pt-2 text-[11px] text-slate-500">
                  <div className="flex justify-between mb-1">
                    <span>Server progress</span>
                    <span>0%</span>
                  </div>
                  <ProgressBar value={0} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
