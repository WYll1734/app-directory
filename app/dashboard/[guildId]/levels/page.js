"use client";

import { useState } from "react";
import RoleDropdown from "@/components/inputs/RoleDropdown";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";

export default function LevelsPage({ params }) {
  const { guildId } = params;

  // Example roles (replace with API data later)
  const roles = [
    { id: "1", name: "Bronze" },
    { id: "2", name: "Silver" },
    { id: "3", name: "Gold" },
    { id: "4", name: "Platinum" },
  ];

  // Example channels (replace with real guild channels later)
  const channels = [
    { id: "10", name: "general", type: 0 },
    { id: "11", name: "bot-commands", type: 0 },
    { id: "12", name: "level-up", type: 0 },
    { id: "20", name: "Voice 1", type: 2 },
  ];

  // ===================================
  // LEVEL SYSTEM ENABLED
  // ===================================
  const [enabled, setEnabled] = useState(true);

  // ===================================
  // XP SETTINGS
  // ===================================
  const [xpSettings, setXpSettings] = useState({
    min: 15,
    max: 25,
    cooldown: 60,
    multiplier: 1.0,
  });

  // ===================================
  // LEVEL-UP MESSAGE SETTINGS
  // ===================================
  const [levelMessage, setLevelMessage] = useState({
    enabled: true,
    message: "GG {user}, you reached **Level {level}**! 🎉",
    channel: null,
  });

  // ===================================
  // REWARD ROLES
  // ===================================
  const [rewards, setRewards] = useState([
    { id: "r1", level: 5, roleId: "1" },
    { id: "r2", level: 10, roleId: "2" },
    { id: "r3", level: 20, roleId: "3" },
  ]);

  // Add reward
  const addReward = () => {
    setRewards([...rewards, { id: crypto.randomUUID(), level: 1, roleId: "" }]);
  };

  // Update reward
  const updateReward = (id, field, value) => {
    setRewards(
      rewards.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  // Delete reward
  const deleteReward = (id) => {
    setRewards(rewards.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-semibold text-white">Levels</h1>
      <p className="text-slate-400">Manage XP, announcement messages & reward roles.</p>

      {/* =================================================== */}
      {/* GENERAL SETTINGS */}
      {/* =================================================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          General Settings
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white font-medium">Enable Level System</span>

          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
          </label>
        </div>
      </div>

      {/* =================================================== */}
      {/* XP SETTINGS */}
      {/* =================================================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          XP & Anti-Abuse Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Min XP */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Min XP Per Message</label>
            <input
              type="number"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.min}
              onChange={(e) =>
                setXpSettings({ ...xpSettings, min: Number(e.target.value) })
              }
            />
          </div>

          {/* Max XP */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Max XP Per Message</label>
            <input
              type="number"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.max}
              onChange={(e) =>
                setXpSettings({ ...xpSettings, max: Number(e.target.value) })
              }
            />
          </div>

          {/* Cooldown */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">XP Cooldown (seconds)</label>
            <input
              type="number"
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
              value={xpSettings.cooldown}
              onChange={(e) =>
                setXpSettings({ ...xpSettings, cooldown: Number(e.target.value) })
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
                setXpSettings({ ...xpSettings, multiplier: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* LEVEL UP MESSAGE */}
      {/* =================================================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Level-Up Message Settings
        </h2>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Enable Level-Up Messages</span>

          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={levelMessage.enabled}
              onChange={() =>
                setLevelMessage({ ...levelMessage, enabled: !levelMessage.enabled })
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
          </label>
        </div>

        {/* Message */}
        <textarea
          className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-white text-sm h-28 resize-none"
          value={levelMessage.message}
          onChange={(e) =>
            setLevelMessage({ ...levelMessage, message: e.target.value })
          }
        ></textarea>

        {/* Channel Dropdown */}
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Send To Channel</label>

          <ChannelDropdown
            channels={channels}
            value={levelMessage.channel}
            onChange={(ch) =>
              setLevelMessage({ ...levelMessage, channel: ch })
            }
          />
        </div>
      </div>

      {/* =================================================== */}
      {/* REWARD ROLES */}
      {/* =================================================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Level Rewards
          </h2>

          <button
            onClick={addReward}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-medium rounded-lg text-white"
          >
            + Add Reward
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="relative p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4"
            >
              {/* DELETE BUTTON */}
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
                  loading={false}
                  updateButton={updateReward}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
