"use client";

import { useState } from "react";
import Image from "next/image";

// Injected tier icons
const tierIcons = {
  bronze: "/mnt/data/icon_bronze.png",
  silver: "/mnt/data/icon_silver.png",
  gold: "/mnt/data/icon_gold.png",
  diamond: "/mnt/data/icon_diamond.png",
};

export default function AchievementEditor({ params }) {
  const { guildId, achievementId } = params;

  // Placeholder — later replaced by DB values
  const achievement = {
    title: "King of Spam",
    desc: "Send messages",
    tiers: {
      bronze: { count: 20, giveRole: false, removeRole: false, giveXP: false, giveCoins: false },
      silver: { count: 100, giveRole: false, removeRole: false, giveXP: false, giveCoins: false },
      gold: { count: 500, giveRole: false, removeRole: false, giveXP: false, giveCoins: false },
      diamond: { count: 1000, giveRole: false, removeRole: false, giveXP: false, giveCoins: false },
    },
  };

  const [tiers, setTiers] = useState(achievement.tiers);

  const [openTier, setOpenTier] = useState(null);

  const tierOrder = ["bronze", "silver", "gold", "diamond"];

  const pretty = {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    diamond: "Diamond",
  };

  const toggleTier = (tier) => {
    setOpenTier((prev) => (prev === tier ? null : tier));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white">{achievement.title}</h1>
        <p className="text-slate-400 mt-1">Configure this achievement’s progress, action and trophy tiers.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 pb-2">
        <div className="text-indigo-400 border-b-2 border-indigo-500 pb-1 cursor-pointer">Achievements</div>
        <div className="text-slate-400 pb-1 cursor-pointer hover:text-slate-200">Configuration</div>
        <div className="text-slate-400 pb-1 cursor-pointer hover:text-slate-200">Commands</div>
      </div>

      {/* Trophy Tiers */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6 space-y-4">
        <h2 className="text-lg text-slate-200 font-semibold">Trophy Tiers</h2>

        {tierOrder.map((tier) => (
          <div key={tier} className="border border-slate-800 rounded-xl bg-slate-900/60">
            {/* Header row */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/80 transition"
              onClick={() => toggleTier(tier)}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={tierIcons[tier]}
                  width={32}
                  height={32}
                  alt={pretty[tier]}
                  className="rounded"
                />

                <div>
                  <p className="text-white font-semibold">{pretty[tier]}</p>
                  <p className="text-slate-400 text-sm">Send {tiers[tier].count} messages</p>
                </div>
              </div>

              <span className="text-slate-500">{openTier === tier ? "▲" : "▼"}</span>
            </div>

            {/* Expanded panel */}
            {openTier === tier && (
              <div className="p-5 border-t border-slate-800 space-y-5 animate-fadeIn">
                {/* Count */}
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Count</label>
                  <input
                    type="number"
                    value={tiers[tier].count}
                    onChange={(e) =>
                      setTiers((prev) => ({
                        ...prev,
                        [tier]: { ...prev[tier], count: Number(e.target.value) },
                      }))
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full"
                  />
                </div>

                {/* Rewards */}
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Rewards</label>

                  <div className="space-y-3">
                    {["giveRole", "removeRole", "giveXP", "giveCoins"].map((reward) => (
                      <div key={reward} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">
                          {
                            {
                              giveRole: "Give a role for achieving",
                              removeRole: "Remove a role for achieving",
                              giveXP: "Give XP for achieving",
                              giveCoins: "Give coins for achieving",
                            }[reward]
                          }
                        </span>

                        {/* Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={tiers[tier][reward]}
                            onChange={() =>
                              setTiers((prev) => ({
                                ...prev,
                                [tier]: { ...prev[tier], [reward]: !prev[tier][reward] },
                              }))
                            }
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-checked:bg-blue-500 rounded-full transition-all"></div>
                          <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
          Save
        </button>
      </div>
    </div>
  );
}
