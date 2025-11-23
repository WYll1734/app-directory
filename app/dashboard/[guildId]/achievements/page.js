"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

// Where the icons live in /public
const tierIcons = {
  bronze: "/achievements/bronze.png",
  silver: "/achievements/silver.png",
  gold: "/achievements/gold.png",
  diamond: "/achievements/diamond.png",
};

const ACHIEVEMENTS = [
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

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center shrink-0">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="peer h-5 w-9 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all" />
      <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white peer-checked:translate-x-4 transition-all shadow" />
    </label>
  );
}

function SaveButton({ state, onClick }) {
  const isSaving = state === "saving";
  const isSaved = state === "saved";

  return (
    <button
      onClick={onClick}
      disabled={isSaving}
      className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition
        ${
          isSaved
            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
        }`}
    >
      {isSaving && (
        <span className="h-3 w-3 rounded-full border border-white/40 border-t-transparent animate-spin" />
      )}
      {isSaving ? "Saving…" : isSaved ? "Saved ✓" : "Save Settings"}
    </button>
  );
}

export default function AchievementsOverviewPage({ params }) {
  const { guildId } = params;

  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [search, setSearch] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  const filtered = achievements.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEnabled = (id) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      )
    );
  };

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      // here later you call your API/DB
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    }, 800);
  };

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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Active
            </span>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <SaveButton state={saveState} onClick={handleSave} />
        </div>
      </div>

      {/* Tabs */}
      <AchievementsTabs guildId={guildId} activeTab="achievements" />

      {/* Top cards + search */}
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex flex-wrap gap-4">
          {/* Single achievement card */}
          <button className="w-64 h-40 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900/80 transition flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-slate-800" />
            <div className="text-sm font-semibold text-slate-100">
              Single achievement
            </div>
            <div className="text-xs text-slate-400 text-center">
              A one-time achievement with no tiers
            </div>
          </button>

          {/* Tiered achievement card */}
          <button className="w-64 h-40 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900/80 transition flex flex-col items-center justify-center gap-3">
            <div className="flex gap-1">
              <div className="w-12 h-12 rounded-lg bg-slate-700" />
              <div className="w-12 h-12 rounded-lg bg-slate-600" />
              <div className="w-12 h-12 rounded-lg bg-slate-500" />
            </div>
            <div className="text-sm font-semibold text-slate-100">
              Tiered achievement
            </div>
            <div className="text-xs text-slate-400 text-center max-w-[220px]">
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
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-200">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className="relative rounded-xl bg-slate-900/70 border border-slate-800 p-4 flex flex-col gap-4 hover:bg-slate-900/90 transition-transform duration-200 hover:-translate-y-0.5"
            >
              {/* Toggle */}
              <div className="absolute top-3 right-3">
                <Toggle
                  checked={ach.enabled}
                  onChange={() => toggleEnabled(ach.id)}
                />
              </div>

              {/* Header */}
              <Link
                href={`/dashboard/${guildId}/achievements/${ach.id}`}
                className="flex flex-col gap-3 h-full"
              >
                <div className="flex items-center gap-3">
                  {/* Big icon */}
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-800">
                    <Image
                      src={tierIcons.bronze}
                      alt="Achievement Icon"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {ach.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {ach.description}
                    </span>
                  </div>
                </div>

                {/* Tiers with icons */}
                <div className="mt-1 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={tierIcons.bronze}
                      width={16}
                      height={16}
                      alt="Bronze"
                      className="rounded"
                    />
                    <span className="text-slate-300">Bronze</span>
                    <span className="ml-1">{ach.tiers.bronze}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={tierIcons.silver}
                      width={16}
                      height={16}
                      alt="Silver"
                      className="rounded"
                    />
                    <span className="text-slate-300">Silver</span>
                    <span className="ml-1">{ach.tiers.silver}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={tierIcons.gold}
                      width={16}
                      height={16}
                      alt="Gold"
                      className="rounded"
                    />
                    <span className="text-slate-300">Gold</span>
                    <span className="ml-1">{ach.tiers.gold}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={tierIcons.diamond}
                      width={16}
                      height={16}
                      alt="Diamond"
                      className="rounded"
                    />
                    <span className="text-slate-300">Diamond</span>
                    <span className="ml-1">{ach.tiers.diamond}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-auto pt-2 text-[11px] text-slate-500">
                  <div className="flex justify-between mb-1">
                    <span>Server progress</span>
                    <span>0%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 w-0" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
