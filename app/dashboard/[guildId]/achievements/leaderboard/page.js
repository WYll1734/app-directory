"use client";

import AchievementsTabs from "@/components/achievements/AchievementsTabs";

export default function LeaderboardPage({ params }) {
  const { guildId } = params;

  return (
    <div>
      <AchievementsTabs guildId={guildId} />

      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>

      <p className="text-slate-400 mb-6">
        Track top achievers, XP leaders, and competitive rankings.
      </p>

      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
        <h2 className="text-xl font-semibold mb-2">Coming soon…</h2>
      </div>
    </div>
  );
}
