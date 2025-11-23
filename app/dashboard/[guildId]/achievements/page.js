"use client";

import Image from "next/image";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";
import { ACHIEVEMENTS } from "./_data/achievements";

export default function AchievementsOverviewPage({ params }) {
  const { guildId } = params;

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
      <section className="space-y-4" aria-label="Achievements list">
        <h2 className="text-sm font-semibold text-slate-300">Achievements</h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ACHIEVEMENTS.map((ach) => (
            <a
              key={ach.id}
              href={`/dashboard/${guildId}/achievements/${ach.id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm hover:border-indigo-500/70 hover:bg-slate-950 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900/80">
                  <Image
                    src="/Bronze.png"
                    alt="Achievement icon"
                    width={40}
                    height={40}
                  />
                </div>

                <div className="ml-auto inline-flex h-6 w-11 items-center rounded-full bg-indigo-500/20 px-1 text-[10px] text-indigo-200">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-400 text-[9px] text-slate-950">
                    ON
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <h3 className="text-sm font-semibold text-white">{ach.name}</h3>
                <p className="text-xs text-slate-400">{ach.description}</p>

                <div className="mt-2 space-y-0.5 text-[11px] text-slate-300">
                  {ach.tiers.map((t) => (
                    <p key={t.id}>
                      <span className="font-semibold capitalize">{t.label}</span>{" "}
                      {t.count}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-1 text-[11px] text-slate-500">Server progress</p>
                <div className="h-1.5 w-full rounded-full bg-slate-800">
                  <div className="h-full w-[3%] rounded-full bg-indigo-500" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
