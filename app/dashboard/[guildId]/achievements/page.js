"use client";

import { useState } from "react";
import Image from "next/image";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

// =============================
// SHARED ACHIEVEMENTS DATA
// =============================
const ACHIEVEMENTS = [
  {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send messages",
    bronze: 20,
    silver: 100,
    gold: 500,
    diamond: 1000,
  },
  {
    id: "reaction-master",
    name: "Reaction Master",
    description: "Add reactions to messages",
    bronze: 50,
    silver: 250,
    gold: 1000,
    diamond: 2000,
  },
  {
    id: "stay-awhile",
    name: "Stay Awhile and Listen",
    description: "Spend minutes in voice channels",
    bronze: 10,
    silver: 60,
    gold: 300,
    diamond: 600,
  },
  {
    id: "thread-creator",
    name: "Thread Creator",
    description: "Create threads",
    bronze: 5,
    silver: 25,
    gold: 100,
    diamond: 200,
  },
];

export default function AchievementsOverviewPage({ params }) {
  const { guildId } = params;

  // ================
  // ON / OFF STATE
  // ================
  const [enabledState, setEnabledState] = useState(() => {
    const init = {};
    ACHIEVEMENTS.forEach((a) => (init[a.id] = true));
    return init;
  });

  function toggle(achievementId) {
    setEnabledState((prev) => ({
      ...prev,
      [achievementId]: !prev[achievementId],
    }));

    // 🔧 Stub for backend later:
    console.log(
      `Toggled ${achievementId} =>`,
      !enabledState[achievementId] ? "ON" : "OFF"
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-white">Achievements</h1>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">
            Beta
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Let your members hunt achievements for rewards.
        </p>
      </div>

      {/* Tabs */}
      <AchievementsTabs guildId={guildId} activeTab="achievements" />

      {/* Cards */}
      <section aria-label="Achievements list" className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Achievements</h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ACHIEVEMENTS.map((ach) => {
            const isOn = enabledState[ach.id];

            return (
              <div
                key={ach.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm hover:border-indigo-500/70 hover:bg-slate-950 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900/80">
                    <Image
                      src="/Bronze.png"
                      alt="Achievement icon"
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  </div>

                  {/* ON / OFF BUTTON */}
                  <button
                    onClick={() => toggle(ach.id)}
                    type="button"
                    className={`ml-auto inline-flex h-6 w-11 items-center rounded-full px-1 text-[10px] transition ${
                      isOn
                        ? "bg-indigo-500/20 text-indigo-200"
                        : "bg-slate-700/40 text-slate-400"
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] shadow transition ${
                        isOn
                          ? "bg-indigo-400 text-slate-900 translate-x-5"
                          : "bg-slate-500 text-white translate-x-0"
                      }`}
                    >
                      {isOn ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>

                <a
                  href={`/dashboard/${guildId}/achievements/${ach.id}`}
                  className="mt-3 space-y-1.5 block"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {ach.name}
                  </h3>
                  <p className="text-xs text-slate-400">{ach.description}</p>

                  <div className="mt-2 space-y-0.5 text-[11px] text-slate-300">
                    <p>
                      <span className="font-semibold text-amber-300">Bronze</span>{" "}
                      {ach.bronze}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-200">Silver</span>{" "}
                      {ach.silver}
                    </p>
                    <p>
                      <span className="font-semibold text-yellow-300">Gold</span>{" "}
                      {ach.gold}
                    </p>
                    <p>
                      <span className="font-semibold text-cyan-300">
                        Diamond
                      </span>{" "}
                      {ach.diamond}
                    </p>
                  </div>
                </a>

                <div className="mt-3">
                  <p className="mb-1 text-[11px] text-slate-500">
                    Server progress
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-slate-800">
                    <div className="h-full w-[3%] rounded-full bg-indigo-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
