"use client";

import AchievementsTabs from "@/components/achievements/AchievementsTabs";

export default function LevelsPage({ params }) {
  const { guildId } = params;

  return (
    <div>
      <AchievementsTabs guildId={guildId} />

      <h1 className="text-2xl font-bold mb-4">Levels</h1>

      <p className="text-slate-400 mb-6">
        Configure XP, level rewards, and progression scaling for your server.
      </p>

      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
        <h2 className="text-xl font-semibold mb-2">Level System Settings</h2>
        <p className="text-slate-400">Coming soon…</p>
      </div>
    </div>
  );
}
