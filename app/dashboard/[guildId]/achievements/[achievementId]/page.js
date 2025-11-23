"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Trash2
} from "lucide-react";

import useSWR from "swr";
import RoleDropdown from "@/components/inputs/RoleDropdown";
import { ACHIEVEMENTS } from "../_data/achievements"; // ← IMPORTANT: shared data source

const ACTION_OPTIONS = [
  { id: "messages", label: "Member sends [count] messages" },
  { id: "reactions", label: "Member adds [count] reactions" },
  { id: "voice", label: "Member spends [time] in voice" },
  { id: "threads", label: "Member creates [count] threads" },
];

// fetcher
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AchievementEditorPage({ params }) {
  const router = useRouter();
  const guildId = params?.guildId;
  const achievementId = params?.achievementId;

  // ----------------------------
  // LOAD REAL ACHIEVEMENT FROM DATA
  // ----------------------------
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);

  if (!achievement) {
    return (
      <div className="p-10 text-slate-300">
        <p className="text-xl font-semibold text-red-400">Achievement not found.</p>
      </div>
    );
  }

  // ----------------------------
  // LOAD ROLES
  // ----------------------------
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useSWR(
    guildId ? `/api/discord/guilds/${guildId}/roles` : null,
    fetcher
  );

  const rolesRaw =
    rolesData && Array.isArray(rolesData.roles) ? rolesData.roles : rolesData;

  const roles = Array.isArray(rolesRaw) ? rolesRaw : [];

  // ------------------------------------
  // STATE (BASED ON ACHIEVEMENT DATA)
  // ------------------------------------
  const [name, setName] = useState(achievement.name);
  const [actionType, setActionType] = useState(achievement.actionType);

  const [tiers, setTiers] = useState(achievement.tiers);
  const [expandedTierId, setExpandedTierId] = useState("bronze");

  const [overrideAnnouncement, setOverrideAnnouncement] = useState(false);
  const [showEmbedEditor, setShowEmbedEditor] = useState(false);

  const [embedTitle, setEmbedTitle] = useState(
    "GG {player}, you just unlocked an achievement!"
  );
  const [embedDescription, setEmbedDescription] = useState(
    "You just unlocked **{achievement}** – keep grinding!"
  );

  const [settings, setSettings] = useState(achievement.settings);

  const [saving, setSaving] = useState(false);

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const handleTierChange = (tierId, changes) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, ...changes } : t))
    );
  };

  const handleTierRewardToggle = (tierId, key) => {
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
  };

  const handleRewardRoleUpdate = (tierId, btnId, key, value) => {
    if (key !== "roleId") return;

    const isRemove = String(btnId).includes("remove");

    setTiers((prev) =>
      prev.map((t) =>
        t.id !== tierId
          ? t
          : {
              ...t,
              rewards: {
                ...t.rewards,
                [isRemove ? "removeRoleId" : "giveRoleId"]: value,
              },
            }
      )
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 700);
  };

  const handleDelete = () => {
    const ok = confirm("Are you sure you want to delete this achievement?");
    if (!ok) return;

    router.push(`/dashboard/${guildId}/achievements`);
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-slate-900 bg-slate-950 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${guildId}/achievements`}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-[120px] bg-transparent text-lg font-semibold text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="rounded-md bg-[#3c2630] px-3 py-1.5 text-xs font-medium text-[#f87171] hover:bg-[#4b2e3a]"
          >
            <Trash2 className="h-3.5 w-3.5 inline-block mr-1" />
            Delete
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

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">

          {/* ------- ACTION TYPE -------- */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5">
            <p className="text-sm font-semibold text-slate-100 mb-3">
              Action Type
            </p>

            <div className="relative inline-flex min-w-[260px] items-center rounded-md border border-slate-800 bg-[#151927] px-3 py-2 text-xs text-slate-100">
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 outline-none"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Override announcement */}
            <div className="mt-6 rounded-lg bg-[#151927] px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-100">
                    Override announcement message
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Custom message shown when achievement is unlocked
                  </p>
                </div>

                <Toggle
                  enabled={overrideAnnouncement}
                  onChange={(v) => {
                    setOverrideAnnouncement(v);
                    if (!v) setShowEmbedEditor(false);
                  }}
                />
              </div>

              {/* Add embed */}
              {overrideAnnouncement && (
                <div className="mt-4">
                  {!showEmbedEditor && (
                    <button
                      onClick={() => setShowEmbedEditor(true)}
                      className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      + Add Embed
                    </button>
                  )}

                  {showEmbedEditor && (
                    <>
                      {/* Editor */}
                      <div className="mt-3 rounded-lg border border-slate-800 bg-[#050816] p-4 space-y-3">
                        <div>
                          <p className="text-[11px] uppercase text-slate-400 font-semibold">
                            Embed Title
                          </p>
                          <input
                            value={embedTitle}
                            onChange={(e) => setEmbedTitle(e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                          />
                        </div>

                        <div>
                          <p className="text-[11px] uppercase text-slate-400 font-semibold">
                            Embed Description
                          </p>
                          <textarea
                            value={embedDescription}
                            onChange={(e) => setEmbedDescription(e.target.value)}
                            rows={3}
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="mt-3 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500" />
                        <div className="flex-1">
                          <div className="rounded-lg bg-[#050816] px-3 py-2 text-xs text-slate-100">
                            <p className="text-[10px] text-slate-400 mb-1">
                              ServerMate Bot{" "}
                              <span className="bg-indigo-600 px-1 text-[9px] uppercase text-white ml-1">
                                BOT
                              </span>{" "}
                              · Today
                            </p>

                            <p className="font-semibold">{embedTitle}</p>
                            <p className="mt-1 whitespace-pre-wrap">
                              {embedDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* --------- TROPHY TIERS -------- */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5">
            <p className="text-sm font-semibold text-slate-100">Trophy Tiers</p>

            <div className="mt-4 space-y-3">
              {tiers.map((tier) => {
                const expanded = expandedTierId === tier.id;
                const tierDesc = getTierDescription(actionType, tier.count);

                return (
                  <div
                    key={tier.id}
                    className={[
                      "rounded-lg border bg-[#151927]",
                      expanded
                        ? "border-[#2563eb] shadow-[0_0_0_1px_rgba(37,99,235,0.6)]"
                        : "border-transparent"
                    ].join(" ")}
                  >
                    {/* Header */}
                    <button
                      onClick={() =>
                        setExpandedTierId(expanded ? "" : tier.id)
                      }
                      className="flex w-full items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <TierIcon tierId={tier.id} />
                        <div>
                          <p className="text-xs text-slate-100 font-semibold">
                            {tier.label}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {tierDesc}
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

                    {/* Body */}
                    {expanded && (
                      <div className="border-t border-slate-800 px-4 pb-4 pt-3">
                        {/* Count */}
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800">
                            Customize badge
                          </button>

                          <div className="w-full max-w-xs space-y-1">
                            <p className="text-[11px] uppercase text-slate-500 font-semibold">
                              Count
                            </p>
                            <input
                              type="number"
                              value={tier.count}
                              onChange={(e) =>
                                handleTierChange(tier.id, {
                                  count: Number(e.target.value || 0)
                                })
                              }
                              className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>

                        {/* REWARDS */}
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase text-slate-500 font-semibold">
                            Rewards
                          </p>

                          {/* GIVE ROLE */}
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
                                  id: `${tier.id}-give`,
                                  roleId: tier.rewards.giveRoleId
                                }}
                                roles={roles}
                                loading={rolesLoading}
                                updateButton={(id, key, value) =>
                                  handleRewardRoleUpdate(
                                    tier.id,
                                    id,
                                    key,
                                    value
                                  )
                                }
                              />
                            </div>
                          </RewardToggleRow>

                          {/* REMOVE ROLE */}
                          <RewardToggleRow
                            label="Remove a role for achieving"
                            enabled={tier.rewards.removeRole}
                            onChange={() =>
                              handleTierRewardToggle(tier.id, "removeRole")
                            }
                          >
                            <div className="mt-2 max-w-xs">
                              <RoleDropdown
                                btn={{
                                  id: `${tier.id}-remove`,
                                  roleId: tier.rewards.removeRoleId
                                }}
                                roles={roles}
                                loading={rolesLoading}
                                updateButton={(id, key, value) =>
                                  handleRewardRoleUpdate(
                                    tier.id,
                                    id,
                                    key,
                                    value
                                  )
                                }
                              />
                            </div>
                          </RewardToggleRow>

                          {/* XP */}
                          <RewardToggleRow
                            label="Give XP for achieving"
                            enabled={tier.rewards.giveXP}
                            onChange={() =>
                              handleTierRewardToggle(tier.id, "giveXP")
                            }
                          />

                          {/* COINS */}
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

          {/* -------- SETTINGS ------- */}
          <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5">
            <p className="text-sm font-semibold text-slate-100 mb-3">
              Settings
            </p>

            <div className="space-y-3">
              <SettingRow
                label="Don't track past progress"
                description="Only track new progress from now on"
                enabled={settings.dontTrackPast}
                onToggle={(v) =>
                  setSettings((prev) => ({ ...prev, dontTrackPast: v }))
                }
              />

              <SettingRow
                label="Set deadline"
                description="Achievement ends on chosen date"
                enabled={settings.setDeadline}
                onToggle={(v) =>
                  setSettings((prev) => ({ ...prev, setDeadline: v }))
                }
                extra={
                  <input
                    type="date"
                    value={settings.deadline}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        deadline: e.target.value
                      }))
                    }
                    className="mt-2 w-full max-w-xs rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                  />
                }
              />

              <SettingRow
                label="Send 'Almost there'"
                description="Notify members at 75% progress"
                enabled={settings.almostThere}
                onToggle={(v) =>
                  setSettings((prev) => ({ ...prev, almostThere: v }))
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------
 * SMALL COMPONENTS
 * ------------------------------------------ */

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        enabled ? "bg-[#2563eb]" : "bg-slate-700"
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-4" : "translate-x-1"
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

  if (tierId === "bronze")
    return (
      <div className={base + " text-amber-300 border border-amber-500/40"}>
        🥉
      </div>
    );

  if (tierId === "silver")
    return (
      <div className={base + " text-slate-200 border border-slate-400/60"}>
        🥈
      </div>
    );

  if (tierId === "gold")
    return (
      <div className={base + " text-yellow-200 border border-yellow-400/70"}>
        🥇
      </div>
    );

  if (tierId === "diamond")
    return (
      <div className={base + " text-cyan-200 border border-cyan-400/70"}>
        💎
      </div>
    );

  return <div className={base}>🏆</div>;
}

function getTierDescription(actionType, count) {
  const c = Number(count) || 0;

  switch (actionType) {
    case "messages":
      return `Send ${c} message${c === 1 ? "" : "s"}`;
    case "reactions":
      return `Add ${c} reaction${c === 1 ? "" : "s"} to messages`;
    case "voice":
      return `Spend ${c} minute${c === 1 ? "" : "s"} in voice channels`;
    case "threads":
      return `Create ${c} thread${c === 1 ? "" : "s"}`;
    default:
      return `Reach ${c}`;
  }
}
