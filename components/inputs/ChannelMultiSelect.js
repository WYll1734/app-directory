"use client";

import { useState, useMemo } from "react";
import { X, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Filter out selected channels + apply search
  const filtered = useMemo(() => {
    const selectedIds = new Set(values.map((c) => c.id));

    const remaining = channels.filter((c) => !selectedIds.has(c.id));

    return remaining.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [channels, values, query]);

  // Group channels
  const grouped = useMemo(() => {
    const groups = {
      text: [],
      voice: [],
      categories: [],
      other: [],
    };

    filtered.forEach((ch) => {
      if (ch.type === 0) groups.text.push(ch);
      else if (ch.type === 2) groups.voice.push(ch);
      else if (ch.type === 4) groups.categories.push(ch);
      else groups.other.push(ch);
    });

    return groups;
  }, [filtered]);

  const addChannel = (ch) => {
    onChange([...values, ch]);
  };

  const removeChannel = (id) => {
    onChange(values.filter((ch) => ch.id !== id));
  };

  const iconFor = (type) => {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  return (
    <div className="relative w-full">
      {/* Selected Items */}
      <div
        onClick={() => setOpen(true)}
        className="min-h-[44px] bg-slate-800/70 border border-slate-700 rounded-lg p-2 flex flex-wrap gap-2 cursor-pointer hover:bg-slate-700/60 transition"
      >
        {values.length === 0 && (
          <span className="text-slate-400 text-sm pl-1">Select channels…</span>
        )}

        {values.map((ch) => (
          <div
            key={ch.id}
            className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-lg text-sm text-slate-200"
          >
            {iconFor(ch.type)}
            {ch.name}
            <button onClick={() => removeChannel(ch.id)}>
              <X size={14} className="text-slate-400 hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-72 overflow-y-auto shadow-xl">
          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Channel Sections */}
          <DropdownSection
            title="TEXT CHANNELS"
            list={grouped.text}
            iconFor={iconFor}
            onSelect={addChannel}
            disabled={false}
          />

          <DropdownSection
            title="VOICE CHANNELS"
            list={grouped.voice}
            iconFor={iconFor}
            onSelect={addChannel}
            disabled={false}
          />

          <DropdownSection
            title="CATEGORIES"
            list={grouped.categories}
            iconFor={iconFor}
            onSelect={addChannel}
            disabled={true} // categories disabled
          />

          <DropdownSection
            title="OTHER"
            list={grouped.other}
            iconFor={iconFor}
            onSelect={addChannel}
            disabled={false}
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

/* SECTION COMPONENT --------------------------------------------------- */

function DropdownSection({ title, list, iconFor, onSelect, disabled }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="p-2">
      <p className="text-xs text-slate-500 mb-1 px-1">{title}</p>

      {list.map((ch) => {
        const content = (
          <>
            {iconFor(ch.type)}
            #{ch.name}
          </>
        );

        if (disabled) {
          return (
            <div
              key={ch.id}
              className="px-3 py-2 rounded-md flex items-center gap-2 text-slate-500 text-sm cursor-not-allowed opacity-60"
            >
              {content}
            </div>
          );
        }

        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onSelect(ch)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md text-sm text-slate-200 hover:bg-slate-800"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
