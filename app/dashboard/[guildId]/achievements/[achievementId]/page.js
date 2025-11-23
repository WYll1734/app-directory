"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

const mockAchievements = [
  {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send messages",
    baseAction: "Member sends {count} messages",
    tiers: [
      { id: "bronze", name: "Bronze", requirement: "Send 20 messages", count: 20 },
      { id: "silver", name: "Silver", requirement: "Send 100 messages", count: 100 },
      { id: "gold", name: "Gold", requirement: "Send 500 messages", count: 500 },
      { id: "diamond", name: "Diamond", requirement: "Send 1000 messages", count: 1000 },
    ],
  },
];

function SaveButton({ onClick, saving, saved }) {
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
      {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center shrink-0">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="peer h-5 w-9 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
      <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white peer-checked:translate-x-4 transition-all shadow"></div>
    </label>
  );
}

export default function AchievementEditorPage({ params }) {
  const { guildId, achievementId } = params;

  const baseAchievement = useMemo(
    () => mockAchievements.find((a) => a.id === achievementId) ?? mockAchievements[0],
    [achievementId]
  );

  const [achievement, setAchievement] = useState(baseAchievement);
  const [overrideMessage, setOverrideMessage] = useState(false);
  const [overrideContent, setOverrideContent] = useState("");
  const [openTierId, setOpenTierId] = useState("bronze");

  const [dontTrackPast, setDontTrackPast] = useState(true);
  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const [almostThere, setAlmostThere] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fakeSave = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 800);
  };

  const updateTierCount = (id, value) => {
    setAchievement((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) =>
        t.id === id ? { ...t, count: value } : t
      ),
    }));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header + Tabs */}
      <div className="space-y-4">
        {/* Top row: back + title + buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/${guildId}/achievements`}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800"
            >
              <ChevronLeft size={16} className="text-slate-300" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <input
                  className="bg-transparent border-none outline-none text-xl md:text-2xl font-semibold text-white"
                  value={achievement.name}
                  onChange={(e) =>
                    setAchievement((a) => ({ ...a, name: e.target.value }))
                  }
                />
                <span className="text-xs text-slate-500">✏️</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure this achievement&apos;s progress, action and trophy tiers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/90 hover:bg-red-600 text-white">
              Delete
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100">
              Reset Progress
            </button>
            <SaveButton onClick={fakeSave} saving={saving} saved={saved} />
          </div>
        </div>

        {/* Tabs */}
        <AchievementsTabs guildId={guildId} activeTab="achievements" />
      </div>

      {/* Main body */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Achievement progress card */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Achievement progress
            </h3>
            <p className="text-xs text-slate-400">
              Check how many members unlocked this achievement
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "0%" }} />
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

            {/* Action dropdown */}
            <div className="w-full max-w-md">
              <select
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100"
                value={achievement.baseAction}
                onChange={(e) =>
                  setAchievement((a) => ({ ...a, baseAction: e.target.value }))
                }
              >
                <option>Member sends {"{count}"} messages</option>
                <option>Member reacts to {"{count}"} messages</option>
                <option>Member spends {"{minutes}"} minutes in voice</option>
                <option>Member creates {"{count}"} threads</option>
              </select>
            </div>

            {/* Override message toggle */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Override announcement message
                  </div>
                  <div className="text-[11px] text-slate-400 max-w-md">
                    Override the default configuration message with a custom
                    message for this achievement.
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

          {/* Trophy Tiers */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">
              Trophy Tiers
            </h3>

            <div className="space-y-2">
              {achievement.tiers.map((tier) => {
                const open = openTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden"
                  >
                    {/* Header row */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/70 transition"
                      onClick={() =>
                        setOpenTierId((prev) =>
                          prev === tier.id ? "" : tier.id
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700" />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-100">
                            {tier.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {tier.requirement}
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

                    {/* Expanded content */}
                    {open && (
                      <div className="px-4 pb-4 pt-3 space-y-5 border-t border-slate-800">
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
                              updateTierCount(
                                tier.id,
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>

                        {/* Rewards toggles */}
                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-slate-300">
                            Rewards
                          </div>

                          <div className="space-y-2 text-xs text-slate-200">
                            <div className="flex items-center justify-between gap-4">
                              <span>Give a role for achieving</span>
                              <Toggle
                                checked={false}
                                onChange={() => {}}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span>Remove a role for achieving</span>
                              <Toggle
                                checked={false}
                                onChange={() => {}}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span>Give XP for achieving</span>
                              <Toggle
                                checked={false}
                                onChange={() => {}}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span>Give coins for achieving</span>
                              <Toggle
                                checked={false}
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column – Settings */}
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">
                Settings
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">Don&apos;t track past progress</div>
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
