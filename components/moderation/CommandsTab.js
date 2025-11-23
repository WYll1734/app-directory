"use client";

export default function CommandsTab({ commandsConfig, onToggle }) {
  // commandsConfig example:
  // {
  //   banCommands: [{ id: "ban", label: "/ban", desc: "Ban a member", enabled: true }, ...],
  //   moderationCommands: [...],
  //   infoCommands: [...],
  //   serverCommands: [...]
  // }

  return (
    <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* CATEGORY BLOCKS */}
        {Object.entries(commandsConfig).map(([categoryName, items]) => (
          <div key={categoryName}>
            {/* Category Title */}
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {categoryName.replace(/([A-Z])/g, " $1").toUpperCase()}
            </h3>

            {/* Items list */}
            <div className="flex flex-col gap-4">
              {items.map((cmd) => (
                <div
                  key={cmd.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{cmd.label}</span>
                    <span className="text-xs text-slate-400">{cmd.desc}</span>
                  </div>

                  {/* Toggle */}
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={cmd.enabled}
                      onChange={() => onToggle(cmd.id)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-blue-500 transition-all"></div>
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
