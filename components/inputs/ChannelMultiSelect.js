"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Separate channels by type
  const grouped = useMemo(() => {
    const groups = {
      text: [],
      voice: [],
      categories: [],
      other: [],
    };

    channels.forEach((ch) => {
      if (values.some((v) => v.id === ch.id)) return; // Remove selected

      if (ch.type === 4) groups.categories.push(ch);
      else if (ch.type === 0) groups.text.push(ch);
      else if (ch.type === 2) groups.voice.push(ch);
      else groups.other.push(ch);
    });

    function searchFilter(list) {
      return list.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return {
      categories: searchFilter(groups.categories),
      text: searchFilter(groups.text),
      voice: searchFilter(groups.voice),
      other: searchFilter(groups.other),
    };
  }, [channels, values, query]);

  function addChannel(ch) {
    onChange([...values, ch]);
    setQuery("");
  }

  function removeChannel(id) {
    onChange(values.filter((c) => c.id !== id));
  }

  const renderIcon = (type) => {
    if (type === 2) return <Volume2 size={14} className="text-blue-300" />;
    if (type === 4) return <FolderIcon size={14} className="text-yellow-300" />;
    return <Hash size={14} className="text-slate-300" />;
  };

  return (
    <div className="relative w-full">
      {/* SELECTED CHANNELS */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition"
      >
        <div className="flex flex-wrap gap-2">
          {values.length === 0 && (
            <span className="text-slate-400 text-sm">Select channels...</span>
          )}

          {values.map((ch) => (
            <span
              key={ch.id}
              className="bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded-md text-xs flex items-center gap-1"
            >
              {renderIcon(ch.type)}
              #{ch.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeChannel(ch.id);
                }}
                className="text-slate-300 hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-72 overflow-y-auto">

          {/* SEARCH */}
          <input
            className="w-full p-2 bg-slate-800 border-b border-slate-700 text-sm text-slate-200"
            placeholder="Search channels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* LISTS */}
          <DropdownSection title="TEXT CHANNELS" list={grouped.text} icon={Hash} onClick={addChannel} />
          <DropdownSection title="VOICE CHANNELS" list={grouped.voice} icon={Volume2} onClick={addChannel} />
          <DropdownSection title="CATEGORIES" list={grouped.categories} icon={FolderIcon} onClick={addChannel} />
          <DropdownSection title="OTHER" list={grouped.other} icon={Hash} onClick={addChannel} />
        </div>
      )}
    </div>
  );
}

function DropdownSection({ title, list, icon: Icon, onClick }) {
  if (list.length === 0) return null;

  return (
    <div className="p-2">
      <p className="text-xs text-slate-500 mb-1 px-1">{title}</p>

      {list.map((ch) => (
        <div
          key={ch.id}
          onClick={() => onClick(ch)}
          className="px-3 py-2 hover:bg-slate-800 rounded-md cursor-pointer flex items-center gap-2 text-slate-200 text-sm"
        >
          <Icon size={14} className="text-slate-300" />
          #{ch.name}
        </div>
      ))}
    </div>
  );
}
