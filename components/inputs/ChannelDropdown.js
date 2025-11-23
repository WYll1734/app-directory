"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelDropdown({ channels = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest(".channel-dropdown-wrapper")) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Group channels
  const grouped = useMemo(() => {
    const groups = { text: [], voice: [], categories: [], other: [] };

    channels.forEach((ch) => {
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
  }, [channels, query]);

  const iconFor = (type) => {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  const selectedLabel = value ? (
    <span className="flex items-center gap-2 text-sm text-slate-200">
      {iconFor(value.type)} #{value.name}
    </span>
  ) : (
    <span className="text-slate-500 text-sm">Select a channel…</span>
  );

  return (
    <div className="relative w-full channel-dropdown-wrapper">
      {/* Selected channel button */}
      <div
        onClick={() => setOpen((p) => !p)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition"
      >
        {selectedLabel}
        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-72 overflow-y-auto shadow-xl animate-fadeIn">

          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              autoFocus
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 outline-none"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Lists */}
          <DropdownSection
            title="TEXT CHANNELS"
            list={grouped.text}
            iconFor={iconFor}
            onSelect={(ch) => {
              onChange(ch);
              setOpen(false);
            }}
          />

          <DropdownSection
            title="VOICE CHANNELS"
            list={grouped.voice}
            iconFor={iconFor}
            onSelect={(ch) => {
              onChange(ch);
              setOpen(false);
            }}
          />

          <DropdownSection
            title="CATEGORIES (disabled)"
            list={grouped.categories}
            iconFor={iconFor}
            disabled={true}
          />

          <DropdownSection
            title="OTHER"
            list={grouped.other}
            iconFor={iconFor}
            onSelect={(ch) => {
              onChange(ch);
              setOpen(false);
            }}
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
              className="px-3 py-2 text-sm rounded-md flex items-center gap-2 text-slate-500 cursor-not-allowed opacity-60"
            >
              {content}
            </div>
          );
        }

        return (
          <button
            key={ch.id}
            onClick={() => onSelect && onSelect(ch)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md text-sm text-slate-200 hover:bg-slate-800 transition"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
