"use client";

import { useState, useMemo } from "react";
import { X, Hash, Volume2, FolderIcon, ChevronDown } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Remove selected channels from the dropdown list
  const availableChannels = useMemo(() => {
    const selectedIds = new Set(values.map((v) => v.id));
    return channels.filter((c) => !selectedIds.has(c.id));
  }, [channels, values]);

  // Group + filter
  const grouped = useMemo(() => {
    const groups = { text: [], voice: [], categories: [], other: [] };

    availableChannels.forEach((ch) => {
      if (ch.type === 0) groups.text.push(ch);
      else if (ch.type === 2) groups.voice.push(ch);
      else if (ch.type === 4) groups.categories.push(ch);
      else groups.other.push(ch);
    });

    const applySearch = (list) =>
      list.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

    return {
      text: applySearch(groups.text),
      voice: applySearch(groups.voice),
      categories: applySearch(groups.categories),
      other: applySearch(groups.other),
    };
  }, [availableChannels, query]);

  const iconFor = (type) => {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  const handleSelect = (ch) => {
    onChange([...values, ch]);
    // DO NOT close — because multi-select
  };

  const handleRemove = (id) => {
    onChange(values.filter((v) => v.id !== id));
  };

  return (
    <div className="relative w-full">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((ch) => (
          <span
            key={ch.id}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700
                       text-slate-200 text-xs px-2 py-1 rounded-lg"
          >
            {iconFor(ch.type)} #{ch.name}
            <button
              onClick={() => handleRemove(ch.id)}
              className="text-slate-400 hover:text-red-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2
                   flex items-center justify-between cursor-pointer hover:bg-slate-700/60
                   transition"
      >
        <span className="text-sm text-slate-300">
          {values.length === 0 ? "Select channels…" : "Add more channels…"}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700
                        rounded-lg max-h-72 overflow-y-auto shadow-xl">
          {/* Search box */}
          <div className="p-2 border-b border-slate-800">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels…"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700
                         text-sm text-slate-200 placeholder-slate-500 rounded"
            />
          </div>

          <DropdownSection
            title="TEXT CHANNELS"
            list={grouped.text}
            iconFor={iconFor}
            disabled={false}
            onSelect={handleSelect}
          />

          <DropdownSection
            title="VOICE CHANNELS"
            list={grouped.voice}
            iconFor={iconFor}
            disabled={false}
            onSelect={handleSelect}
          />

          <DropdownSection
            title="CATEGORIES"
            list={grouped.categories}
            iconFor={iconFor}
            disabled={true}
            onSelect={handleSelect}
          />

          <DropdownSection
            title="OTHER"
            list={grouped.other}
            iconFor={iconFor}
            disabled={false}
            onSelect={handleSelect}
          />

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

function DropdownSection({ title, list, iconFor, disabled, onSelect }) {
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
              className="px-3 py-2 flex items-center gap-2 text-slate-500 text-sm
                         cursor-not-allowed opacity-50 rounded"
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
            className="w-full flex items-center gap-2 text-left px-3 py-2
                       text-slate-200 hover:bg-slate-800 rounded-md transition"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
