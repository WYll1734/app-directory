"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedIds = values.map((v) => v.id);

  // Filter + remove already selected
  const filtered = useMemo(() => {
    return channels
      .filter((c) => !selectedIds.includes(c.id))
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [channels, selectedIds, query]);

  function addChannel(ch) {
    onChange([...values, ch]);
  }

  function removeChannel(chId) {
    onChange(values.filter((v) => v.id !== chId));
  }

  return (
    <div className="relative w-full">
      {/* Selected chips */}
      <div
        className="w-full rounded-lg border border-slate-700 bg-slate-800/60 p-2 flex flex-wrap gap-2 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {values.length === 0 && (
          <span className="text-sm text-slate-400">Select channels…</span>
        )}

        {values.map((ch) => (
          <div
            key={ch.id}
            className="flex items-center gap-2 bg-slate-700 px-2 py-1 rounded-md text-xs text-slate-200"
          >
            #{ch.name}
            <button
              className="text-slate-300 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                removeChannel(ch.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}

        <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 shadow-xl max-h-72 overflow-y-auto">
          {/* Search box */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Empty */}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-4">
              No channels found
            </p>
          )}

          {/* Channel List */}
          <div className="p-1">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  addChannel(c);
                  setQuery("");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <span className="opacity-60">#</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
