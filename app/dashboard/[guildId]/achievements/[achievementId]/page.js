// app/dashboard/[guildId]/achievements/page.js
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Filter,
  Star,
  Trophy,
  X,
} from "lucide-react";

/**
 * ---------------------------------------------------------------------------
 *  BASIC CONFIG
 * ---------------------------------------------------------------------------
 */

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "messages", label: "Messages" },
  { id: "reactions", label: "Reactions" },
  { id: "voice", label: "Voice" },
  { id: "activity", label: "Activity" },
  { id: "levels", label: "Levels" },
  { id: "staff", label: "Staff / Mod" },
];

const FILTER_MODES = [
  { id: "all", label: "All" },
  { id: "earned", label: "Unlocked" },
  { id: "locked", label: "Locked" },
];

const SORT_MODES = [
  { id: "recommended", label: "Recommended" },
  { id: "progress", label: "Progress" },
  { id: "tier", label: "Tier" },
  { id: "rarity", label: "Rarest" },
  { id: "name", label: "Name A→Z" },
];

/**
 * ---------------------------------------------------------------------------
 *  MOCK DATA (replace with DB later)
 * ---------------------------------------------------------------------------
 */

const MOCK_ACHIEVEMENTS = [
  {
    id: "first-message",
    name: "First Message",
    description: "Send your very first message in the server.",
    category: "messages",
    tier: "bronze",
    goal: 1,
    progress: 1,
    earned: true,
    rarity: 0.75,
  },
  {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send 10,000 messages across all channels.",
    category: "messages",
    tier: "gold",
    goal: 10000,
    progress: 7234,
    earned: false,
    rarity: 0.05,
  },
  {
    id: "reaction-enjoyer",
    name: "Reaction Enjoyer",
    description: "React to 100 messages.",
    category: "reactions",
    tier: "silver",
    goal: 100,
    progress: 86,
    earned: false,
    rarity: 0.3,
  },
  {
    id: "reaction-master",
    name: "Reaction Master",
    description: "React to 500 messages in total.",
    category: "reactions",
    tier: "gold",
    goal: 500,
    progress: 120,
    earned: false,
    rarity: 0.12,
  },
  {
    id: "voice-chatter",
    name: "Voice Chatter",
    description: "Spend 600 minutes in voice channels.",
    category: "voice",
    tier: "silver",
    goal: 600,
    progress: 340,
    earned: false,
    rarity: 0.18,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Be in voice between 1am and 4am for 5 days.",
    category: "voice",
    tier: "gold",
    goal: 5,
    progress: 2,
    earned: false,
    rarity: 0.04,
  },
  {
    id: "server-regular",
    name: "Server Regular",
    description: "Be active for 30 days in a row.",
    category: "activity",
    tier: "gold",
    goal: 30,
    progress: 19,
    earned: false,
    rarity: 0.1,
  },
  {
    id: "year-one",
    name: "Year One",
    description: "Stay in the server for a full year.",
    category: "activity",
    tier: "diamond",
    goal: 365,
    progress: 280,
    earned: false,
    rarity: 0.02,
  },
  {
    id: "level-10",
    name: "Level 10",
    description: "Reach level 10 in the leveling system.",
    category: "levels",
    tier: "silver",
    goal: 10,
    progress: 10,
    earned: true,
    rarity: 0.45,
  },
  {
    id: "level-50",
    name: "Level 50",
    description: "Reach level 50 and flex on everyone.",
    category: "levels",
    tier: "gold",
    goal: 50,
    progress: 32,
    earned: false,
    rarity: 0.06,
  },
  {
    id: "level-100",
    name: "Level 100",
    description: "Reach the maximum level in the server.",
    category: "levels",
    tier: "diamond",
    goal: 100,
    progress: 62,
    earned: false,
    rarity: 0.02,
  },
  {
    id: "mod-helper",
    name: "Helper",
    description: "Reply to 50 messages in help channels.",
    category: "staff",
    tier: "silver",
    goal: 50,
    progress: 18,
    earned: false,
    rarity: 0.16,
  },
  {
    id: "mod-hammer",
    name: "Ban Hammer",
    description: "Issue 25 successful moderations (warn / mute / ban).",
    category: "staff",
    tier: "gold",
    goal: 25,
    progress: 9,
    earned: false,
    rarity: 0.03,
  },
];

/**
 * ---------------------------------------------------------------------------
 *  MAIN PAGE – "Old school" thick UI
 * ---------------------------------------------------------------------------
 */

export default function AchievementsPage({ params }) {
  const guildId = params?.guildId;

  // Tabs / filters
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterMode, setFilterMode] = useState("all"); // all / earned / locked
  const [sortMode, setSortMode] = useState("recommended");

  // Toggles
  const [showProgress, setShowProgress] = useState(true);
  const [showRarity, setShowRarity] = useState(true);
  const [showTierBadges, setShowTierBadges] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Search + "advanced" toggle
  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const achievements = useMemo(() => MOCK_ACHIEVEMENTS, []);

  // Overall stats
  const stats = useMemo(() => {
    const total = achievements.length;
    const earned = achievements.filter((a) => a.earned).length;
    const locked = total - earned;

    const tierCounts = achievements.reduce(
      (acc, a) => {
        acc[a.tier] = (acc[a.tier] || 0) + 1;
        return acc;
      },
      { bronze: 0, silver: 0, gold: 0, diamond: 0 }
    );

    const completion = Math.round((earned / Math.max(total, 1)) * 100);

    return {
      total,
      earned,
      locked,
      completion,
      tierCounts,
    };
  }, [achievements]);

  // Filter + sort list
  const visibleAchievements = useMemo(() => {
    let list = [...achievements];

    // Category
    if (activeCategory !== "all") {
      list = list.filter((a) => a.category === activeCategory);
    }

    // Filter mode
    if (filterMode === "earned") {
      list = list.filter((a) => a.earned);
    } else if (filterMode === "locked") {
      list = list.filter((a) => !a.earned);
    }

    // Search
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      switch (sortMode) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress": {
          const aPct = a.progress / Math.max(a.goal, 1);
          const bPct = b.progress / Math.max(b.goal, 1);
          return bPct - aPct;
        }
        case "tier":
          return tierRank(b.tier) - tierRank(a.tier);
        case "rarity":
          return a.rarity - b.rarity; // rarer first
        case "recommended":
        default: {
          const aScore =
            (a.earned ? 40 : 0) +
            tierRank(a.tier) * 10 +
            (a.progress / Math.max(a.goal, 1)) * 20 -
            a.rarity * 15;
          const bScore =
            (b.earned ? 40 : 0) +
            tierRank(b.tier) * 10 +
            (b.progress / Math.max(b.goal, 1)) * 20 -
            b.rarity * 15;
          return bScore - aScore;
        }
      }
    });

    return list;
  }, [achievements, activeCategory, filterMode, search, sortMode]);

  /**
   * -------------------------------------------------------------------------
   *  RENDER
   * -------------------------------------------------------------------------
   */

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ------------------------------------------------------------------ */}
      {/* TOP BAR / BREADCRUMB                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
              <h1 className="text-xl font-semibold text-white">
                Achievements
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                BETA
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Create flex-worthy milestones for your members. Unlock, grind,
              and show off.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {guildId && (
            <span className="hidden rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-300 sm:inline-flex">
              Guild ID:
              <span className="ml-1 font-mono text-slate-100">{guildId}</span>
            </span>
          )}

          <button className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/15">
            <Filter className="h-3.5 w-3.5" />
            <span>Auto-balance rewards (soon)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HEADER STATS + USER CARD                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2.3fr),minmax(0,1.7fr)]">
        {/* Left: User overview + progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
                <Image
                  src="/default-avatar.png"
                  alt="User avatar"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Your Achievement Progress
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {stats.earned} / {stats.total} unlocked •{" "}
                  <span className="text-emerald-400">{stats.completion}%</span>{" "}
                  complete
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              <p className="text-xs text-slate-400">Overall completion</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${stats.completion}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  {stats.completion}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <StatCard
              label="Total"
              value={stats.total}
              sub="Achievements"
              accent="default"
            />
            <StatCard
              label="Unlocked"
              value={stats.earned}
              sub="Completed"
              accent="emerald"
            />
            <StatCard
              label="Locked"
              value={stats.locked}
              sub="To unlock"
              accent="warning"
            />
            <StatCard
              label="High tier"
              value={stats.tierCounts.gold + stats.tierCounts.diamond}
              sub="Gold + Diamond"
              accent="tier"
            />
          </div>

          {/* Little hint box */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-400">
            <p>
              Tip: Use the{" "}
              <span className="font-semibold text-emerald-400">
                filters below
              </span>{" "}
              to focus on locked achievements or a specific category like
              Messages, Voice or Staff.
            </p>
          </div>
        </div>

        {/* Right: Tier breakdown - more old-style, chunky rows */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">
                Tier breakdown
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Each tier represents how grindy or rare the achievement is.
              </p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-900">
              <Trophy className="h-3.5 w-3.5" />
              <span>View examples</span>
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <TierRow
              tier="bronze"
              label="Bronze"
              count={stats.tierCounts.bronze}
              description="Very easy starter achievements. Good for onboarding."
            />
            <TierRow
              tier="silver"
              label="Silver"
              count={stats.tierCounts.silver}
              description="Takes a bit of effort. People hit these often."
            />
            <TierRow
              tier="gold"
              label="Gold"
              count={stats.tierCounts.gold}
              description="Harder, longer-term grinds or high-skill stuff."
            />
            <TierRow
              tier="diamond"
              label="Diamond"
              count={stats.tierCounts.diamond}
              description="Ultra-rare flex rewards for your top 1% grinders."
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CATEGORY TABS ROW (big pills)                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const active = tab.id === activeCategory;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                    active
                      ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900",
                  ].join(" ")}
                >
                  <span>{tab.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown very “old style” */}
          <SortChip
            sortMode={sortMode}
            setSortMode={setSortMode}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FILTERS STRIP: Filter mode pills + toggles + search                */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-4">
        {/* Filter mode row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Filter mode pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_MODES.map((f) => {
              const active = f.id === filterMode;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                    active
                      ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900",
                  ].join(" ")}
                >
                  {f.id === "earned" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                  {f.id === "locked" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  )}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: search box */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search achievements…"
                className="w-32 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none sm:w-48"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-full p-0.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Advanced</span>
              <ChevronDown
                className={`h-3 w-3 transition ${showAdvanced ? "rotate-180" : "rotate-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Advanced toggles row – just like the old “too much stuff” layout */}
        {showAdvanced && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <ToggleRow
              label="Show progress bars"
              description="Display % towards each goal."
              enabled={showProgress}
              onChange={setShowProgress}
            />
            <ToggleRow
              label="Show rarity info"
              description="Common, Rare, Ultra Rare, etc."
              enabled={showRarity}
              onChange={setShowRarity}
            />
            <ToggleRow
              label="Show tier badges"
              description="Bronze / Silver / Gold / Diamond chips."
              enabled={showTierBadges}
              onChange={setShowTierBadges}
            />
            <ToggleRow
              label="Compact card mode"
              description="Smaller cards, less padding."
              enabled={compactMode}
              onChange={setCompactMode}
            />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN GRID – Achievements list                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-4">
        {/* Little header row (count + info) */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-200">
                {visibleAchievements.length}
              </span>{" "}
              / {achievements.length} achievements
            </span>
            {activeCategory !== "all" && (
              <>
                <span className="text-slate-700">•</span>
                <span>Category: {labelForCategory(activeCategory)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
              Filters:{" "}
              {[
                filterMode !== "all" ? filterMode : null,
                search ? "search" : null,
                showAdvanced ? "advanced" : null,
              ]
                .filter(Boolean)
                .join(", ") || "none"}
            </span>
          </div>
        </div>

        {visibleAchievements.length === 0 ? (
          <EmptyState
            onReset={() => {
              setFilterMode("all");
              setSearch("");
              setShowAdvanced(false);
              setShowProgress(true);
              setShowRarity(true);
              setShowTierBadges(true);
              setCompactMode(false);
            }}
          />
        ) : (
          <div
            className={[
              "grid gap-3",
              compactMode ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-2",
            ].join(" ")}
          >
            {visibleAchievements.map((a) => (
              <AchievementCard
                key={a.id}
                achievement={a}
                showProgress={showProgress}
                showRarity={showRarity}
                showTierBadges={showTierBadges}
                compact={compactMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 *  HELPER FUNCTIONS
 * ---------------------------------------------------------------------------
 */

function tierRank(tier) {
  switch (tier) {
    case "bronze":
      return 1;
    case "silver":
      return 2;
    case "gold":
      return 3;
    case "diamond":
      return 4;
    default:
      return 0;
  }
}

function labelForCategory(id) {
  const found = CATEGORY_TABS.find((t) => t.id === id);
  return found?.label ?? "All";
}

/**
 * ---------------------------------------------------------------------------
 *  SMALL / SUB COMPONENTS
 * ---------------------------------------------------------------------------
 */

function StatCard({ label, value, sub, accent = "default" }) {
  let accentClasses = "border-slate-800 bg-slate-950 text-slate-200";
  if (accent === "emerald") {
    accentClasses =
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  } else if (accent === "warning") {
    accentClasses = "border-yellow-500/40 bg-yellow-500/10 text-yellow-200";
  } else if (accent === "tier") {
    accentClasses = "border-sky-500/40 bg-sky-500/10 text-sky-200";
  }

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border px-3 py-2.5 text-xs ${accentClasses}`}
    >
      <span className="text-[11px] text-slate-400">{label}</span>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-lg font-semibold">{value}</span>
        {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}

function TierRow({ tier, label, count, description }) {
  let pillClasses = "";
  if (tier === "bronze") {
    pillClasses =
      "border-amber-500/60 bg-amber-500/10 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.25)]";
  } else if (tier === "silver") {
    pillClasses =
      "border-slate-400/70 bg-slate-600/20 text-slate-100 shadow-[0_0_10px_rgba(148,163,184,0.25)]";
  } else if (tier === "gold") {
    pillClasses =
      "border-yellow-400/80 bg-yellow-500/15 text-yellow-100 shadow-[0_0_12px_rgba(250,204,21,0.4)]";
  } else if (tier === "diamond") {
    pillClasses =
      "border-cyan-400/80 bg-cyan-500/15 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.45)]";
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/95 p-2.5">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pillClasses}`}
        >
          <Star className="h-3 w-3" />
          {label.toUpperCase()}
        </span>
        <span className="text-[11px] text-slate-400">
          {description}
        </span>
      </div>
      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
        {count} total
      </span>
    </div>
  );
}

function SortChip({ sortMode, setSortMode }) {
  const [open, setOpen] = useState(false);

  const active = SORT_MODES.find((s) => s.id === sortMode);

  return (
    <div className="relative text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900"
      >
        <span className="text-slate-500">Sort:</span>
        <span className="font-medium text-slate-100">
          {active?.label ?? "Recommended"}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-slate-800 bg-slate-950/95 p-1 text-xs text-slate-200 shadow-xl backdrop-blur">
          {SORT_MODES.map((mode) => {
            const isActive = mode.id === sortMode;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSortMode(mode.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "hover:bg-slate-900"
                }`}
              >
                <span>{mode.label}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] text-slate-300 hover:bg-slate-900"
    >
      <div className="flex-1">
        <p className="font-medium text-slate-100">{label}</p>
        {description && (
          <p className="mt-0.5 text-[10px] text-slate-500">
            {description}
          </p>
        )}
      </div>
      <Switch enabled={enabled} />
    </button>
  );
}

function Switch({ enabled }) {
  return (
    <span
      className={[
        "relative inline-flex h-4.5 w-8 items-center rounded-full border transition",
        enabled
          ? "border-emerald-500 bg-emerald-500/30"
          : "border-slate-600 bg-slate-800",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-3 w-3 rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-[18px]" : "translate-x-[2px]",
        ].join(" ")}
      />
    </span>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/80 px-4 py-10 text-center">
      <p className="text-sm font-medium text-slate-200">
        No achievements match your filters.
      </p>
      <p className="text-xs text-slate-400">
        Try switching category, removing filters, or showing all achievements.
      </p>
      <button
        onClick={onReset}
        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
      >
        <X className="h-3 w-3" />
        <span>Reset filters</span>
      </button>
    </div>
  );
}

function AchievementCard({
  achievement,
  showProgress,
  showRarity,
  showTierBadges,
  compact,
}) {
  const pct = Math.min(
    100,
    Math.round((achievement.progress / Math.max(achievement.goal, 1)) * 100)
  );

  // Tier badge style
  let tierClasses = "";
  if (achievement.tier === "bronze") {
    tierClasses =
      "border-amber-500/60 bg-amber-500/10 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.35)]";
  } else if (achievement.tier === "silver") {
    tierClasses =
      "border-slate-400/70 bg-slate-600/25 text-slate-50 shadow-[0_0_10px_rgba(148,163,184,0.35)]";
  } else if (achievement.tier === "gold") {
    tierClasses =
      "border-yellow-400/80 bg-yellow-500/15 text-yellow-100 shadow-[0_0_12px_rgba(250,204,21,0.5)]";
  } else if (achievement.tier === "diamond") {
    tierClasses =
      "border-cyan-400/80 bg-cyan-500/15 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.55)]";
  } else {
    tierClasses =
      "border-slate-700 bg-slate-900 text-slate-100 shadow-[0_0_8px_rgba(15,23,42,0.7)]";
  }

  // Rarity label
  let rarityLabel = "Common";
  if (achievement.rarity <= 0.02) {
    rarityLabel = "Mythic";
  } else if (achievement.rarity <= 0.05) {
    rarityLabel = "Ultra Rare";
  } else if (achievement.rarity <= 0.15) {
    rarityLabel = "Rare";
  } else if (achievement.rarity <= 0.3) {
    rarityLabel = "Uncommon";
  } else {
    rarityLabel = "Common";
  }

  let rarityColor = "text-slate-400";
  if (rarityLabel === "Mythic") {
    rarityColor = "text-fuchsia-300";
  } else if (rarityLabel === "Ultra Rare") {
    rarityColor = "text-cyan-300";
  } else if (rarityLabel === "Rare") {
    rarityColor = "text-indigo-300";
  } else if (rarityLabel === "Uncommon") {
    rarityColor = "text-emerald-300";
  }

  return (
    <div
      className={[
        "flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/95",
        compact ? "p-2.5" : "p-3",
      ].join(" ")}
    >
      {/* title row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-white">
              {achievement.name}
            </p>
            {achievement.earned && (
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">
                Unlocked
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {achievement.description}
          </p>
        </div>

        {showTierBadges && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tierClasses}`}
          >
            <Star className="h-3 w-3" />
            {achievement.tier.toUpperCase()}
          </span>
        )}
      </div>

      {/* rarity + category row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
        <div className="flex items-center gap-2">
          {showRarity && (
            <>
              <span className={rarityColor}>{rarityLabel}</span>
              <span className="h-0.5 w-4 rounded-full bg-slate-700" />
              <span className="text-slate-400">
                {(100 - Math.round(achievement.rarity * 100))}% of members
                don&apos;t have this yet
              </span>
            </>
          )}
        </div>
        <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400">
          {labelForCategory(achievement.category)}
        </span>
      </div>

      {/* progress row */}
      <div className="mt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {achievement.progress} / {achievement.goal}
          </span>
          <span
            className={[
              "font-medium",
              achievement.earned ? "text-emerald-400" : "text-slate-300",
            ].join(" ")}
          >
            {pct}%
          </span>
        </div>
        {showProgress && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={[
                "h-full rounded-full transition-all",
                achievement.earned ? "bg-emerald-500" : "bg-sky-500",
                pct >= 100 ? "shadow-[0_0_8px_rgba(16,185,129,0.7)]" : "",
              ].join(" ")}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* footer row */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[10px]">
        <div className="flex flex-wrap items-center gap-1">
          {achievement.earned ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-1.5 py-0.5 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span>Locked</span>
            </span>
          )}
        </div>
        <button className="rounded-lg bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-slate-800">
          View unlock conditions
        </button>
      </div>
    </div>
  );
}
