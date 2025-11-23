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

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setTimeout(() => setSaved(false), 1500);
    }, 1000);
  };

  // =======================================================
  // PANEL NAME STATE
  // =======================================================
  const [panelName, setPanelName] = useState("");

  // =======================================================
  // EMBED STATE
  // =======================================================
  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "",
    footerText: "",
  });

  const updateEmbed = (field, value) =>
    setEmbed((prev) => ({ ...prev, [field]: value }));

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
          <p className="text-slate-400">Create your server's support ticket panel.</p>
        </div>
      </div>

      {/* =======================================================
          MAIN CARD
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">

        {/* Panel Name */}
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
          <label className="font-medium text-slate-200">Embed Description</label>
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
          <label className="font-medium text-slate-200">Send Panel To Channel</label>
          <select
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
          >
            <option>Loading channels… (hook later)</option>
          </select>
        </div>

      </div>

      {/* =======================================================
          SAVE BUTTON
      ======================================================= */}
      <div>
        <button
          onClick={runSave}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
            ${saving ? "bg-blue-600/60 cursor-not-allowed" :
              saved ? "bg-emerald-600" :
              "bg-emerald-600 hover:bg-emerald-700"}
          `}
        >
          {saving && (
            <>
              <span className="loader mr-2 border-white"></span> Saving…
            </>
          )}
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
