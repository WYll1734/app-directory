"use client";

import { useState } from "react";

export default function ChannelMultiSelect({ channels, values, onChange }) {
  const [open, setOpen] = useState(false);

  const toggleChannel = (id) => {
    if (values.includes(id)) {
      onChange(values.filter((x) => x !== id));
    } else {
      onChange([...values, id]);
    }
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-3 text-sm text-slate-200"
      >
        {values.length === 0 ? (
          <span className="text-slate-500">Select channels</span>
        ) : (
          <span className="text-slate-300">
            {values.length} channel{values.length > 1 ? "s" : ""}
          </span>
        )}
        <span className="text-slate-400 text-xs">⌄</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-56 overflow-y-auto
                        rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => toggleChannel(ch.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              {/* Checkbox dot */}
              <div
                className={`h-3 w-3 rounded-full border transition-all
                  ${
                    values.includes(ch.id)
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-slate-500"
                  }`}
              />

              # {ch.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
