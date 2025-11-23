"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Hash, Volume2, FolderIcon, X } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values = [], onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Remove selected channels from the selectable list
  const filteredSource = useMemo(() => {
    const selectedIds = new Set(values.map((c) => c.id));
    return channels.filter((ch) => !selectedIds.has(ch.id));
  }, [channels, values]);

  // Grouping logic
  const grouped = useMemo(() => {
    const groups = { text: [], voice: [], categories: [], other: [] };

    filteredSource.forEach((ch) => {
      if (ch.type === 0) groups.text.push(ch);
      else if (ch.type === 2) groups.voice.push(ch);
      else if (ch.type === 4) groups.categories.push(ch);
      else groups.other.push(ch);
    });

    const search = (list) =>
      list.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

    return {
      text: search(groups.text),
      voice: search(groups.voice),
      categories: search(groups.categories),
      other: search(groups.other),
    };
  }, [filteredSource, query]);

  const iconFor = (type) => {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  // Add channel
  function addChannel(ch) {
    onChange([...values, ch]);
  }

  // Remove selected channel
  function removeChannel(id) {
    onChange(values.filter((c) => c.id !== id));
  }

  return (
    <div className="relative w-full">
      {/* Selected tags */}
      <div
        onClick={() => setOpen(true)}
        className="min-h-[44px] cursor-text flex items-center flex-wrap gap-2 px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-lg"
      >
        {values.length === 0 && (
          <span className="text-slate-500 text-sm">Select channels…</span>
        )}

        {values.map((ch) => (
          <span
            key={ch.id}
            className="flex items-center gap-1 bg-slate-700 text-slate-200 px-2 py-[3px] rounded-md text-xs"
          >
            {iconFor(ch.type)} #{ch.name}
            <button
              className="ml-1 text-slate-400 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                removeChannel(ch.id);
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <ChevronDown size={16} className="ml-auto text-slate-400" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-80 overflow-y-auto shadow-xl">
          {/* Search area */}
          <div className="p-2 border-b border-slate-800">
            <input
              autoFocus
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 outline-none placeholder-slate-500"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Render grouped channels */}
          <DropdownSection
            title="TEXT CHANNELS"
            list={grouped.text}
            iconFor={iconFor}
            onSelect={addChannel}
          />
          <DropdownSection
            title="VOICE CHANNELS"
            list={grouped.voice}
            iconFor={iconFor}
            onSelect={addChannel}
          />
          <DropdownSection
            title="CATEGORIES (disabled)"
            list={grouped.categories}
            iconFor={iconFor}
            onSelect={addChannel}
            disabled
          />
          <DropdownSection
            title="OTHER"
            list={grouped.other}
            iconFor={iconFor}
            onSelect={addChannel}
          />

          {/* No results */}
          {grouped.text.length === 0 &&
            grouped.voice.length === 0 &&
            grouped.categories.length === 0 &&
            grouped.other.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-3">
                No channels found
              </p>
            )}
        </div>
      )}
    </div>
  );
}

// ================================
// DROPDOWN SECTION
// ================================
function DropdownSection({ title, list, iconFor, onSelect, disabled }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="p-2">
      <p className="text-xs text-slate-500 mb-1 px-1">{title}</p>

      {list.map((ch) => {
        const row = (
          <>
            {iconFor(ch.type)} #{ch.name}
          </>
        );

        return disabled ? (
          <div
            key={ch.id}
            className="px-3 py-2 rounded-md flex items-center gap-2 text-slate-500 text-sm opacity-60 cursor-not-allowed"
          >
            {row}
          </div>
        ) : (
          <button
            type="button"
            key={ch.id}
            className="w-full text-left px-3 py-2 flex items-center gap-2 rounded-md text-sm text-slate-200 hover:bg-slate-800"
            onClick={() => onSelect(ch)}
          >
            {row}
          </button>
        );
      })}
    </div>
  );
}
