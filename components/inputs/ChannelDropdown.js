"use client";

import { useState } from "react";

export default function ChannelDropdown({ channels, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-3 text-sm text-slate-200"
      >
        <span>
          {value
            ? `# ${channels.find((c) => c.id === value)?.name || "unknown"}`
            : "Select a channel"}
        </span>

        <span className="text-slate-400 text-xs">⌄</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-56 overflow-y-auto 
          rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          {channels.map((ch) => (
            <button
              key={ch.id}
              className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              onClick={() => {
                onChange(ch.id);
                setOpen(false);
              }}
            >
              # {ch.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
