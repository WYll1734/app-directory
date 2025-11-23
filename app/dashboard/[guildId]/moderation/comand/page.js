"use client";

import CommandsTab from "@/components/moderation/CommandsTab";

const commands = [
  { id: "ban", label: "/ban", desc: "Ban a member from the server", enabled: true },
  { id: "tempban", label: "/tempban", desc: "Temporarily ban a member from the server", enabled: true },
  { id: "clear", label: "/clear", desc: "Delete a channel's messages", enabled: true },
  { id: "clear-all-infractions", label: "/clear-all-infractions", desc: "Remove all infractions", enabled: true },
  { id: "infractions", label: "/infractions", desc: "Display a member's infractions", enabled: true },
  { id: "kick", label: "/kick", desc: "Kick a member from the server", enabled: true },
  { id: "mute", label: "/mute", desc: "Mute a member in the server", enabled: true },
  { id: "tempmute", label: "/tempmute", desc: "Temporarily mute a member in the server", enabled: true },
  { id: "role-info", label: "/role-info", desc: "Get information about a role", enabled: true },
  { id: "server-info", label: "/server-info", desc: "Get information about the server", enabled: true },
  { id: "slowmode", label: "/slowmode", desc: "Enable/Disable slowmode in a channel", enabled: true },
  { id: "unban", label: "/unban", desc: "Unban a member from the server", enabled: true },
  { id: "unmute", label: "/unmute", desc: "Unmute a member from the server", enabled: true },
  { id: "user-info", label: "/user-info", desc: "Get information about a member", enabled: true },
  { id: "warn", label: "/warn", desc: "Warn a member", enabled: true },
];

export default function CommandsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Commands</h1>

      <CommandsTab
        commands={commands}
        onToggle={(id) => console.log("Toggle:", id)}
      />
    </div>
  );
}
