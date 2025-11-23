"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function TicketPanelsPage({ params }) {
  const { guildId } = params;

  // Placeholder data — replace with API call later
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    // Fake placeholder (delete once API exists)
    setPanels([
      {
        id: "support-main",
        name: "Support Tickets",
        description: "General support for members.",
        color: "#5865F2",
      },
      {
        id: "staff-help",
        name: "Staff Helpdesk",
        description: "Internal staff ticket panel.",
        color: "#43B581",
      },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-8">

      {/* =======================================================
          BACK BUTTON + HEADER
      ======================================================= */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/${guildId}/ticketing`}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white">Ticket Panels</h1>
          <p className="text-slate-400">View and manage all ticket panels you’ve created.</p>
        </div>
      </div>

      {/* =======================================================
          CREATE NEW PANEL BUTTON
      ======================================================= */}
      <Link
        href={`/dashboard/${guildId}/ticketing/new`}
        className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition"
      >
        <PlusCircle className="w-5 h-5" />
        Create New Panel
      </Link>

      {/* =======================================================
          PANELS GRID
      ======================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {panels.length === 0 && (
          <p className="text-slate-400">No ticket panels created yet.</p>
        )}

        {panels.map((panel) => (
          <div
            key={panel.id}
            className="bg-slate-900/60 border border-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            {/* Color bar */}
            <div
              className="w-full h-2 rounded-xl mb-2"
              style={{ backgroundColor: panel.color }}
            />

            {/* Panel name */}
            <h2 className="text-xl font-semibold text-white">{panel.name}</h2>
            <p className="text-slate-400 text-sm">{panel.description}</p>

            {/* Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <Link
                href={`/dashboard/${guildId}/ticketing/panel/${panel.id}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center gap-2 transition"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>

              <button
                onClick={() =>
                  setPanels((prev) => prev.filter((p) => p.id !== panel.id))
                }
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium flex items-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
