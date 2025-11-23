// app/dashboard/[guildId]/achievements/[achievementId]/page.js
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import useSWR from "swr";
import RoleDropdown from "@/components/inputs/RoleDropdown";

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

// 4 options to match overview (messages / reactions / voice / threads)
const ACTION_OPTIONS = [
  { id: "messages", label: "Member sends [count] messages" },
  { id: "reactions", label: "Member adds [count] reactions" },
  { id: "voice", label: "Member spends [time] in voice" },
  { id: "threads", label: "Member creates [count] threads" },
];

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AchievementEditorPage({ params }) {
  const router = useRouter();
  const guildId = params?.guildId;
  const achievementId = params?.achievementId;

  // ---------------------------------------------------------------------------
  // ROLES for role rewards
  // ---------------------------------------------------------------------------
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useSWR(
    guildId ? `/api/discord/guilds/${guildId}/roles` : null,
    fetcher
  );

  // handle either:  [ {id, name}, ... ]  OR  { roles: [ ... ] }
  const rolesRaw = rolesData && Array.isArray(rolesData.roles)
    ? rolesData.roles
    : rolesData;
  const roles = Array.isArray(rolesRaw) ? rolesRaw : [];

  // ---------------------------------------------------------------------------
  // MOCKED ACHIEVEMENT – replace with real fetch later
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
          roleId: null,
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
  const [showEmbedEditor, setShowEmbedEditor] = useState(false);
  const [embedTitle, setEmbedTitle] = useState(
    "GG {player}, you just unlocked an achievement!"
  );
  const [embedDescription, setEmbedDescription] = useState(
    "You just unlocked **{achievement}** – keep grinding!"
  );

  const [tiers, setTiers] = useState(initialAchievement.tiers);
  const [expandedTierId, setExpandedTierId] = useState("bronze");

  const [settings, setSettings] = useState(initialAchievement.settings);

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

  // For RoleDropdown → updates rewards.roleId
  function handleRewardRoleUpdate(tierId, key, value) {
    if (key !== "roleId") return;
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? {
              ...t,
              rewards: {
                ...t.rewards,
                roleId: value,
              },
            }
          : t
      )
    );
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // hook to backend later
    }, 750);
  }

  function handleResetProgress() {
    alert("Reset progress clicked (stub)");
  }

  function handleDelete() {
    const ok = confirm("Are you sure you want to delete this achievement?");
    if (!ok) return;

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
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-slate-900 bg-slate-950 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={
              guildId ? `/dashboard/${guildId}/achievements` : "/dashboard"
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
          {/* ACHIEVEMENT PROGRESS + ACTION */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5 shadow-sm">
            {/* progress */}
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

            {/* override announcement */}
            <div className="mt-6 rounded-lg bg-[#151927] px-4 py-3">
              <div className="flex items-start justify-between gap-4">
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
                  onChange={(val) => {
                    setOverrideAnnouncement(val);
                    if (!val) setShowEmbedEditor(false);
                  }}
                />
              </div>

              {overrideAnnouncement && (
                <div className="mt-4 space-y-3">
                  {!showEmbedEditor && (
                    <button
                      type="button"
                      onClick={() => setShowEmbedEditor(true)}
                      className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
                    >
                      + Add embed
                    </button>
                  )}

                  {showEmbedEditor && (
                    <>
                      {/* simple embed editor */}
                      <div className="rounded-lg border border-slate-800 bg-[#050816] p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              Embed title
                            </p>
                            <input
                              value={embedTitle}
                              onChange={(e) => setEmbedTitle(e.target.value)}
                              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                            />
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              Embed description
                            </p>
                            <textarea
                              value={embedDescription}
                              onChange={(e) =>
                                setEmbedDescription(e.target.value)
                              }
                              rows={3}
                              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* preview */}
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500" />
                        <div className="flex-1 space-y-1">
                          <div className="rounded-lg bg-[#050816] px-3 py-2 text-xs text-slate-100">
                            <p className="mb-1 text-[10px] text-slate-400">
                              ServerMate Bot{" "}
                              <span className="ml-1 rounded-sm bg-indigo-600 px-1 text-[9px] uppercase tracking-wide text-white">
                                BOT
                              </span>{" "}
                              · Today
                            </p>
                            {embedTitle && (
                              <p className="font-semibold text-slate-50">
                                {embedTitle}
                              </p>
                            )}
                            {embedDescription && (
                              <p className="mt-1 whitespace-pre-wrap text-slate-100">
                                {embedDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
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
                    {/* header */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTierId(expanded ? "" : tier.id)
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

                    {/* body */}
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

                          <RewardToggleRow
                            label="Give a role for achieving"
                            enabled={tier.rewards.giveRole}
                            onChange={() =>
                              handleTierRewardToggle(tier.id, "giveRole")
                            }
                          >
                            <div className="mt-2 max-w-xs">
                              <RoleDropdown
                                btn={{
                                  id: tier.id,
                                  roleId: tier.rewards.roleId,
                                }}
                                roles={roles}
                                loading={rolesLoading}
                                updateButton={(id, key, value) =>
                                  handleRewardRoleUpdate(tier.id, key, value)
                                }
                              />
                              {rolesError && (
                                <p className="mt-1 text-[10px] text-red-400">
                                  Failed to load roles
                                </p>
                              )}
                            </div>
                          </RewardToggleRow>

                          <RewardToggleRow
                            label="Remove a role for achieving"
                            enabled={tier.rewards.removeRole}
                            onChange={() =>
                              handleTierRewardToggle(tier.id, "removeRole")
                            }
                          />

                          <RewardToggleRow
                            label="Give XP for achieving"
                            enabled={tier.rewards.giveXP}
                            onChange={() =>
                              handleTierRewardToggle(tier.id, "giveXP")
                            }
                          />

                          <RewardToggleRow
                            label="Give coins for achieving"
                            enabled={tier.rewards.giveCoins}
                            onChange={() =>
                              handleTierRewardToggle(tier.id, "giveCoins")
                            }
                          />
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
              <p className="text-sm font-semibold text-slate-100">Settings</p>
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

// Blue pill toggle
function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        enabled ? "bg-[#2563eb]" : "bg-slate-700",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-4" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

function RewardToggleRow({ label, enabled, onChange, children }) {
  return (
    <div className="rounded-md bg-[#1a1f2e] px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] text-slate-200">{label}</p>
        <Toggle enabled={enabled} onChange={onChange} />
      </div>
      {enabled && children}
    </div>
  );
}

function SettingRow({ label, description, enabled, onToggle, extra }) {
  return (
    <div className="rounded-lg bg-[#151927] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-100">{label}</p>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
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
