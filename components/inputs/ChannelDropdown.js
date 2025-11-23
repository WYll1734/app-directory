"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelDropdown({ channels = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const groups = { text: [], voice: [], categories: [], other: [] };

    channels.forEach((c) => {
      if (c.type === 4) groups.categories.push(c);
      else if (c.type === 0) groups.text.push(c);
      else if (c.type === 2) groups.voice.push(c);
      else groups.other.push(c);
    });

    function filter(list) {
      return list.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return {
      text: filter(groups.text),
      voice: filter(groups.voice),
      categories: filter(groups.categories),
      other: filter(groups.other),
    };
  }, [channels, query]);

  const iconFor = (type) => {
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  const selectedLabel = value
    ? (
      <span className="flex items-center gap-2">
        {iconFor(value.type)} #{value.name}
      </span>
    )
    : <span className="text-slate-400 text-sm">Select a channel…</span>;

  return (
    <div className="relative w-full">
      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition"
      >
        {selectedLabel}
        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-72 overflow-y-auto shadow-xl">
          <input
            className="w-full p-2 bg-slate-800 border-b border-slate-700 text-sm text-slate-200"
            placeholder="Search channels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <DropdownSection title="TEXT CHANNELS" list={grouped.text} iconFor={iconFor} onSelect={onChange} />
          <DropdownSection title="VOICE CHANNELS" list={grouped.voice} iconFor={iconFor} onSelect={onChange} />
          <DropdownSection title="CATEGORIES" list={grouped.categories} iconFor={iconFor} onSelect={onChange} />
          <DropdownSection title="OTHER" list={grouped.other} iconFor={iconFor} onSelect={onChange} />
        </div>
      )}
    </div>
  );
}

function DropdownSection({ title, list, iconFor, onSelect }) {
  if (list.length === 0) return null;

  return (
    <div className="p-2">
      <p className="text-xs text-slate-500 mb-1 px-1">{title}</p>

      {list.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c)}
          className="px-3 py-2 rounded-md hover:bg-slate-800 cursor-pointer flex items-center gap-2 text-slate-200 text-sm"
        >
          {iconFor(c.type)}
          #{c.name}
        </div>
      ))}
    </div>
  );
}
