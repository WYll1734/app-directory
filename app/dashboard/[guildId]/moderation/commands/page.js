"use client";

import ModerationTabs from "@/components/moderation/ModerationTabs";

const commands = [
  { name: "/ban", description: "Ban a member from the server" },
  { name: "/tempban", description: "Temporarily ban a member from the server" },
  { name: "/clear", description: "Delete a channel's messages" },
  {
    name: "/clear-all-infractions",
    description: "Remove all infractions of every member in the server",
  },
  { name: "/infractions", description: "Display a member's infractions" },
  { name: "/kick", description: "Kick a member from the server" },
  { name: "/mute", description: "Mute a member in the server" },
  {
    name: "/tempmute",
    description: "Temporarily mute a member in the server",
  },
  { name: "/role-info", description: "Get information about a role" },
  { name: "/server-info", description: "Get information about the server" },
  {
    name: "/slowmode",
    description: "Enable/Disable slowmode in a channel",
  },
  { name: "/unban", description: "Unban a member from the server" },
  { name: "/unmute", description: "Unmute a member from the server" },
  { name: "/user-info", description: "Get information about a member" },
  { name: "/warn", description: "Warn a member" },
];

export default function CommandsPage({ params }) {
  // match [guildid] folder
  const guildId = params.guildid;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-50">Commands</h1>
        <p className="text-sm text-slate-400">
          Overview of all moderation commands available for this server.
        </p>
      </div>

      {/* Tabs */}
      <ModerationTabs guildId={guildId} activeTab="commands" />

      {/* Command list */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-sm font-semibold text-slate-100 mb-3">
          Moderation Commands
        </h2>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {commands.map((cmd) => (
            <div
              key={cmd.name}
              className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 flex flex-col gap-1"
            >
              <span className="text-sm font-semibold text-slate-50">
                {cmd.name}
              </span>
              <span className="text-xs text-slate-400">{cmd.description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
