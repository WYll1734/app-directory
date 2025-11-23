"use client";

import { useState } from "react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";
import { ChevronDown } from "lucide-react";

export default function AchievementsConfigurationPage({ params }) {
  const { guildId } = params;

  // ===========================================================
  // STATE
  // ===========================================================
  const [announcementChannel, setAnnouncementChannel] = useState("current");
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [fallbackDestination, setFallbackDestination] = useState("dm");
  const [coins, setCoins] = useState(100);
  const [cooldown, setCooldown] = useState(10);

  const [embedTitle, setEmbedTitle] = useState(
    "GG {player}, you just unlocked the achievement:"
  );
  const [embedDesc, setEmbedDesc] = useState("{achievement} 🎉");

  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  function handleSave() {
    if (saveState === "saving") return;
    setSaveState("saving");

    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 900);
  }

  const buttonLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
      ? "Saved!"
      : "Save settings";

  // ===========================================================
  // SMALL COMPONENTS
  // ===========================================================
  const Toggle = ({ enabled, setEnabled }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? "bg-indigo-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );

  const SelectBox = ({ value, onChange, options }) => (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-slate-900">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
    </div>
  );

  // ===========================================================
  // PAGE UI
  // ===========================================================
  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Achievements</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure how achievements behave in your server.
        </p>
      </div>

      <AchievementsTabs guildId={guildId} activeTab="configuration" />

      {/* MAIN GRID */}
      <div className="space-y-8">
        {/* =============== GENERAL ANNOUNCEMENT SECTION =============== */}
        <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">General</h2>

          {/* Achievement announcement */}
          <div className="space-y-1 mb-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Achievement announcement
            </p>

            <SelectBox
              value={announcementChannel}
              onChange={setAnnouncementChannel}
              options={[
                { label: "Current channel", value: "current" },
                { label: "Use fallback only", value: "fallback" },
              ]}
            />
          </div>

          {/* Fallback toggle */}
          <div className="mt-4 space-y-1 rounded-lg bg-[#121622] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-100 font-medium">
                  Enable fallback announcement
                </p>
                <p className="text-xs text-slate-400">
                  Sends announcements when there’s no current channel context
                </p>
              </div>
              <Toggle
                enabled={fallbackEnabled}
                setEnabled={setFallbackEnabled}
              />
            </div>

            {/* Fallback destination dropdown */}
            {fallbackEnabled && (
              <div className="mt-4">
                <p className="text-[11px] uppercase text-slate-400 mb-1">
                  Fallback destination
                </p>
                <SelectBox
                  value={fallbackDestination}
                  onChange={setFallbackDestination}
                  options={[
                    { value: "dm", label: "Send DM message" },
                    { value: "server", label: "Send in server channel" },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Default Unlock Message */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-slate-200">
              Default Unlock Message
            </h3>
            <p className="text-xs text-slate-400">
              This message is used for all achievements unless overridden.
            </p>

            {/* Preview Box */}
            <div className="flex items-start gap-3 rounded-lg bg-[#0b0e17] p-3 border border-slate-800 mt-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500" />
              <div className="text-xs text-slate-100 space-y-1">
                <p className="text-[10px] text-slate-400">
                  ServerMate Bot · Today
                </p>
                <p className="font-semibold">{embedTitle}</p>
                <p className="whitespace-pre-wrap">{embedDesc}</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-3 mt-3">
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100"
                value={embedTitle}
                onChange={(e) => setEmbedTitle(e.target.value)}
              />
              <textarea
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100"
                value={embedDesc}
                onChange={(e) => setEmbedDesc(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* =============== REWARD DEFAULTS SECTION =============== */}
        <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">
            Reward defaults
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-slate-300 text-sm mb-1">
                Coins per achievement
              </p>
              <input
                type="number"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100"
              />
            </div>

            <div>
              <p className="text-slate-300 text-sm mb-1">
                Cooldown between unlock messages (seconds)
              </p>
              <input
                type="number"
                value={cooldown}
                onChange={(e) => setCooldown(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
          </div>
        </section>

        {/* =============== RESET PROGRESS SECTION =============== */}
        <section className="rounded-xl border border-red-900/40 bg-red-950/20 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-red-300 mb-2">
            Reset progress
          </h2>
          <p className="text-xs text-red-400 mb-4">
            All member progress on achievements will be reset. Your achievement
            settings will remain.
          </p>

          <button className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500">
            Reset progress
          </button>
        </section>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            saveState === "saved"
              ? "bg-emerald-500 text-slate-900"
              : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
