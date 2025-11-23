"use client";

export default function CommandsTab({ commands, onToggle }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
      <h3 className="text-sm font-semibold text-slate-300 mb-6">
        Moderation Commands
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {commands.map((cmd) => (
          <div
            key={cmd.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900/80 transition"
          >
            <div>
              <div className="text-white font-semibold text-sm">{cmd.label}</div>
              <div className="text-xs text-slate-400">{cmd.desc}</div>
            </div>

            {/* Toggle */}
            <label className="relative inline-flex cursor-pointer items-center ml-4">
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
  );
}
