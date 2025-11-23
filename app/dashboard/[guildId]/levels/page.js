"use client";

import { useState } from "react";

export default function LevelsPage() {
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
  });

  const [rewards, setRewards] = useState([
    { level: 5, role: "Bronze" },
    { level: 10, role: "Silver" },
    { level: 20, role: "Gold" },
  ]);

  const addReward = () => {
    setRewards([...rewards, { level: 1, role: "" }]);
  };

  const updateReward = (index, field, value) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-semibold text-white">Levels</h1>
      <p className="text-slate-400">Manage XP, level-up messages, and reward roles.</p>

      {/* =============================== */}
      {/* GENERAL SETTINGS */}
      {/* =============================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          General Settings
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-white font-medium text-sm">Enable Levels</span>

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

      {/* =============================== */}
      {/* XP / ANTI-ABUSE SETTINGS */}
      {/* =============================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          XP & Anti-Abuse
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MIN XP */}
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

          {/* MAX XP */}
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

          {/* COOLDOWN */}
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

          {/* MULTIPLIER */}
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

      {/* =============================== */}
      {/* LEVEL-UP MESSAGE SETTINGS */}
      {/* =============================== */}
      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Level-Up Message
        </h2>

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

        <textarea
          className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-white text-sm h-28 resize-none"
          value={levelMessage.message}
          onChange={(e) =>
            setLevelMessage({ ...levelMessage, message: e.target.value })
          }
        ></textarea>
      </div>

      {/* =============================== */}
      {/* ROLE REWARDS */}
      {/* =============================== */}
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
          {rewards.map((reward, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3"
            >
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Level</label>
                <input
                  type="number"
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
                  value={reward.level}
                  onChange={(e) =>
                    updateReward(i, "level", Number(e.target.value))
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Role</label>
                <input
                  type="text"
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-white"
                  placeholder="@Role"
                  value={reward.role}
                  onChange={(e) =>
                    updateReward(i, "role", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
