"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewTicketPanelPage({ params }) {
  const { guildId } = params;

  // =======================================================
  // SAVE BUTTON LOGIC (Save → Saving → Saved)
  // =======================================================
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const runSave = () => {
    if (saving) return;

    setSaving(true);
    setSaved(false);

    // later: call API here
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 1000);
  };

  // =======================================================
  // PANEL + EMBED STATE
  // =======================================================
  const [panelName, setPanelName] = useState("");

  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "Click the button below to open a support ticket.",
    footerText: "ServerMate Ticket System",
  });

  const updateEmbed = (field, value) =>
    setEmbed((prev) => ({ ...prev, [field]: value }));

  // ticket transcript settings
  const [dmTranscript, setDmTranscript] = useState(false);

  return (
    <div className="p-6 space-y-8">
      {/* =======================================================
          BACK BUTTON + TITLE
      ======================================================= */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/${guildId}/ticketing`}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white">New Ticket Panel</h1>
          <p className="text-slate-400">
            Create your server&apos;s support ticket panel.
          </p>
        </div>
      </div>

      {/* =======================================================
          MAIN CARD: FORM + PREVIEW (2 COLUMN)
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
        {/* Panel Name (full width) */}
        <div className="space-y-2">
          <label className="font-medium text-slate-200">Panel Name</label>
          <input
            type="text"
            value={panelName}
            onChange={(e) => setPanelName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Support Tickets"
          />
        </div>

        {/* Editor + Preview grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* ---------------------------------------------------
              LEFT: EMBED CONFIG
          --------------------------------------------------- */}
          <div className="space-y-5">
            {/* Embed Color */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">Embed Color</label>
              <input
                type="color"
                value={embed.color}
                onChange={(e) => updateEmbed("color", e.target.value)}
                className="h-10 w-16 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
              />
            </div>

            {/* Embed Title */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">Embed Title</label>
              <input
                type="text"
                value={embed.title}
                onChange={(e) => updateEmbed("title", e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
                placeholder="Need help?"
              />
            </div>

            {/* Embed Description */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">
                Embed Description
              </label>
              <textarea
                value={embed.description}
                onChange={(e) => updateEmbed("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 min-h-[140px]"
                placeholder="Click the button below to open a support ticket."
              />
            </div>

            {/* Footer Text */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">Footer Text</label>
              <input
                type="text"
                value={embed.footerText}
                onChange={(e) => updateEmbed("footerText", e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
                placeholder="ServerMate Ticket System"
              />
            </div>

            {/* Target Channel */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">
                Send Panel To Channel
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option>Loading channels… (hook later)</option>
              </select>
            </div>
          </div>

          {/* ---------------------------------------------------
              RIGHT: LIVE DISCORD-LIKE PREVIEW
          --------------------------------------------------- */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">
              Preview
            </p>

            {/* Fake Discord message container */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 shadow-inner">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="mt-1 h-10 w-10 rounded-full bg-slate-700" />

                <div className="flex-1 space-y-3">
                  {/* Username row */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-white">
                      ServerMate
                    </span>
                    <span className="rounded-sm bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      BOT
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Today at 9:12 AM
                    </span>
                  </div>

                  {/* Embed */}
                  <div className="rounded-lg bg-slate-900 border border-slate-800 flex overflow-hidden">
                    {/* Color bar */}
                    <div
                      className="w-1"
                      style={{ backgroundColor: embed.color || "#5865F2" }}
                    />

                    <div className="flex-1 p-3 space-y-2">
                      {embed.title && (
                        <div className="font-semibold text-white">
                          {embed.title}
                        </div>
                      )}

                      {embed.description && (
                        <div className="text-sm text-slate-100 whitespace-pre-wrap">
                          {embed.description}
                        </div>
                      )}

                      {embed.footerText && (
                        <div className="pt-2 text-[11px] text-slate-400">
                          {embed.footerText}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fake button */}
                  <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-xs font-medium text-white transition">
                    Create Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          TICKET INTRODUCTION MESSAGE
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Ticket introduction message
          </h2>
          <span className="text-slate-500 text-xs">▾</span>
        </div>

        <div className="h-px bg-slate-800/80" />

        {/* Fake intro message preview */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="mt-1 h-10 w-10 rounded-full bg-slate-700" />

            <div className="flex-1 space-y-3">
              {/* Username row */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-white">
                  Random Mafia Shooter
                </span>
                <span className="rounded-sm bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  BOT
                </span>
                <span className="text-[11px] text-slate-400">
                  Today at 9:12 AM
                </span>
              </div>

              {/* Message text */}
              <div className="space-y-1 text-sm text-slate-100">
                <p>Your ticket has been created.</p>
                <p>
                  Please provide any additional info you deem relevant to help us
                  answer faster.
                </p>
              </div>
            </div>
          </div>

          <button className="mt-4 inline-flex items-center rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition">
            + Add embed
          </button>
        </div>
      </div>

      {/* =======================================================
          TICKET TRANSCRIPT SECTION
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Ticket transcript 👑
          </h2>
        </div>

        {/* Transcript channel select */}
        <div className="space-y-2">
          <label className="font-medium text-slate-200">
            Transcripts Channel<span className="text-red-500"> *</span>
          </label>
          <select className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white">
            <option># ticket-logs</option>
          </select>
        </div>

        {/* DM transcript toggle */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-sm text-slate-300">
            Send the transcript link in private to the member that created the
            ticket
          </p>

          <button
            type="button"
            onClick={() => setDmTranscript((v) => !v)}
            className={`flex h-6 w-11 items-center rounded-full border transition-all ${
              dmTranscript
                ? "border-blue-500 bg-blue-500"
                : "border-slate-600 bg-slate-800"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                dmTranscript ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* =======================================================
          SAVE BUTTON
      ======================================================= */}
      <div>
        <button
          onClick={runSave}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
            ${
              saving
                ? "bg-blue-600/60 cursor-not-allowed"
                : saved
                ? "bg-emerald-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          `}
        >
          {saving && "Saving…"}
          {!saving && !saved && (
            <>
              <Save className="w-5 h-5" /> Save Ticket Panel
            </>
          )}
          {saved && "Saved!"}
        </button>
      </div>
    </div>
  );
}
