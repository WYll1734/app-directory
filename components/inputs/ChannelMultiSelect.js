"use client";

import { useState, useMemo } from "react";
import { ChevronDown, X, Hash, Volume2, FolderIcon } from "lucide-react";

export default function ChannelMultiSelect({ channels = [], values, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Filter out selected channels
  const filtered = useMemo(() => {
    return channels.filter(
      (ch) =>
        !values.some((v) => v.id === ch.id) &&
        ch.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [channels, values, query]);

  function addChannel(ch) {
    onChange([...values, ch]);
    setQuery("");
    setOpen(false); // 🔥 Auto-close after selecting
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
      {/* Selected channel pills */}
      <div
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 flex flex-wrap gap-2 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {values.length === 0 ? (
          <span className="text-slate-400 text-sm">Select channels…</span>
        ) : (
          values.map((ch) => (
            <div
              key={ch.id}
              className="flex items-center gap-2 bg-slate-700/70 text-slate-200 text-xs px-2 py-1 rounded-md"
            >
              #{ch.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeChannel(ch.id);
                }}
              >
                <X size={12} className="text-slate-400 hover:text-red-400" />
              </button>
            </div>
          ))
        )}

        <ChevronDown size={16} className="ml-auto text-slate-400" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-72 overflow-y-auto">
          {/* Search bar */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* List */}
          <DropdownGroup
            title="TEXT CHANNELS"
            iconFor={iconFor}
            list={filtered.filter((c) => c.type === 0)}
            onSelect={addChannel}
          />

          <DropdownGroup
            title="VOICE CHANNELS"
            iconFor={iconFor}
            list={filtered.filter((c) => c.type === 2)}
            onSelect={addChannel}
          />

          <DropdownGroup
            title="CATEGORIES"
            iconFor={iconFor}
            list={filtered.filter((c) => c.type === 4)}
            disabled
          />

          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-600 py-2">No channels found</p>
          )}
        </div>
      )}
    </div>
  );
}

function DropdownGroup({ title, list, iconFor, onSelect, disabled }) {
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
