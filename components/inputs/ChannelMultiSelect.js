"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelMultiSelect({
  channels = [],
  values = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedIds = values.map((v) => v.id);

  const grouped = useMemo(() => {
    const groups = {
      text: [],
      voice: [],
      categories: [],
      other: [],
    };

    channels.forEach((ch) => {
      if (selectedIds.includes(ch.id)) return;

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
  }, [channels, selectedIds, query]);

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
      {/* Selected channels */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition"
      >
        <div className="flex flex-wrap gap-2">
          {values.length === 0 && (
            <span className="text-slate-400 text-sm">Select channels…</span>
          )}

          {values.map((ch) => (
            <span
              key={ch.id}
              className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded-md text-xs flex items-center gap-1"
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

      {/* Dropdown */}
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-72 overflow-y-auto">
          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <DropdownSection
            title="TEXT CHANNELS"
            list={grouped.text}
            renderIcon={renderIcon}
            onSelect={addChannel}
          />
          <DropdownSection
            title="VOICE CHANNELS"
            list={grouped.voice}
            renderIcon={renderIcon}
            onSelect={addChannel}
          />
          <DropdownSection
            title="CATEGORIES"
            list={grouped.categories}
            renderIcon={renderIcon}
            onSelect={addChannel}
          />
          <DropdownSection
            title="OTHER"
            list={grouped.other}
            renderIcon={renderIcon}
            onSelect={addChannel}
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

function DropdownSection({ title, list, renderIcon, onSelect }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="p-2">
      <p className="text-xs text-slate-500 mb-1 px-1">{title}</p>
      {list.map((ch) => (
        <button
          type="button"
          key={ch.id}
          onClick={() => onSelect(ch)}
          className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md text-sm text-slate-200 hover:bg-slate-800"
        >
          {renderIcon(ch.type)}
          #{ch.name}
        </button>
      ))}
    </div>
  );
}
