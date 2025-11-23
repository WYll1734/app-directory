"use client";

import AchievementsTabs from "@/components/achievements/AchievementsTabs";

export default function OverviewPage({ params }) {
  const { guildId } = params;

  return (
    <div>
      <AchievementsTabs guildId={guildId} />

      <h1 className="text-2xl font-bold mb-4">Achievement Overview</h1>

      <p className="text-slate-400 mb-6">
        View your server’s achievement progress, total unlocks, and upcoming goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-2">Total Earned</h2>
          <p className="text-slate-400">Track how many achievements members unlocked.</p>
        </div>

        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-2">Most Active Users</h2>
          <p className="text-slate-400">Coming soon…</p>
        </div>
      </div>
    </div>
  );
}
