// app/dashboard/[guildId]/achievements/[achievementId]/page.js
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const TIER_CONFIG = [
  {
    id: "bronze",
    label: "Bronze",
    description: "Send 20 messages",
    defaultCount: 20,
  },
  {
    id: "silver",
    label: "Silver",
    description: "Send 100 messages",
    defaultCount: 100,
  },
  {
    id: "gold",
    label: "Gold",
    description: "Send 500 messages",
    defaultCount: 500,
  },
  {
    id: "diamond",
    label: "Diamond",
    description: "Send 1000 messages",
    defaultCount: 1000,
  },
];

const ACTION_OPTIONS = [
  { id: "messages", label: "Member sends [count] messages" },
  { id: "voice", label: "Member spends [time] in voice" },
  { id: "reactions", label: "Member adds [count] reactions" },
];

export default function AchievementEditorPage({ params }) {
  const router = useRouter();
  const guildId = params?.guildId;
  const achievementId = params?.achievementId;

  // ---------------------------------------------------------------------------
  // MOCKED ACHIEVEMENT – you can replace this with a real fetch later
  // ---------------------------------------------------------------------------
  const initialAchievement = useMemo(
    () => ({
      id: achievementId || "king-of-spam",
      name: "King of Spam",
      serverProgress: 0,
      actionType: "messages",
      overrideAnnouncement: false,
      tiers: TIER_CONFIG.map((tier) => ({
        id: tier.id,
        label: tier.label,
        description: tier.description,
        count: tier.defaultCount,
        rewards: {
          giveRole: false,
          removeRole: false,
          giveXP: false,
          giveCoins: false,
        },
      })),
      settings: {
        dontTrackPast: true,
        setDeadline: false,
        deadline: "",
        almostThere: true,
      },
    }),
    [achievementId]
  );

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [name, setName] = useState(initialAchievement.name);
  const [serverProgress] = useState(initialAchievement.serverProgress);
  const [actionType, setActionType] = useState(initialAchievement.actionType);
  const [overrideAnnouncement, setOverrideAnnouncement] = useState(
    initialAchievement.overrideAnnouncement
  );

  const [tiers, setTiers] = useState(initialAchievement.tiers);
  const [expandedTierId, setExpandedTierId] = useState("bronze");

  const [settings, setSettings] = useState(initialAchievement.settings);

  // fake “saving” state
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  function handleTierChange(tierId, changes) {
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, ...changes } : t))
    );
  }

  function handleTierRewardToggle(tierId, key) {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? {
              ...t,
              rewards: {
                ...t.rewards,
                [key]: !t.rewards[key],
              },
            }
          : t
      )
    );
  }

  function handleSave() {
    // hook this to your API later
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // console.log("Save payload", {
      //   id: achievementId,
      //   name,
      //   actionType,
      //   overrideAnnouncement,
      //   tiers,
      //   settings,
      // });
    }, 750);
  }

  function handleResetProgress() {
    // just a stub – wire to backend later
    alert("Reset progress clicked (stub)");
  }

  function handleDelete() {
    // stub: confirm + redirect back to overview
    const ok = confirm("Are you sure you want to delete this achievement?");
    if (!ok) return;

    // call delete API here later
    if (guildId) {
      router.push(`/dashboard/${guildId}/achievements`);
    } else {
      router.push("/dashboard");
    }
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* TOP BAR (like your screenshot) */}
      <header className="flex items-center justify-between border-b border-slate-900 bg-slate-950 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={
              guildId
                ? `/dashboard/${guildId}/achievements`
                : "/dashboard"
            }
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-[120px] bg-transparent text-lg font-semibold text-white outline-none"
            />
            <span className="text-sm text-slate-500">✏️</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="rounded-md bg-[#3c2630] px-3 py-1.5 text-xs font-medium text-[#f87171] hover:bg-[#4b2e3a]"
          >
            <span className="inline-flex items-center gap-1">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </span>
          </button>
          <button
            onClick={handleResetProgress}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700"
          >
            Reset Progress
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      {/* MAIN SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          {/* ACHIEVEMENT PROGRESS + ACTION CARD */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5 shadow-sm">
            {/* progress block */}
            <div className="mb-6 rounded-lg bg-[#151927] p-4">
              <p className="text-sm font-semibold text-slate-100">
                Achievement progress
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Check how many members unlocked this achievement
              </p>

              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Server progress
                </p>
                <div className="h-1.5 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-slate-500"
                    style={{ width: `${serverProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {serverProgress.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* action dropdown */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Action
              </p>

              <div className="relative inline-flex min-w-[260px] items-center rounded-md border border-slate-800 bg-[#151927] px-3 py-2 text-xs text-slate-100">
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-100 outline-none"
                >
                  {ACTION_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-slate-900"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* override announcement toggle */}
            <div className="mt-6 flex items-start justify-between gap-4 rounded-lg bg-[#151927] px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-100">
                  Override announcement message
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Override the default configuration message with a custom
                  message for this achievement
                </p>
              </div>
              <Toggle
                enabled={overrideAnnouncement}
                onChange={setOverrideAnnouncement}
              />
            </div>
          </section>

          {/* TROPHY TIERS */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-100">
              Trophy Tiers
            </p>

            <div className="mt-4 space-y-3">
              {tiers.map((tier) => {
                const expanded = expandedTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    className={[
                      "rounded-lg border bg-[#151927] transition",
                      expanded
                        ? "border-[#2563eb] shadow-[0_0_0_1px_rgba(37,99,235,0.6)]"
                        : "border-transparent",
                    ].join(" ")}
                  >
                    {/* header row */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTierId(
                          expanded ? "" : tier.id
                        )
                      }
                      className="flex w-full items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <TierIcon tierId={tier.id} />
                        <div className="text-left">
                          <p className="text-xs font-semibold text-slate-100">
                            {tier.label}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {tier.description}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-md bg-slate-900 px-2 py-1">
                        {expanded ? (
                          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* expanded body */}
                    {expanded && (
                      <div className="border-t border-slate-800 px-4 pb-4 pt-3">
                        {/* customize badge + count */}
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <button className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800">
                            Customize badge
                          </button>

                          <div className="w-full max-w-xs space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                              Count
                            </p>
                            <input
                              type="number"
                              value={tier.count}
                              onChange={(e) =>
                                handleTierChange(tier.id, {
                                  count: Number(e.target.value || 0),
                                })
                              }
                              className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                            />
                          </div>
                        </div>

                        {/* rewards */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Rewards
                          </p>

                          <div className="space-y-2">
                            <RewardToggleRow
                              label="Give a role for achieving"
                              enabled={tier.rewards.giveRole}
                              onChange={() =>
                                handleTierRewardToggle(
                                  tier.id,
                                  "giveRole"
                                )
                              }
                            />
                            <RewardToggleRow
                              label="Remove a role for achieving"
                              enabled={tier.rewards.removeRole}
                              onChange={() =>
                                handleTierRewardToggle(
                                  tier.id,
                                  "removeRole"
                                )
                              }
                            />
                            <RewardToggleRow
                              label="Give XP for achieving"
                              enabled={tier.rewards.giveXP}
                              onChange={() =>
                                handleTierRewardToggle(
                                  tier.id,
                                  "giveXP"
                                )
                              }
                            />
                            <RewardToggleRow
                              label="Give coins for achieving"
                              enabled={tier.rewards.giveCoins}
                              onChange={() =>
                                handleTierRewardToggle(
                                  tier.id,
                                  "giveCoins"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SETTINGS */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">
                Settings
              </p>
              {/* little collapse icon slot like in screenshot – static for now */}
              <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
            </div>

            <div className="space-y-3">
              <SettingRow
                label="Don't track past progress"
                description="Only track progress from now on, not past activity"
                enabled={settings.dontTrackPast}
                onToggle={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    dontTrackPast: value,
                  }))
                }
              />

              <SettingRow
                label="Set deadline"
                description="Great for seasonal events—achievement ends on your chosen date"
                enabled={settings.setDeadline}
                onToggle={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    setDeadline: value,
                  }))
                }
                extra={
                  <input
                    type="date"
                    value={settings.deadline}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                    className="mt-2 w-full max-w-xs rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                  />
                }
              />

              <SettingRow
                label="Send 'Almost there'"
                description="Notify members at 75% progress toward this achievement"
                enabled={settings.almostThere}
                onToggle={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    almostThere: value,
                  }))
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SMALL COMPONENTS
// ---------------------------------------------------------------------------

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="inline-flex items-center rounded-full bg-slate-800 px-1 py-0.5 text-[10px]"
    >
      <span
        className={[
          "mr-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
          enabled
            ? "bg-[#2563eb] text-white"
            : "bg-slate-700 text-slate-300",
        ].join(" ")}
      >
        {enabled ? "ON" : "OFF"}
      </span>
      <span className="h-4 w-7 rounded-full bg-slate-900">
        <span
          className={[
            "block h-4 w-4 rounded-full bg-white shadow transition-transform",
            enabled ? "translate-x-3" : "translate-x-0",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

function RewardToggleRow({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-[#1a1f2e] px-3 py-2">
      <p className="text-[11px] text-slate-200">{label}</p>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

function SettingRow({ label, description, enabled, onToggle, extra }) {
  return (
    <div className="rounded-lg bg-[#151927] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-100">
            {label}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>
        </div>
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>
      {extra}
    </div>
  );
}

function TierIcon({ tierId }) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold";

  if (tierId === "bronze") {
    return (
      <div className={base + " text-amber-300 border border-amber-500/40"}>
        🥉
      </div>
    );
  }
  if (tierId === "silver") {
    return (
      <div className={base + " text-slate-200 border border-slate-400/60"}>
        🥈
      </div>
    );
  }
  if (tierId === "gold") {
    return (
      <div className={base + " text-yellow-200 border border-yellow-400/70"}>
        🥇
      </div>
    );
  }
  if (tierId === "diamond") {
    return (
      <div className={base + " text-cyan-200 border border-cyan-400/70"}>
        💎
      </div>
    );
  }
  return <div className={base}>🏆</div>;
}
