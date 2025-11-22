"use client";

import useSWR from "swr";
import Link from "next/link";

export default function GuildPicker() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR("/api/discord/guilds", fetcher);

  if (isLoading) return <p className="text-slate-300">Loading your servers…</p>;
  if (error || data?.error) return <p className="text-red-500">Failed to load servers.</p>;

  const guilds = data.guilds || [];

  // Icon builder
  const iconURL = (g) =>
    g.icon
      ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=128`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

  // Sort servers into groups
  const canManageBotIn = guilds.filter((g) => g.canManageGuild && g.botInGuild);
  const canManageBotNotIn = guilds.filter((g) => g.canManageGuild && !g.botInGuild);
  const noPermission = guilds.filter((g) => !g.canManageGuild && g.botInGuild);

  return (
    <div className="space-y-10">

      {/* YOUR SERVERS */}
      <section>
        <h2 className="text-xl font-bold mb-3 text-slate-200">Your Servers</h2>

        {canManageBotIn.length === 0 && (
          <p className="text-slate-500 text-sm">No servers found.</p>
        )}

        {canManageBotIn.map((g) => (
          <Link key={g.id} href={`/dashboard/${g.id}`}>
            <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded cursor-pointer hover:border-indigo-500/70 transition">
              <img src={iconURL(g)} className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-slate-50 text-sm">{g.name}</div>
                <div className="text-green-400 text-xs">Bot in server</div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ADD BOT SECTION */}
      <section>
        <h2 className="text-xl font-bold mb-3 text-slate-200">Add Bot</h2>

        {canManageBotNotIn.length === 0 && (
          <p className="text-slate-500 text-sm">None to add.</p>
        )}

        {canManageBotNotIn.map((g) => (
          <a
            key={g.id}
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_BOT_CLIENT_ID}&scope=bot%20applications.commands&permissions=8&guild_id=${g.id}&redirect_uri=${encodeURIComponent(
              "https://servermatepanel.com/api/discord/callback"
            )}&response_type=code`}
          >
            <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded cursor-pointer hover:border-blue-500/70 transition">
              <img src={iconURL(g)} className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-slate-50 text-sm">{g.name}</div>
                <div className="text-blue-400 text-xs">Bot not in server</div>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* NO PERMISSION */}
      <section>
        <h2 className="text-xl font-bold mb-3 text-slate-200">No Permission</h2>

        {noPermission.length === 0 && (
          <p className="text-slate-500 text-sm">None found.</p>
        )}

        {noPermission.map((g) => (
          <div
            key={g.id}
            className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded opacity-50 cursor-not-allowed"
          >
            <img src={iconURL(g)} className="w-10 h-10 rounded-full" />
            <div>
              <div className="text-slate-50 text-sm">{g.name}</div>
              <div className="text-red-400 text-xs">No Permission</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
