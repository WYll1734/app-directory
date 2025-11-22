"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/discord/guilds",
    fetcher
  );
  const [search, setSearch] = useState("");

  const refresh = () => {
    mutate(); // revalidate with SWR
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardShell>
        <div className="p-6 text-slate-400">Loading your servers…</div>
      </DashboardShell>
    );
  }

  // Error state
  if (error || data?.error) {
    return (
      <DashboardShell>
        <div className="p-6 text-red-400">Failed to load your servers.</div>
      </DashboardShell>
    );
  }

  const guilds = data.guilds || [];

  // Search filter (only servers the logged-in user is in – API already does that)
  const filtered = guilds.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  // Grouping logic
  const manageable = filtered.filter((g) => g.canManageGuild);
  const canManageBotIn = manageable.filter((g) => g.botInGuild);
  const canManageBotNotIn = manageable.filter((g) => !g.botInGuild);

  // *** NO PERMISSION = user is in guild but does NOT have MANAGE_GUILD,
  // regardless of whether the bot is there or not ***
  const noPermission = filtered.filter((g) => !g.canManageGuild);

  const iconURL = (g) =>
    g.icon
      ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=128`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

  const BOT_ID = process.env.NEXT_PUBLIC_BOT_CLIENT_ID;

  const makeInvite = (guildId) =>
    `https://discord.com/oauth2/authorize?client_id=${BOT_ID}&scope=bot%20applications.commands&permissions=8&guild_id=${guildId}&response_type=code&redirect_uri=${encodeURIComponent(
      "https://servermatepanel.com/api/discord/callback"
    )}`;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header: title + search + refresh + logout */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              Select a server
            </h2>
            <p className="text-xs text-slate-400">
              Only servers you’re in are shown. Search or refresh anytime.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search servers..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={refresh}
              className="px-3 py-1 bg-indigo-600 rounded-lg text-xs text-white hover:bg-indigo-500 transition"
            >
              Refresh
            </button>

            <a
              href="/api/auth/signout"
              className="px-3 py-1 text-xs text-slate-400 hover:text-red-400"
            >
              Log out
            </a>
          </div>
        </div>

        {/* ───────────────── Your Servers (bot in + you can manage) ───────────────── */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            Your Servers
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {canManageBotIn.map((g) => (
              <Link key={g.id} href={`/dashboard/${g.id}`}>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 cursor-pointer hover:border-indigo-500/70 transition">
                  <div className="flex items-center gap-3">
                    <img src={iconURL(g)} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="text-sm font-medium text-slate-50">
                        {g.name}
                      </div>
                      <div className="text-[11px] text-green-400 mt-1">
                        Bot in server • You can manage
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {canManageBotIn.length === 0 && (
              <p className="text-xs text-slate-500">No servers found.</p>
            )}
          </div>
        </Card>

        {/* ───────────────── Add the Bot (you can manage + bot NOT in) ───────────────── */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            Add the Bot
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {canManageBotNotIn.map((g) => (
              <a key={g.id} href={makeInvite(g.id)}>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 cursor-pointer hover:border-blue-500/70 transition">
                  <div className="flex items-center gap-3">
                    <img src={iconURL(g)} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="text-sm font-medium text-slate-50">
                        {g.name}
                      </div>
                      <div className="text-[11px] text-blue-400 mt-1">
                        Bot not in server • You can manage
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}

            {canManageBotNotIn.length === 0 && (
              <p className="text-xs text-slate-500">Nothing to add.</p>
            )}
          </div>
        </Card>

        {/* ───────────────── No Permission (you are in server but cannot manage) ───────────────── */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            No Permission
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {noPermission.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <img src={iconURL(g)} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-sm font-medium text-slate-50">
                      {g.name}
                    </div>
                    <div className="text-[11px] text-red-400 mt-1">
                      You don&apos;t have permission to manage this server
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {noPermission.length === 0 && (
              <p className="text-xs text-slate-500">None found.</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
