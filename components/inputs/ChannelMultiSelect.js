"use client";

import { useState, useMemo } from "react";
import { X, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelMultiSelect({
  channels = [],
  values = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Remove selected channels from the dropdown
  const filtered = useMemo(() => {
    const selectedIds = new Set(values.map((c) => c.id));

    return channels.filter(
      (c) =>
        !selectedIds.has(c.id) &&
        c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [channels, values, query]);

  function addChannel(ch) {
    onChange([...values, ch]);
  }

  function removeChannel(id) {
    onChange(values.filter((c) => c.id !== id));
  }

  const iconFor = (type) => {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  return (
    <div className="relative w-full">
      {/* Selected Channels */}
      <div
        onClick={() => setOpen(true)}
        className="min-h-[44px] flex items-center flex-wrap gap-2 px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-lg cursor-text"
      >
        {values.length === 0 && (
          <span className="text-slate-500 text-sm">Select channels…</span>
        )}

        {values.map((ch) => (
          <span
            key={ch.id}
            className="flex items-center gap-2 bg-slate-700 text-slate-200 px-2 py-[3px] rounded-md text-xs"
          >
            {iconFor(ch.type)} #{ch.name}

            <button
              className="text-slate-400 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                removeChannel(ch.id);
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-80 overflow-y-auto shadow-xl">
          {/* Search bar */}
          <div className="p-2 border-b border-slate-800">
            <input
              autoFocus
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 outline-none"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Grouped lists */}
          <DropdownSection
            title="TEXT CHANNELS"
            list={filtered.filter((c) => c.type === 0)}
            iconFor={iconFor}
            onSelect={addChannel}
          />

          <DropdownSection
            title="VOICE CHANNELS"
            list={filtered.filter((c) => c.type === 2)}
            iconFor={iconFor}
            onSelect={addChannel}
          />

          <DropdownSection
            title="CATEGORIES"
            list={filtered.filter((c) => c.type === 4)}
            iconFor={iconFor}
            onSelect={addChannel}
          />

          <DropdownSection
            title="OTHER"
            list={filtered.filter(
              (c) => ![0, 2, 4].includes(c.type)
            )}
            iconFor={iconFor}
            onSelect={addChannel}
          />

          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-3">
              No channels found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DropdownSection({ title, list, iconFor, onSelect }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="p-2">
      <p className="text-xs text-slate-500 mb-1 px-1">{title}</p>

      {list.map((ch) => (
        <button
          key={ch.id}
          className="w-full text-left px-3 py-2 flex items-center gap-2 rounded-md text-sm text-slate-200 hover:bg-slate-800"
          onClick={() => onSelect(ch)}
        >
          {iconFor(ch.type)} #{ch.name}
        </button>
      ))}
    </div>
  );
}
