"use client";

import { useState } from "react";
import AchievementsTabs from "@/components/achievements/AchievementsTabs";
import { ChevronDown } from "lucide-react";

export default function AchievementsConfigurationPage({ params }) {
  const { guildId } = params;
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  // SETTINGS STATE
  const [settings, setSettings] = useState({
    enabled: true,
    levelUpPopups: true,
    allowDMs: false,
    defaultCoins: 100,
    cooldown: 10,
  });

  function handleSave() {
    if (saveState === "saving") return;
    setSaveState("saving");

    setTimeout(() => {
      setSaveState("saved");

      setTimeout(() => {
        setSaveState("idle");
      }, 1500);
    }, 900);
  }

  const buttonLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
      ? "Saved!"
      : "Save settings";

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Achievements</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure global achievement behavior & rewards.
        </p>
      </div>

      <AchievementsTabs guildId={guildId} activeTab="configuration" />

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ============================ */}
        {/* GLOBAL SETTINGS PANEL        */}
        {/* ============================ */}
        <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              Global settings
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            <ConfigToggleRow
              label="Enable achievements"
              description="Turn the achievements system on or off for your entire server"
              enabled={settings.enabled}
              onChange={() =>
                setSettings((s) => ({ ...s, enabled: !s.enabled }))
              }
            />

            <ConfigToggleRow
              label="Show level-up popups"
              description="Display a popup when a member levels up an achievement tier"
              enabled={settings.levelUpPopups}
              onChange={() =>
                setSettings((s) => ({ ...s, levelUpPopups: !s.levelUpPopups }))
              }
            />

            <ConfigToggleRow
              label="Allow DMs for reward messages"
              description="Send members a private DM when they unlock an achievement reward"
              enabled={settings.allowDMs}
              onChange={() =>
                setSettings((s) => ({ ...s, allowDMs: !s.allowDMs }))
              }
            />
          </div>
        </section>

        {/* ============================ */}
        {/* REWARD DEFAULTS PANEL        */}
        {/* ============================ */}
        <section className="rounded-xl border border-slate-900 bg-[#10141f] p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              Reward defaults
            </h2>
          </div>

          <div className="mt-4 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Coins per achievement
              </p>
              <input
                type="number"
                value={settings.defaultCoins}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    defaultCoins: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cooldown for unlock messages (seconds)
              </p>
              <input
                type="number"
                value={settings.cooldown}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    cooldown: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </section>
      </div>

      {/* SAVE BUTTON */}
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

/* ===================================================== */
/* COMPONENTS                                            */
/* ===================================================== */

function ConfigToggleRow({ label, description, enabled, onChange }) {
  return (
    <div className="rounded-lg bg-[#151927] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-100">{label}</p>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>

        <Toggle enabled={enabled} onChange={onChange} />
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
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
}
