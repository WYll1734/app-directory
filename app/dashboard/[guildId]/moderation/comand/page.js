"use client";

export default function CommandsPage() {
  const categories = [
    {
      title: "Ban Commands",
      items: [
        { id: "ban", label: "/ban", desc: "Ban a member from the server", enabled: true },
        { id: "tempban", label: "/tempban", desc: "Temporarily ban a member", enabled: true },
        { id: "unban", label: "/unban", desc: "Unban a member from the server", enabled: true },
      ],
    },
    {
      title: "Moderation Commands",
      items: [
        { id: "mute", label: "/mute", desc: "Mute a member in the server", enabled: true },
        { id: "tempmute", label: "/tempmute", desc: "Temporarily mute a member", enabled: true },
        { id: "kick", label: "/kick", desc: "Kick a member from the server", enabled: true },
        { id: "warn", label: "/warn", desc: "Warn a member", enabled: true },
        { id: "clear", label: "/clear", desc: "Delete a channel's messages", enabled: true },
        { id: "clear-all-infractions", label: "/clear-all-infractions", desc: "Remove all infractions", enabled: true },
        { id: "infractions", label: "/infractions", desc: "Display a member's infractions", enabled: true },
        { id: "unmute", label: "/unmute", desc: "Unmute a member from the server", enabled: true },
      ],
    },
    {
      title: "Information Commands",
      items: [
        { id: "user-info", label: "/user-info", desc: "Get information about a member", enabled: true },
        { id: "role-info", label: "/role-info", desc: "Get information about a role", enabled: true },
        { id: "server-info", label: "/server-info", desc: "Get information about the server", enabled: true },
      ],
    },
    {
      title: "Server Commands",
      items: [
        { id: "slowmode", label: "/slowmode", desc: "Enable/Disable slowmode in a channel", enabled: true },
      ],
    },
  ];

  const toggle = (id) => {
    console.log("Toggled:", id);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-semibold text-white">Commands</h1>
      <p className="text-slate-400">Overview of all moderation commands available for this server.</p>

      {categories.map((cat) => (
        <div key={cat.title} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
          {/* Category Title */}
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{cat.title}</h2>

          {/* Commands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cat.items.map((cmd) => (
              <div
                key={cmd.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900/80 transition"
              >
                {/* Command Text */}
                <div>
                  <div className="text-white font-semibold text-sm">{cmd.label}</div>
                  <div className="text-xs text-slate-400">{cmd.desc}</div>
                </div>

                {/* Toggle */}
                <label className="relative inline-flex cursor-pointer items-center ml-4 shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    defaultChecked={cmd.enabled}
                    onChange={() => toggle(cmd.id)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
