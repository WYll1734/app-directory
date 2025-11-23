"use client";

export default function CommandsPage() {
  const commands = [
    { id: "ban", label: "/ban", desc: "Ban a member from the server", enabled: true },
    { id: "tempban", label: "/tempban", desc: "Temporarily ban a member from the server", enabled: true },
    { id: "clear", label: "/clear", desc: "Delete a channel's messages", enabled: false },
    { id: "clear-all-infractions", label: "/clear-all-infractions", desc: "Remove all infractions", enabled: true },
    { id: "infractions", label: "/infractions", desc: "Display a member's infractions", enabled: false },
    { id: "kick", label: "/kick", desc: "Kick a member from the server", enabled: true },
    { id: "mute", label: "/mute", desc: "Mute a member in the server", enabled: true },
    { id: "tempmute", label: "/tempmute", desc: "Temporarily mute a member", enabled: true },
    { id: "role-info", label: "/role-info", desc: "Get information about a role", enabled: true },
    { id: "server-info", label: "/server-info", desc: "Get information about the server", enabled: true },
    { id: "slowmode", label: "/slowmode", desc: "Enable/Disable slowmode", enabled: true },
    { id: "unban", label: "/unban", desc: "Unban a member from the server", enabled: true },
    { id: "unmute", label: "/unmute", desc: "Unmute a member from the server", enabled: true },
    { id: "user-info", label: "/user-info", desc: "Get information about a member", enabled: true },
    { id: "warn", label: "/warn", desc: "Warn a member", enabled: true },
  ];

  const toggle = (id) => {
    console.log("Toggled:", id);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-white">Moderation Commands</h1>

      <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900/80 transition"
            >
              {/* Command text */}
              <div>
                <div className="text-white font-semibold text-sm">{cmd.label}</div>
                <div className="text-xs text-slate-400">{cmd.desc}</div>
              </div>

              {/* --- TOGGLE SWITCH (forced) --- */}
              <label className="relative inline-flex cursor-pointer items-center ml-4">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked={cmd.enabled}
                  onChange={() => toggle(cmd.id)}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
              </label>
              {/* ------------------------------- */}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
