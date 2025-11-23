"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronDown } from "lucide-react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

// Icon paths in /public
const tierIcons = {
  bronze: "/achievements/bronze.png",
  silver: "/achievements/silver.png",
  gold: "/achievements/gold.png",
  diamond: "/achievements/diamond.png",
};

// Fake DB for now
const ACHIEVEMENT_MAP = {
  "king-of-spam": {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send messages",
  },
  "reaction-master": {
    id: "reaction-master",
    name: "Reaction Master",
    description: "Add reactions to messages",
  },
  "stay-awhile": {
    id: "stay-awhile",
    name: "Stay Awhile and Listen",
    description: "Spend minutes in voice channels",
  },
  "thread-creator": {
    id: "thread-creator",
    name: "Thread Creator",
    description: "Create threads",
  },
};

const DEFAULT_TIERS = {
  bronze: {
    id: "bronze",
    name: "Bronze",
    count: 20,
    giveRole: false,
    giveRoleRoleId: null,
    removeRole: false,
    removeRoleRoleId: null,
    giveXP: false,
    giveCoins: false,
  },
  silver: {
    id: "silver",
    name: "Silver",
    count: 100,
    giveRole: false,
    giveRoleRoleId: null,
    removeRole: false,
    removeRoleRoleId: null,
    giveXP: false,
    giveCoins: false,
  },
  gold: {
    id: "gold",
    name: "Gold",
    count: 500,
    giveRole: false,
    giveRoleRoleId: null,
    removeRole: false,
    removeRoleRoleId: null,
    giveXP: false,
    giveCoins: false,
  },
  diamond: {
    id: "diamond",
    name: "Diamond",
    count: 1000,
    giveRole: false,
    giveRoleRoleId: null,
    removeRole: false,
    removeRoleRoleId: null,
    giveXP: false,
    giveCoins: false,
  },
};

const tierOrder = ["bronze", "silver", "gold", "diamond"];

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
      {isSaving ? "Saving…" : isSaved ? "Saved ✓" : "Save"}
    </button>
  );
}

/**
 * Simple role dropdown (styled like your other dropdowns)
 * props: { value, onChange, roles, loading }
 */
function RewardRoleDropdown({ value, onChange, roles, loading }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const safeRoles = Array.isArray(roles) ? roles : [];
  const filtered = safeRoles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = (() => {
    if (loading) return "Loading…";
    if (!value) return "Select a role";
    const r = safeRoles.find((x) => x.id === value);
    return r ? r.name : "Unknown role";
  })();

  return (
    <div className="relative w-full max-w-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-left text-xs text-slate-200 flex items-center justify-between"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="text-slate-400 text-[10px] ml-2">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 shadow-xl max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-200 border border-slate-700 outline-none"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && (
            <div className="px-3 py-2 text-xs text-slate-400">Loading roles…</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-500">No roles found</div>
          )}

          {!loading &&
            filtered.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  onChange(role.id);
                  setOpen(false);
                }}
                className={`flex w-full px-3 py-2 text-left text-xs hover:bg-slate-800 ${
                  value === role.id ? "text-indigo-400" : "text-slate-300"
                }`}
              >
                {role.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function AchievementEditorPage({ params }) {
  const { guildId, achievementId } = params;

  const base = useMemo(
    () => ACHIEVEMENT_MAP[achievementId] ?? ACHIEVEMENT_MAP["king-of-spam"],
    [achievementId]
  );

  const [name, setName] = useState(base.name);
  const [description] = useState(base.description);
  const [tiers, setTiers] = useState(DEFAULT_TIERS);
  const [openTier, setOpenTier] = useState("bronze");

  const [dontTrackPast, setDontTrackPast] = useState(true);
  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const [almostThere, setAlmostThere] = useState(true);

  const [overrideMessage, setOverrideMessage] = useState(false);
  const [overrideContent, setOverrideContent] = useState("");

  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  // Roles for reward dropdowns
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRoles() {
      try {
        setRolesLoading(true);
        const res = await fetch(`/api/discord/guilds/${guildId}/roles`);
        const json = await res.json();
        if (!cancelled && json.ok) {
          setRoles(json.roles || []);
        }
      } catch (e) {
        console.error("Failed to load roles", e);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    }

    loadRoles();
    return () => {
      cancelled = true;
    };
  }, [guildId]);

  const updateTier = (tierId, patch) => {
    setTiers((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], ...patch },
    }));
  };

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      // TODO: hook to DB/API
      console.log("Saving achievement config:", {
        id: achievementId,
        name,
        tiers,
        dontTrackPast,
        deadlineEnabled,
        almostThere,
        overrideMessage,
        overrideContent,
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    }, 900);
  };

  const handleDelete = () => {
    if (typeof window !== "undefined" && window.confirm("Delete this achievement?")) {
      console.log("Delete achievement", achievementId);
      // later: redirect back to overview
    }
  };

  const handleReset = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Reset all progress for this achievement?")
    ) {
      console.log("Reset progress for", achievementId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top row: back + title + buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/${guildId}/achievements`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800"
          >
            <ChevronLeft size={16} className="text-slate-300" />
          </Link>

          <div className="flex items-center gap-4">
            {/* Big icon in header */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shadow-md shadow-amber-500/20">
              <Image
                src={tierIcons.bronze}
                alt="Achievement Icon"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input
                  className="bg-transparent border-none outline-none text-xl md:text-2xl font-semibold text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="text-xs text-slate-500">✏️</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure this achievement&apos;s progress, action and trophy tiers.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/90 hover:bg-red-600 text-white"
          >
            Delete
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100"
          >
            Reset Progress
          </button>
          <SaveButton state={saveState} onClick={handleSave} />
        </div>
      </div>

      {/* Tabs */}
      <AchievementsTabs guildId={guildId} activeTab="achievements" />

      {/* Body */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Achievement progress */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">Achievement progress</h3>
            <p className="text-xs text-slate-400">
              Check how many members unlocked this achievement.
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 w-0" />
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
              <span>Server progress</span>
              <span>0%</span>
            </div>
          </div>

          {/* Action + override message */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-5">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-100">Action</h3>
              <p className="text-xs text-slate-400">
                What should members do to progress toward this achievement?
              </p>
            </div>

            <div className="w-full max-w-md">
              <select
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
                defaultValue="messages"
              >
                <option value="messages">Member sends &#123;count&#125; messages</option>
                <option value="reactions">
                  Member reacts to &#123;count&#125; messages
                </option>
                <option value="voice">
                  Member spends &#123;minutes&#125; minutes in voice
                </option>
                <option value="threads">
                  Member creates &#123;count&#125; threads
                </option>
              </select>
            </div>

            {/* Override message */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Override announcement message
                  </div>
                  <div className="text-[11px] text-slate-400 max-w-md">
                    Override the default configuration message with a custom message for
                    this achievement.
                  </div>
                </div>
                <Toggle
                  checked={overrideMessage}
                  onChange={() => setOverrideMessage((v) => !v)}
                />
              </div>

              {overrideMessage && (
                <textarea
                  className="mt-2 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 h-24 resize-none"
                  placeholder="Custom announcement message…"
                  value={overrideContent}
                  onChange={(e) => setOverrideContent(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Trophy tiers */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Trophy Tiers</h3>

            <div className="space-y-3">
              {tierOrder.map((id) => {
                const tier = tiers[id];
                const open = openTier === id;

                return (
                  <div
                    key={id}
                    className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shadow-sm shadow-black/30"
                  >
                    {/* Header */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-900/80 transition-all duration-200"
                      onClick={() => setOpenTier(open ? "" : id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-800 ring-1 ring-slate-700/60">
                          <Image
                            src={tierIcons[id]}
                            alt={tier.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-100">
                            {tier.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            Send {tier.count} messages
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Body */}
                    <div
                      className={`border-t border-slate-800 overflow-hidden transition-all duration-300 ${
                        open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {open && (
                        <div className="px-4 py-4 space-y-5">
                          {/* Count */}
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-300">
                              Count
                            </div>
                            <input
                              type="number"
                              className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
                              value={tier.count}
                              onChange={(e) =>
                                updateTier(id, {
                                  count: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          {/* Rewards */}
                          <div className="space-y-3">
                            <div className="text-xs font-semibold text-slate-300">
                              Rewards
                            </div>

                            {/* Give role */}
                            <div className="flex flex-col gap-2 text-xs text-slate-200">
                              <div className="flex items-center justify-between gap-4">
                                <span>Give a role for achieving</span>
                                <Toggle
                                  checked={tier.giveRole}
                                  onChange={() =>
                                    updateTier(id, { giveRole: !tier.giveRole })
                                  }
                                />
                              </div>
                              {tier.giveRole && (
                                <RewardRoleDropdown
                                  value={tier.giveRoleRoleId}
                                  onChange={(roleId) =>
                                    updateTier(id, { giveRoleRoleId: roleId })
                                  }
                                  roles={roles}
                                  loading={rolesLoading}
                                />
                              )}
                            </div>

                            {/* Remove role */}
                            <div className="flex flex-col gap-2 text-xs text-slate-200 pt-2 border-t border-slate-800/60">
                              <div className="flex items-center justify-between gap-4">
                                <span>Remove a role for achieving</span>
                                <Toggle
                                  checked={tier.removeRole}
                                  onChange={() =>
                                    updateTier(id, { removeRole: !tier.removeRole })
                                  }
                                />
                              </div>
                              {tier.removeRole && (
                                <RewardRoleDropdown
                                  value={tier.removeRoleRoleId}
                                  onChange={(roleId) =>
                                    updateTier(id, { removeRoleRoleId: roleId })
                                  }
                                  roles={roles}
                                  loading={rolesLoading}
                                />
                              )}
                            </div>

                            {/* XP + coins */}
                            <div className="flex flex-col gap-2 text-xs text-slate-200 pt-2 border-t border-slate-800/60">
                              <div className="flex items-center justify-between gap-4">
                                <span>Give XP for achieving</span>
                                <Toggle
                                  checked={tier.giveXP}
                                  onChange={() =>
                                    updateTier(id, { giveXP: !tier.giveXP })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span>Give coins for achieving</span>
                                <Toggle
                                  checked={tier.giveCoins}
                                  onChange={() =>
                                    updateTier(id, { giveCoins: !tier.giveCoins })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: settings */}
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Settings</h3>

            <div className="space-y-4 text-xs text-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">
                    Don&apos;t track past progress
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Only track progress from now on, not past activity.
                  </div>
                </div>
                <Toggle
                  checked={dontTrackPast}
                  onChange={() => setDontTrackPast((v) => !v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">Set deadline</div>
                  <div className="text-[11px] text-slate-400">
                    Great for seasonal events—achievement ends on your chosen date.
                  </div>
                </div>
                <Toggle
                  checked={deadlineEnabled}
                  onChange={() => setDeadlineEnabled((v) => !v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">Send &apos;Almost there&apos;</div>
                  <div className="text-[11px] text-slate-400">
                    Notify members at 75% progress toward this achievement.
                  </div>
                </div>
                <Toggle
                  checked={almostThere}
                  onChange={() => setAlmostThere((v) => !v)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
