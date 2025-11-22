"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ServerTopbar({ guildId, title, description }) {
  const { data } = useSWR("/api/discord/guilds", fetcher);

  const guild =
    Array.isArray(data) && data.length
      ? data.find((g) => g.id === guildId)
      : null;

  const serverName = guild?.name || "Selected Server";
  const iconHash = guild?.icon;
  const iconUrl = iconHash
    ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=128`
    : null;

  return (
    <header className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="mr-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/90"
          >
            ← Back to servers
          </Link>

          {iconUrl ? (
            <Image
              src={iconUrl}
              alt={serverName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
              {serverName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">
              Servers &gt; {serverName} &gt; <span className="text-slate-300">{title}</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-50">{title}</h1>
            {description && (
              <p className="mt-0.5 text-xs text-slate-400">{description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/90">
            Discard
          </button>
          <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-[0_0_18px_rgba(79,70,229,0.7)]">
            Save Changes
          </button>
        </div>
      </div>

      {/* subtle server info strip */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-[11px] text-slate-400">
        <span className="rounded-md bg-slate-800/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          SERVER
        </span>
        <span>{serverName}</span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span>ID: {guildId}</span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span className="text-emerald-400">Status: Connected</span>
      </div>
    </header>
  );
}
