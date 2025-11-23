"use client";

import { useState } from "react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";

export default function AchievementsConfigurationPage({ params }) {
  const { guildId } = params;
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  function handleSave() {
    if (saveState === "saving") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 1000);
  }

  const buttonLabel =
    saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved!" : "Save settings";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Achievements</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure how achievements behave in your server.
        </p>
      </div>

      <AchievementsTabs guildId={guildId} activeTab="configuration" />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-slate-200">
            Global settings
          </h2>

          <label className="flex items-center justify-between gap-4 text-sm text-slate-200">
            <span>Enable achievements</span>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>

          <label className="flex items-center justify-between gap-4 text-sm text-slate-200">
            <span>Show level-up popups</span>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>

          <label className="flex items-center justify-between gap-4 text-sm text-slate-200">
            <span>Allow DMs for reward messages</span>
            <input type="checkbox" className="h-4 w-4" />
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-slate-200">
            Reward defaults
          </h2>

          <div className="space-y-3 text-sm">
            <label className="block">
              <span className="text-slate-300">Coins per achievement</span>
              <input
                type="number"
                defaultValue={100}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="block">
              <span className="text-slate-300">
                Cooldown between unlock messages (seconds)
              </span>
              <input
                type="number"
                defaultValue={10}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </label>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition
            ${
              saveState === "saved"
                ? "bg-emerald-500 text-slate-950"
                : "bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-60"
            }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
