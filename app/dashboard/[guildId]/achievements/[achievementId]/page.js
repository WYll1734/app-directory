// app/dashboard/[guildId]/achievements/page.js
"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronDown } from "lucide-react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

// ---------------------------------------------------------------------------
// ICONS – match EXACTLY what you have in /public
// ---------------------------------------------------------------------------
// If you later move them into /public/achievements, just change these paths.
const tierIcons = {
  bronze: "/Bronze.png",
  silver: "/Silver.png",
  gold: "/gold.png", // your screenshot shows lowercase "gold.png"
  diamond: "/Diamond.png",
};

// ---------------------------------------------------------------------------
// Fake data (no real DB yet)
// ---------------------------------------------------------------------------
// You can wire this up to your real DB later. For now it's just UI + mock data.
const ACHIEVEMENT_MAP = {
  "king-of-spam": {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send a large amount of messages in your server.",
    category: "Messages",
    tier: "gold",
    goal: 10000,
    progress: 7234,
    earned: false,
  },
  "first-message": {
    id: "first-message",
    name: "First Message",
    description: "Send your very first message in the server.",
    category: "Messages",
    tier: "bronze",
    goal: 1,
    progress: 1,
    earned: true,
  },
  "reaction-master": {
    id: "reaction-master",
    name: "Reaction Master",
    description: "React to messages across the server.",
    category: "Reactions",
    tier: "silver",
    goal: 500,
    progress: 120,
    earned: false,
  },
  "voice-chatter": {
    id: "voice-chatter",
    name: "Voice Chatter",
    description: "Spend time in voice channels.",
    category: "Voice",
    tier: "silver",
    goal: 600, // minutes
    progress: 340,
    earned: false,
  },
  "server-regular": {
    id: "server-regular",
    name: "Server Regular",
    description: "Be active for 30 days in a row.",
    category: "Activity",
    tier: "gold",
    goal: 30,
    progress: 19,
    earned: false,
  },
  "legendary-member": {
    id: "legendary-member",
    name: "Legendary Member",
    description: "Reach max level in the server.",
    category: "Levels",
    tier: "diamond",
    goal: 100,
    progress: 62,
    earned: false,
  },
};

// Optional: categories list if you want to pass to children later
const CATEGORIES = [
  { id: "all", label: "All Achievements" },
  { id: "messages", label: "Messages" },
  { id: "reactions", label: "Reactions" },
  { id: "voice", label: "Voice" },
  { id: "activity", label: "Activity" },
  { id: "levels", label: "Levels" },
];

export default function AchievementsPage({ params }) {
  const guildId = params?.guildId;

  const allAchievements = useMemo(
    () => Object.values(ACHIEVEMENT_MAP),
    []
  );

  const stats = useMemo(() => {
    const total = allAchievements.length;
    const earned = allAchievements.filter((a) => a.earned).length;

    const tierCounts = allAchievements.reduce(
      (acc, a) => {
        acc[a.tier] = (acc[a.tier] || 0) + 1;
        return acc;
      },
      { bronze: 0, silver: 0, gold: 0, diamond: 0 }
    );

    return { total, earned, tierCounts };
  }, [allAchievements]);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ------------------------------------------------------------------ */}
      {/* TOP BAR / BREADCRUMB                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={guildId ? `/dashboard/${guildId}` : "/dashboard"}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Overview</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white">Achievements</h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                BETA
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Track your community&apos;s milestones, levels and flex-worthy stats.
            </p>
          </div>
        </div>

        {/* Right side – could be guild selector / profile later */}
        <div className="flex items-center gap-3">
          {guildId && (
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-300">
              Guild ID: <span className="font-mono text-slate-100">{guildId}</span>
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HEADER CARD – USER / SERVER SUMMARY                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
        {/* Left: Profile + progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
                <Image
                  src="/default-avatar.png"
                  alt="User avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Your Achievement Progress
                </p>
                <p className="text-xs text-slate-400">
                  {stats.earned} / {stats.total} achievements unlocked
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              <p className="text-xs text-slate-400">Overall completion</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.round(
                        (stats.earned / Math.max(stats.total, 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  {Math.round((stats.earned / Math.max(stats.total, 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick stat pills */}
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <StatPill
              label="Total Achievements"
              value={stats.total}
              sub="Available"
            />
            <StatPill
              label="Unlocked"
              value={stats.earned}
              sub="Completed"
              accent="emerald"
            />
            <StatPill
              label="Gold & Diamond"
              value={stats.tierCounts.gold + stats.tierCounts.diamond}
              sub="High tier"
            />
            <StatPill
              label="Bronze & Silver"
              value={stats.tierCounts.bronze + stats.tierCounts.silver}
              sub="Starter"
            />
          </div>
        </div>

        {/* Right: Tier legend / info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">
              Achievement Tiers
            </p>
            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-900">
              <span>How it works</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Tiers represent how hard an achievement is to unlock. Use them to
            create progression paths for your members.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <TierRow
              icon={tierIcons.bronze}
              label="Bronze"
              desc="Very easy starter achievements – show people how the system works."
              count={stats.tierCounts.bronze}
            />
            <TierRow
              icon={tierIcons.silver}
              label="Silver"
              desc="Requires some activity – perfect mid-game goals."
              count={stats.tierCounts.silver}
            />
            <TierRow
              icon={tierIcons.gold}
              label="Gold"
              desc="Harder, grindy or high-skill achievements."
              count={stats.tierCounts.gold}
            />
            <TierRow
              icon={tierIcons.diamond}
              label="Diamond"
              desc="Ultra-rare, brag-worthy achievements for your most active members."
              count={stats.tierCounts.diamond}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT – TABS + GRID                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4">
        {/* If your AchievementsTabs component takes props, you can pass them here.
           For now we just render it, and it can handle its own state / fetching. */}
        <AchievementsTabs
          // Uncomment / adjust these if AchievementsTabs expects them:
          // achievements={allAchievements}
          // categories={CATEGORIES}
        />

        {/* If AchievementsTabs already renders the list, you don't need extra content here.
           If it only renders tab controls, you can add a grid below and feed in
           filtered achievements. Example (commented so it doesn't break anything):

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {allAchievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
        */}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SMALL SUBCOMPONENTS
// ---------------------------------------------------------------------------

function StatPill({ label, value, sub, accent = "slate" }) {
  const accentClasses =
    accent === "emerald"
      ? "text-emerald-400 bg-emerald-500/10"
      : "text-slate-200 bg-slate-700/20";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <span className={`text-lg font-semibold ${accentClasses} px-2 py-0.5 rounded-lg`}>
          {value}
        </span>
        {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}

function TierRow({ icon, label, desc, count }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
      <div className="relative mt-0.5 h-7 w-7 overflow-hidden rounded-lg bg-slate-900">
        <Image
          src={icon}
          alt={`${label} tier icon`}
          fill
          className="object-contain p-1"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-white">{label}</p>
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
            {count} total
          </span>
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

// Optional card if you want to manually render achievement grid later
export function AchievementCard({ achievement }) {
  const pct = Math.min(
    100,
    Math.round((achievement.progress / Math.max(achievement.goal, 1)) * 100)
  );

  const tierColor =
    achievement.tier === "bronze"
      ? "bg-amber-700/30 text-amber-300 border-amber-700/60"
      : achievement.tier === "silver"
      ? "bg-slate-500/30 text-slate-100 border-slate-400/60"
      : achievement.tier === "gold"
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/70"
      : "bg-cyan-500/20 text-cyan-200 border-cyan-400/70";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">
            {achievement.name}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {achievement.description}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${tierColor}`}
        >
          {achievement.tier.toUpperCase()}
        </span>
      </div>

      <div className="mt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {achievement.progress} / {achievement.goal}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full ${
              achievement.earned ? "bg-emerald-500" : "bg-sky-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {achievement.earned && (
        <div className="mt-1 inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
          <span>✅ Unlocked</span>
          <span className="text-slate-400">•</span>
          <span>Keep going for higher tiers</span>
        </div>
      )}
    </div>
  );
}
