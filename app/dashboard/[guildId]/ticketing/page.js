"use client";

import Link from "next/link";
import { PlusCircle, Settings, FolderKanban } from "lucide-react";

export default function TicketingPage({ params }) {
  const { guildId } = params;

  return (
    <div className="p-6 space-y-8">

      {/* =======================================================
          HEADER
      ======================================================= */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          🎫 Ticketing
        </h1>
        <p className="text-slate-400">
          Manage all your server tickets, support panels and ticket settings.
        </p>
      </div>

      {/* =======================================================
          GRID LAYOUT — 3 MODULE CARDS
      ======================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* ---------------------------------------------------
            CREATE PANEL CARD
        --------------------------------------------------- */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <PlusCircle className="w-7 h-7" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white">Create a Ticket Panel</h2>
          <p className="text-slate-400 text-sm">
            Build a custom ticket panel that members can click to open tickets.
          </p>

          <Link
            href={`/dashboard/${guildId}/ticketing/new`}
            className="inline-flex mt-2 items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all"
          >
            Create New Panel
          </Link>
        </div>

        {/* ---------------------------------------------------
            VIEW EXISTING PANELS
        --------------------------------------------------- */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 space-y-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl inline-flex">
            <FolderKanban className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-semibold text-white">Manage Panels</h2>
          <p className="text-slate-400 text-sm">
            View, edit or delete your existing ticket panels.
          </p>

          <Link
            href={`/dashboard/${guildId}/ticketing/panels`}
            className="inline-flex mt-2 items-center justify-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            View Panels
          </Link>
        </div>

        {/* ---------------------------------------------------
            SETTINGS CARD
        --------------------------------------------------- */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 space-y-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl inline-flex">
            <Settings className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-semibold text-white">Ticket Settings</h2>
          <p className="text-slate-400 text-sm">
            Configure categories, transcripts, auto-closings and more.
          </p>

          <Link
            href={`/dashboard/${guildId}/ticketing/settings`}
            className="inline-flex mt-2 items-center justify-center px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all"
          >
            Configure Settings
          </Link>
        </div>

      </div>
    </div>
  );
}
