"use client";

import { useState } from "react";
import useSWR from "swr";
import RoleDropdown from "@/components/inputs/RoleDropdown";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";

const fetcher = (url) => fetch(url).then((r) => r.json());

// Small reusable save button with loading + success state
function SaveButton({ onClick, saving, saved, label = "Save" }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2
        ${
          saved
            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
        }`}
    >
      {saving ? "Saving..." : saved ? "Saved ✓" : label}
    </button>
  );
}

export default function LevelsPage({ params }) {
  const { guildId } = params;

  // ==============================
  // FETCH ROLES & CHANNELS
  // ==============================
  const {
    data: rolesData,
    error: rolesError,
    isLoading: rolesLoading,
  } = useSWR(`/api/discord/guilds/${guildId}/roles`, fetcher);

  const {
    data: channelsData,
    error: channelsError,
    isLoading: channelsLoading,
  } = useSWR(`/api/discord/guilds/${guildId}/channels`, fetcher);

  const roles = rolesData?.roles ?? [];
  const channels = channelsData?.channels ?? [];

  // ==============================
  // LOCAL STATE
  // ==============================

  const [enabled, setEnabled] = useState(true);

  const [xpSettings, setXpSettings] = useState({
    min: 15,
    max: 25,
    cooldown: 60,
    multiplier: 1.0,
  });

  const [levelMessage, setLevelMessage] = useState({
    enabled: true,
    message: "GG {user}, you reached **Level {level}**! 🎉",
    channel: null, // store full channel object for dropdown
  });

  const [rewards, setRewards] = useState([
    { id: "r1", level: 5, roleId: "" },
    { id: "r2", level: 10, roleId: "" },
    { id: "r3", level: 20, roleId: "" },
  ]);

  // ==============================
  // SAVE BUTTON STATE (PLACEHOLDERS)
  // ==============================

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savedGeneral, setSavedGeneral] = useState(false);

  const [savingXp, setSavingXp] = useState(false);
  const [savedXp, setSavedXp] = useState(false);

  const [savingMessage, setSavingMessage] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [savingRewards, setSavingRewards] = useState(false);
  const [savedRewards, setSavedRewards] = useState(false);

  const fakeSave = (setSaving, setSaved) => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 800);
  };

  // ==============================
  // REWARDS HELPERS
  // ==============================

  const addReward = () => {
    setRewards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), level: 1, roleId: "" },
    ]);
  };

  const updateReward = (id, field, value) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const deleteReward = (id) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-semibold text-white">Levels</h1>
      <p className="text-slate-400">
        Manage XP, level-up announcements, and reward roles for this server.
      </p>

      {/* GENERAL SETTINGS */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            General Settings
          </h2>
          <SaveButton
            label="Save Settings"
            onClick={() => fakeSave(setSavingGeneral, setSavedGeneral)}
            saving={savingGeneral}
            saved={savedGeneral}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white font-medium">
            Enable Level System
          </span>

          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={enabled}
              onChange={() => setEnabled((v) => !v)}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
          </label>
        </div>
      </div>

      {/* XP SETTINGS */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            XP & Anti-Abuse Settings
          </h2>
          <SaveButton
            label="Save XP Settings"
            onClick={() => fakeSave(setSavingXp, setSavedXp)}
            saving={savingXp}
            saved={savedXp}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Min XP */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">
              Min XP Per Message
            </label>
            <input
              type="number"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.min}
              onChange={(e) =>
                setXpSettings((s) => ({
                  ...s,
                  min: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Max XP */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">
              Max XP Per Message
            </label>
            <input
              type="number"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.max}
              onChange={(e) =>
                setXpSettings((s) => ({
                  ...s,
                  max: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Cooldown */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">
              XP Cooldown (seconds)
            </label>
            <input
              type="number"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.cooldown}
              onChange={(e) =>
                setXpSettings((s) => ({
                  ...s,
                  cooldown: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Multiplier */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">XP Multiplier</label>
            <input
              type="number"
              step="0.1"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.multiplier}
              onChange={(e) =>
                setXpSettings((s) => ({
                  ...s,
                  multiplier: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* LEVEL-UP MESSAGE */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Level-Up Message
          </h2>
          <SaveButton
            label="Save Level-Up Message"
            onClick={() => fakeSave(setSavingMessage, setSavedMessage)}
            saving={savingMessage}
            saved={savedMessage}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white">
            Enable Level-Up Messages
          </span>

          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={levelMessage.enabled}
              onChange={() =>
                setLevelMessage((m) => ({ ...m, enabled: !m.enabled }))
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
          </label>
        </div>

        {/* Message textarea */}
        <textarea
          className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-white text-sm h-28 resize-none"
          value={levelMessage.message}
          onChange={(e) =>
            setLevelMessage((m) => ({ ...m, message: e.target.value }))
          }
        />

        {/* Channel selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">Send To Channel</label>
          <ChannelDropdown
            channels={channels}
            value={levelMessage.channel}
            onChange={(ch) =>
              setLevelMessage((m) => ({ ...m, channel: ch }))
            }
          />
          {channelsLoading && (
            <p className="text-xs text-slate-500">Loading channels…</p>
          )}
          {channelsError && (
            <p className="text-xs text-red-400">
              Failed to load channels.
            </p>
          )}
        </div>
      </div>

      {/* LEVEL REWARDS */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Level Rewards
          </h2>

        <div className="flex items-center gap-3">
          <SaveButton
            label="Save Rewards"
            onClick={() => fakeSave(setSavingRewards, setSavedRewards)}
            saving={savingRewards}
            saved={savedRewards}
          />
          <button
            onClick={addReward}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-100"
          >
            + Add Reward
          </button>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="relative p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4"
            >
              {/* DELETE */}
              <button
                onClick={() => deleteReward(reward.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-500 text-xs"
              >
                ✕
              </button>

              {/* LEVEL */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Level</label>
                <input
                  type="number"
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
                  value={reward.level}
                  onChange={(e) =>
                    updateReward(reward.id, "level", Number(e.target.value))
                  }
                />
              </div>

              {/* ROLE DROPDOWN */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Role Reward</label>
                <RoleDropdown
                  btn={reward}
                  roles={roles}
                  loading={rolesLoading}
                  updateButton={updateReward}
                />
                {rolesLoading && (
                  <p className="text-xs text-slate-500 mt-1">Loading roles…</p>
                )}
                {rolesError && (
                  <p className="text-xs text-red-400 mt-1">
                    Failed to load roles.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
