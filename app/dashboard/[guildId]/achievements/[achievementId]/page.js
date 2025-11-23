// app/dashboard/[guildId]/achievements/page.js
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  X,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// ICONS – must exist in /public (or change these paths)
// ---------------------------------------------------------------------------
const tierIcons = {
  bronze: "/Bronze.png",
  silver: "/Silver.png",
  gold: "/gold.png",
  diamond: "/Diamond.png",
};

// ---------------------------------------------------------------------------
// MOCK DATA – replace with real DB / API later
// ---------------------------------------------------------------------------
const MOCK_ROLES = [
  {
    id: "111",
    name: "Everyone",
    color: "#80848e",
    isDefault: true,
  },
  {
    id: "222",
    name: "Active Member",
    color: "#57f287",
  },
  {
    id: "333",
    name: "OG Member",
    color: "#f1c40f",
  },
  {
    id: "444",
    name: "Moderator",
    color: "#5865f2",
  },
  {
    id: "555",
    name: "Admin",
    color: "#ed4245",
  },
];

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
    rarity: 0.88,
    roles: ["111"],
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
    rarity: 0.04,
    roles: ["222", "333"],
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
    rarity: 0.21,
    roles: ["111", "222"],
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
    rarity: 0.09,
    roles: ["222", "333"],
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
    rarity: 0.17,
    roles: ["111", "222"],
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
    rarity: 0.03,
    roles: ["222", "333", "444"],
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
    rarity: 0.12,
    roles: ["222"],
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
    rarity: 0.01,
    roles: ["333"],
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
    rarity: 0.42,
    roles: ["111"],
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
    rarity: 0.05,
    roles: ["222", "333"],
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
    rarity: 0.01,
    roles: ["333"],
  },
  {
    id: "mod-helper",
    name: "Helper",
    description: "Reply to 50 messages in help channels.",
    category: "moderation",
    tier: "silver",
    goal: 50,
    progress: 18,
    earned: false,
    rarity: 0.16,
    roles: ["444"],
  },
  {
    id: "mod-hammer",
    name: "Ban Hammer",
    description: "Issue 25 successful moderations (warn/mute/ban).",
    category: "moderation",
    tier: "gold",
    goal: 25,
    progress: 9,
    earned: false,
    rarity: 0.02,
    roles: ["444", "555"],
  },
];

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const CATEGORY_TABS = [
  { id: "all", label: "All Achievements" },
  { id: "messages", label: "Messages" },
  { id: "reactions", label: "Reactions" },
  { id: "voice", label: "Voice" },
  { id: "activity", label: "Activity" },
  { id: "levels", label: "Levels" },
  { id: "moderation", label: "Staff / Mod" },
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "rarity", label: "Rarity (rarest first)" },
  { id: "tier", label: "Tier (high → low)" },
  { id: "progress", label: "Progress (highest → lowest)" },
  { id: "name", label: "Name (A → Z)" },
];

// ---------------------------------------------------------------------------
// MAIN PAGE COMPONENT – BIG BOY VERSION
// ---------------------------------------------------------------------------
export default function AchievementsPage({ params }) {
  const guildId = params?.guildId;

  // category/filter/sort state
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  // toggle switches (Discord-style: label left, switch right)
  const [showOnlyEarned, setShowOnlyEarned] = useState(false);
  const [showOnlyLocked, setShowOnlyLocked] = useState(false);
  const [showProgressBars, setShowProgressBars] = useState(true);
  const [highlightHighTier, setHighlightHighTier] = useState(true);

  // role filter dropdown
  const [selectedRoleIds, setSelectedRoleIds] = useState(["111"]); // default Everyone
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // computed stats
  const allAchievements = useMemo(() => MOCK_ACHIEVEMENTS, []);
  const allRoles = useMemo(() => MOCK_ROLES, []);

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

    const completion = Math.round((earned / Math.max(total, 1)) * 100);

    return {
      total,
      earned,
      completion,
      tierCounts,
    };
  }, [allAchievements]);

  // filtered + sorted achievements
  const visibleAchievements = useMemo(() => {
    let list = [...allAchievements];

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((a) => a.category === activeCategory);
    }

    // Search filter
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Role filter – if at least one role selected, show only achievements
    // that have ANY matching role.
    if (selectedRoleIds.length > 0) {
      list = list.filter((a) =>
        a.roles.some((rid) => selectedRoleIds.includes(rid))
      );
    }

    // Toggle filters
    if (showOnlyEarned && !showOnlyLocked) {
      list = list.filter((a) => a.earned);
    } else if (showOnlyLocked && !showOnlyEarned) {
      list = list.filter((a) => !a.earned);
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "rarity":
          // rarer first = smaller rarity value first
          return a.rarity - b.rarity;
        case "tier":
          return tierRank(b.tier) - tierRank(a.tier);
        case "progress": {
          const aPct = a.progress / Math.max(a.goal, 1);
          const bPct = b.progress / Math.max(b.goal, 1);
          return bPct - aPct;
        }
        case "name":
          return a.name.localeCompare(b.name);
        default:
        case "recommended": {
          // Example "recommended" sorter:
          // 1) Earned achievements with high tier first
          // 2) Then by progress
          // 3) Then by rarity
          const aScore =
            (a.earned ? 50 : 0) +
            tierRank(a.tier) * 10 +
            (a.progress / Math.max(a.goal, 1)) * 25 -
            a.rarity * 20;
          const bScore =
            (b.earned ? 50 : 0) +
            tierRank(b.tier) * 10 +
            (b.progress / Math.max(b.goal, 1)) * 25 -
            b.rarity * 20;
          return bScore - aScore;
        }
      }
    });

    return list;
  }, [
    allAchievements,
    activeCategory,
    search,
    sortBy,
    selectedRoleIds,
    showOnlyEarned,
    showOnlyLocked,
  ]);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ------------------------------------------------------------------ */}
      {/* TOP NAV / BREADCRUMB                                              */}
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
              <h1 className="text-xl font-semibold text-white">Achievements</h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                BETA
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Design and track flex-worthy milestones for your community.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {guildId && (
            <span className="hidden rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-300 sm:inline-flex">
              Guild ID:{" "}
              <span className="ml-1 font-mono text-slate-100">{guildId}</span>
            </span>
          )}

          <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/15">
            <Filter className="h-3.5 w-3.5" />
            <span>Auto-tune rewards (coming soon)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HEADER ROW – PROFILE SUMMARY + TIER LEGEND                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
        {/* Left: user/server overview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
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
              <div className="flex items-center gap-3">
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
            <HeaderStat
              label="Total Achievements"
              value={stats.total}
              sub="Available"
            />
            <HeaderStat
              label="Unlocked"
              value={stats.earned}
              sub="Completed"
              accent="emerald"
            />
            <HeaderStat
              label="Gold & Diamond"
              value={stats.tierCounts.gold + stats.tierCounts.diamond}
              sub="High tier"
            />
            <HeaderStat
              label="Bronze & Silver"
              value={stats.tierCounts.bronze + stats.tierCounts.silver}
              sub="Starter"
            />
          </div>

          {/* Mini explanation / hint */}
          <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-400">
            <p>
              Tip: Use{" "}
              <span className="font-medium text-emerald-400">
                role filters
              </span>{" "}
              on the right to preview how the achievements look for different
              segments of your server.
            </p>
          </div>
        </div>

        {/* Right: tier legend + rarity breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">
                Tiers & Rarities
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Use tiers to define how grindy or rare each achievement is.
              </p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-900">
              <span>View rewards</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <TierLegendItem
              icon={tierIcons.bronze}
              label="Bronze"
              description="Super easy starter achievements. Good for onboarding."
              count={stats.tierCounts.bronze}
            />
            <TierLegendItem
              icon={tierIcons.silver}
              label="Silver"
              description="Mildly grindy – players should see these regularly."
              count={stats.tierCounts.silver}
            />
            <TierLegendItem
              icon={tierIcons.gold}
              label="Gold"
              description="Hard or time-consuming. Starts to feel special."
              count={stats.tierCounts.gold}
            />
            <TierLegendItem
              icon={tierIcons.diamond}
              label="Diamond"
              description="Ultra-rare achievements for your top 1% grinders."
              count={stats.tierCounts.diamond}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FILTER BAR – CATEGORY TABS + SEARCH + ROLE FILTER + TOGGLES        */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                    isActive
                      ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900",
                  ].join(" ")}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search achievements…"
                className="w-32 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none sm:w-44"
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

            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-3 h-px w-full bg-slate-800/80" />

        {/* Lower filter row: role filter + toggles */}
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: role filter dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Role view:
            </span>
            <RoleFilterDropdown
              allRoles={allRoles}
              selectedRoleIds={selectedRoleIds}
              setSelectedRoleIds={setSelectedRoleIds}
              open={roleDropdownOpen}
              setOpen={setRoleDropdownOpen}
            />
          </div>

          {/* Right: toggles row – Discord style (label left, switch right) */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <FilterToggle
              label="Show only earned"
              description="Hide locked achievements."
              enabled={showOnlyEarned}
              onChange={(value) => {
                setShowOnlyEarned(value);
                if (value) setShowOnlyLocked(false);
              }}
            />
            <FilterToggle
              label="Show only locked"
              description="Focus on what’s left to unlock."
              enabled={showOnlyLocked}
              onChange={(value) => {
                setShowOnlyLocked(value);
                if (value) setShowOnlyEarned(false);
              }}
            />
            <FilterToggle
              label="Show progress bars"
              description="Display progress towards each goal."
              enabled={showProgressBars}
              onChange={setShowProgressBars}
            />
            <FilterToggle
              label="Highlight high tiers"
              description="Visually boost Gold & Diamond."
              enabled={highlightHighTier}
              onChange={setHighlightHighTier}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN GRID – ACHIEVEMENT CARDS                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4">
        {/* Summary row */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-200">
                {visibleAchievements.length}
              </span>{" "}
              / {allAchievements.length} achievements
            </span>
            {activeCategory !== "all" && (
              <>
                <span className="text-slate-600">•</span>
                <span>Category: {labelForCategory(activeCategory)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
              Filters applied:{" "}
              {[
                showOnlyEarned ? "earned" : null,
                showOnlyLocked ? "locked" : null,
                selectedRoleIds.length > 0 ? "role" : null,
                search ? "search" : null,
              ]
                .filter(Boolean)
                .join(", ") || "none"}
            </span>
          </div>
        </div>

        {visibleAchievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-200">
              No achievements match your filters.
            </p>
            <p className="text-xs text-slate-400">
              Try clearing some filters, or switching category or roles.
            </p>
            <button
              onClick={() => {
                setShowOnlyEarned(false);
                setShowOnlyLocked(false);
                setSelectedRoleIds(["111"]);
                setSearch("");
                setSortBy("recommended");
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
            >
              <X className="h-3 w-3" />
              <span>Reset filters</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleAchievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                showProgressBars={showProgressBars}
                highlightHighTier={highlightHighTier}
                allRoles={allRoles}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// SMALL SUBCOMPONENTS
// ---------------------------------------------------------------------------

function HeaderStat({ label, value, sub, accent = "slate" }) {
  const accentClasses =
    accent === "emerald"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      : "border-slate-700 bg-slate-900 text-slate-200";

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

function TierLegendItem({ icon, label, description, count }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/90 p-2.5">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-slate-900">
        <Image
          src={icon}
          alt={`${label} tier icon`}
          width={32}
          height={32}
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
        <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SORT DROPDOWN
// ---------------------------------------------------------------------------
function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);

  const activeOption = SORT_OPTIONS.find((opt) => opt.id === sortBy);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900"
      >
        <span className="text-slate-500">Sort:</span>
        <span className="font-medium text-slate-200">
          {activeOption?.label ?? "Recommended"}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-slate-800 bg-slate-950/95 p-1 text-xs text-slate-200 shadow-xl backdrop-blur">
          {SORT_OPTIONS.map((opt) => {
            const isActive = opt.id === sortBy;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSortBy(opt.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "hover:bg-slate-900"
                }`}
              >
                <span>{opt.label}</span>
                {isActive && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ROLE FILTER DROPDOWN – Discord-style with colors + checkmarks
// ---------------------------------------------------------------------------
function RoleFilterDropdown({
  allRoles,
  selectedRoleIds,
  setSelectedRoleIds,
  open,
  setOpen,
}) {
  const selectedRoles = allRoles.filter((r) => selectedRoleIds.includes(r.id));

  function toggleRole(roleId) {
    if (selectedRoleIds.includes(roleId)) {
      const next = selectedRoleIds.filter((id) => id !== roleId);
      setSelectedRoleIds(next);
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  }

  function clearRoles() {
    setSelectedRoleIds([]);
  }

  function selectEveryoneOnly() {
    const everyone = allRoles.find((r) => r.isDefault);
    if (everyone) {
      setSelectedRoleIds([everyone.id]);
    }
  }

  const label =
    selectedRoles.length === 0
      ? "No role filter"
      : selectedRoles.length === 1
      ? selectedRoles[0].name
      : `${selectedRoles[0].name} +${selectedRoles.length - 1}`;

  return (
    <div className="relative inline-block text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-slate-900"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>{label}</span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-1 text-xs text-slate-200 shadow-xl backdrop-blur">
          {/* Top controls */}
          <div className="mb-1 flex items-center justify-between px-1 pb-1 text-[10px] text-slate-500">
            <span className="uppercase tracking-wide">Filter by role</span>
            <div className="flex items-center gap-1">
              <button
                onClick={selectEveryoneOnly}
                className="rounded-md px-1 py-0.5 hover:bg-slate-900"
              >
                Everyone
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={clearRoles}
                className="rounded-md px-1 py-0.5 hover:bg-slate-900"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Role list */}
          <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-800/70 bg-slate-950/90">
            {allRoles.map((role) => {
              const isSelected = selectedRoleIds.includes(role.id);
              return (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-xs transition ${
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-200"
                      : "hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: role.color || "#80848e" }}
                    />
                    <span>{role.name}</span>
                    {role.isDefault && (
                      <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-400">
                        @everyone
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="mt-1 px-1 pb-1 pt-1 text-[10px] text-slate-500">
            <p>Members must have at least one selected role to see it.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FILTER TOGGLE – Discord-style switch (label left, switch right)
// ---------------------------------------------------------------------------
function FilterToggle({ label, description, enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] text-slate-300 hover:bg-slate-900"
    >
      <div className="flex-1">
        <p className="font-medium text-slate-100">{label}</p>
        {description && (
          <p className="mt-0.5 text-[10px] text-slate-500">{description}</p>
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

// ---------------------------------------------------------------------------
// ACHIEVEMENT CARD
// ---------------------------------------------------------------------------
function AchievementCard({
  achievement,
  showProgressBars,
  highlightHighTier,
  allRoles,
}) {
  const pct = Math.min(
    100,
    Math.round((achievement.progress / Math.max(achievement.goal, 1)) * 100)
  );

  const isHighTier =
    highlightHighTier &&
    (achievement.tier === "gold" || achievement.tier === "diamond");

  let tierStyles = "";
  switch (achievement.tier) {
    case "bronze":
      tierStyles =
        "border-amber-600/60 bg-amber-900/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
      break;
    case "silver":
      tierStyles =
        "border-slate-400/70 bg-slate-700/30 text-slate-100 shadow-[0_0_12px_rgba(148,163,184,0.15)]";
      break;
    case "gold":
      tierStyles =
        "border-yellow-400/80 bg-yellow-500/15 text-yellow-200 shadow-[0_0_14px_rgba(250,204,21,0.28)]";
      break;
    case "diamond":
      tierStyles =
        "border-cyan-400/80 bg-cyan-500/15 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.35)]";
      break;
    default:
      tierStyles =
        "border-slate-700 bg-slate-900 text-slate-100 shadow-[0_0_8px_rgba(15,23,42,0.7)]";
      break;
  }

  const rarityLabel =
    achievement.rarity <= 0.01
      ? "Mythic"
      : achievement.rarity <= 0.05
      ? "Ultra Rare"
      : achievement.rarity <= 0.15
      ? "Rare"
      : achievement.rarity <= 0.3
      ? "Uncommon"
      : "Common";

  const rarityColor =
    achievement.rarity <= 0.01
      ? "text-fuchsia-300"
      : achievement.rarity <= 0.05
      ? "text-cyan-300"
      : achievement.rarity <= 0.15
      ? "text-indigo-300"
      : "text-slate-400";

  const roleChips = achievement.roles
    .map((id) => allRoles.find((r) => r.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-slate-800 bg-slate-950/90 p-3">
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
        <span
          className={[
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            tierStyles,
            isHighTier ? "scale-[1.02]" : "",
          ].join(" ")}
        >
          {achievement.tier.toUpperCase()}
        </span>
      </div>

      {/* rarity + roles row */}
      <div className="flex flex-wrap items-center justify-between gap-1">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className={rarityColor}>{rarityLabel}</span>
          <span className="h-0.5 w-4 rounded-full bg-slate-700" />
          <span>
            {Math.round((1 - achievement.rarity) * 100)}% of members don&apos;t
            have this yet
          </span>
        </div>
        {roleChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {roleChips.map((role) => (
              <span
                key={role.id}
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-200"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: role.color || "#80848e" }}
                />
                <span>{role.name}</span>
              </span>
            ))}
          </div>
        )}
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
        {showProgressBars && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={[
                "h-full rounded-full transition-all",
                achievement.earned ? "bg-emerald-500" : "bg-sky-500",
                pct >= 100 ? "shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "",
              ].join(" ")}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* footer badges */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[10px]">
        <div className="flex flex-wrap items-center gap-1">
          {achievement.earned ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300">
              <Check className="h-3 w-3" />
              <span>Unlocked</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-1.5 py-0.5 text-slate-400">
              <span>Locked</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-1.5 py-0.5 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span>{labelForCategory(achievement.category)}</span>
          </span>
        </div>
        <button className="rounded-lg bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-slate-800">
          View unlock rules
        </button>
      </div>
    </div>
  );
}
