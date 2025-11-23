"use client";

import { useState, useMemo } from "react";
import { X, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Apply search
  const filtered = useMemo(() => {
    return channels.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [channels, query]);

  function toggleChannel(ch) {
    if (values.some((v) => v.id === ch.id)) {
      onChange(values.filter((v) => v.id !== ch.id));
    } else {
      onChange([...values, ch]);
    }
  }

  function remove(id) {
    onChange(values.filter((v) => v.id !== id));
  }

  function iconFor(type) {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  }

  return (
    <div className="relative">
      {/* Selected badges */}
      <div
        className="min-h-[42px] bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 flex items-center gap-2 flex-wrap cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {values.length === 0 ? (
          <span className="text-slate-400 text-sm">Select channels...</span>
        ) : (
          values.map((ch) => (
            <span
              key={ch.id}
              className="px-2 py-[2px] text-xs bg-slate-700 rounded flex items-center gap-1"
            >
              {iconFor(ch.type)}
              #{ch.name}
              <X
                size={12}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(ch.id);
                }}
              />
            </span>
          ))
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-72 overflow-y-auto shadow-xl">
          {/* SEARCH BAR */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* NO RESULTS */}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-3">
              No channels found
            </p>
          )}

          {/* CHANNEL LIST */}
          {filtered.map((ch) => {
            const active = values.some((v) => v.id === ch.id);

            return (
              <button
                type="button"
                key={ch.id}
                onClick={() => toggleChannel(ch)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-800
                  ${active ? "text-indigo-400" : "text-slate-200"}
                `}
              >
                {iconFor(ch.type)} #{ch.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
