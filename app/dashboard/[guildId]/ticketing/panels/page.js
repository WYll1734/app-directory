"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  Copy,
  PlusCircle,
  ChevronRight,
  PanelRight,
} from "lucide-react";

export default function TicketPanelsPage({ params }) {
  const { guildId } = params;

  // TEMP FAKE DATA — will be DB-driven later
  const [panels, setPanels] = useState([
    {
      id: "abc123",
      name: "Support Tickets",
      createdAt: "2025-01-17",
      channel: "general",
      buttonEmoji: "🎫",
      buttonText: "Create Ticket",
    },
    {
      id: "def456",
      name: "Staff Applications",
      createdAt: "2025-01-18",
      channel: "applications",
      buttonEmoji: "📝",
      buttonText: "Apply",
    },
  ]);

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <div className="p-6 space-y-8">
      {/* ================================================ */}
      {/* HEADER */}
      {/* ================================================ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            📂 Manage Ticket Panels
          </h1>
          <p className="text-slate-400">
            View, edit and manage all created ticket panels.
          </p>
        </div>

        <Link
          href={`/dashboard/${guildId}/ticketing/new`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          New Ticket Panel
        </Link>
      </div>

      {/* ================================================ */}
      {/* GRID LIST */}
      {/* ================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {panels.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400">
            No ticket panels created yet.
          </div>
        )}

        {panels.map((panel) => (
          <div
            key={panel.id}
            className="group relative bg-slate-900/60 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">{panel.buttonEmoji}</span>
                {panel.name}
              </h2>

              <Link
                href={`/dashboard/${guildId}/ticketing/new?edit=${panel.id}`}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <Pencil className="w-4 h-4 text-slate-300" />
              </Link>
            </div>

            {/* SUB INFO */}
            <div className="text-slate-400 text-sm space-y-1 mb-4">
              <p>
                <span className="text-slate-500">Channel:</span>{" "}
                #{panel.channel}
              </p>
              <p>
                <span className="text-slate-500">Button:</span>{" "}
                {panel.buttonEmoji} {panel.buttonText}
              </p>
              <p>
                <span className="text-slate-500">Created:</span>{" "}
                {panel.createdAt}
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-auto pt-3 flex items-center justify-between">
              <button
                onClick={() => copyId(panel.id)}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                <Copy className="w-3 h-3" />
                Copy ID
              </button>

              <button
                onClick={() => {
                  // delete button placeholder
                  setPanels((prev) =>
                    prev.filter((p) => p.id !== panel.id)
                  );
                }}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-700 text-white transition"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>

            {/* RIGHT ARROW HOVER */}
            <ChevronRight className="absolute right-4 top-4 opacity-0 group-hover:opacity-80 text-slate-500 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}
