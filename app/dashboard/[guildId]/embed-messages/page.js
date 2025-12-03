"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical } from "lucide-react";

const MOCK_EMBEDS = [
  {
    id: "1",
    name: "Rules",
    channelName: "#rules",
    status: "draft",
    updatedAt: null,
  },
  {
    id: "2",
    name: "Rules",
    channelName: "#rules",
    status: "published",
    updatedAt: "June 17, 2025 7:33 AM",
  },
];

function StatusPill({ status }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border";
  if (status === "published") {
    return (
      <span
        className={`${base} border-emerald-500 text-emerald-400 bg-emerald-500/10`}
      >
        Published
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span
        className={`${base} border-indigo-500 text-indigo-400 bg-indigo-500/10`}
      >
        Scheduled
      </span>
    );
  }
  return (
    <span
      className={`${base} border-slate-500/60 text-slate-300 bg-slate-500/10`}
    >
      Draft
    </span>
  );
}

export default function EmbedMessagesPage({ params }) {
  const { guildId } = params;

  const [active, setActive] = useState(true);
  const [query, setQuery] = useState("");

  const filteredEmbeds = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_EMBEDS.filter(
      (e) =>
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.channelName.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Embed Messages
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Create beautiful embed messages for your rules and announcements
            with thumbnails and colors.
          </p>
        </div>

        <button
          onClick={() => setActive((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium border border-slate-600/70"
        >
          <span className="text-slate-300">Active</span>
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              active ? "bg-emerald-500/90" : "bg-slate-600"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-slate-950 shadow transition-transform ${
                active ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </span>
        </button>
      </div>

      {/* New embed button */}
      <Link
        href={`/dashboard/${guildId}/embed-messages/new`}>
        className="group flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-5 py-4 text-sm hover:border-slate-500 hover:bg-slate-900 transition"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80">
            <Plus className="h-4 w-4 text-slate-300" />
          </div>
          <span className="font-medium text-slate-100 group-hover:text-white">
            New embed message
          </span>
        </div>
        <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-200" />
      </Link>

      {/* Wrapper card */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/40">
        {/* Title row */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
          <div className="text-sm font-medium text-slate-200">
            Your embed messages
          </div>
          <div className="text-xs text-slate-500">
            {filteredEmbeds.length} / 500
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-slate-800/80 px-5 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none placeholder:text-slate-500 text-sm"
            />
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_40px] px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
          <span>Embed</span>
          <span>Status</span>
          <span>Time</span>
          <span />
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {filteredEmbeds.length === 0 ? (
            <div className="px-5 py-10 text-sm text-slate-500">
              You don&apos;t have any embed messages yet.
            </div>
          ) : (
            filteredEmbeds.map((embed) => (
              <div
                key={embed.id}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_40px] items-center border-t border-slate-900/80 bg-slate-950/60 px-5 py-4 text-sm hover:bg-slate-900/70 transition"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-slate-100">
                    {embed.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {embed.channelName}
                  </span>
                </div>
                <div>
                  <StatusPill status={embed.status} />
                </div>
                <div className="text-xs text-slate-400">
                  {embed.updatedAt || "Not published yet"}
                </div>
                <div className="flex justify-end">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
