"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Hash, Mic, Folder } from "lucide-react";

export default function ChannelDropdown({ channels = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef(null);

  // ================================
  // CLICK OUTSIDE TO CLOSE
  // ================================
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ================================
  // GROUP CHANNELS (text / voice / category)
  // ================================
  const grouped = useMemo(() => {
    const groups = { text: [], voice: [], categories: [] };

    channels.forEach((ch) => {
      const name = ch.name.toLowerCase();
      if (!name.includes(search.toLowerCase())) return;

      if (ch.type === 0) groups.text.push(ch);
      else if (ch.type === 2) groups.voice.push(ch);
      else if (ch.type === 4) groups.categories.push(ch); // disabled
    });

    return groups;
  }, [channels, search]);

  // ================================
  // ICON FOR CHANNEL TYPE
  // ================================
  const iconFor = (type) => {
    if (type === 2) return <Mic size={15} className="text-blue-300" />;
    if (type === 4) return <Folder size={15} className="text-yellow-300" />;
    return <Hash size={15} className="text-slate-300" />;
  };

  // ================================
  // SELECTED LABEL
  // ================================
  const selectedLabel = value ? (
    <div className="flex items-center gap-2 text-sm text-slate-200">
      {iconFor(value.type)} {value.name}
    </div>
  ) : (
    <span className="text-slate-400 text-sm">Select a channel…</span>
  );

  // ================================
  // SELECT CHANNEL (close after pick)
  // ================================
  function selectChannel(ch) {
    onChange(ch);
    setOpen(false); // close immediately for dropdown
    setSearch("");
  }

  return (
    <div className="relative w-full" ref={ref}>
      
      {/* SELECTOR */}
      <div
        onClick={() => setOpen(!open)}
        className="
          w-full flex items-center justify-between
          bg-slate-800/70 border border-slate-700
          px-3 py-2 rounded-lg cursor-pointer
          hover:bg-slate-700/60 transition
        "
      >
        {selectedLabel}
        <ChevronDown size={18} className="text-slate-400" />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="
          absolute left-0 right-0 mt-2 z-50
          bg-slate-900 border border-slate-800
          rounded-xl shadow-xl max-h-72 overflow-y-auto
        ">
          
          {/* SEARCH BAR */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="
                w-full px-3 py-2 rounded bg-slate-800
                border border-slate-700 text-sm text-slate-200
                placeholder-slate-500
                focus:outline-none focus:ring-1 focus:ring-indigo-500
              "
              placeholder="Search channels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TEXT CHANNELS */}
          <DropdownSection
            title="TEXT CHANNELS"
            list={grouped.text}
            iconFor={iconFor}
            onSelect={selectChannel}
            disabled={false}
          />

          {/* VOICE CHANNELS */}
          <DropdownSection
            title="VOICE CHANNELS"
            list={grouped.voice}
            iconFor={iconFor}
            onSelect={selectChannel}
            disabled={false}
          />

          {/* CATEGORIES (DISABLED) */}
          <DropdownSection
            title="CATEGORIES"
            list={grouped.categories}
            iconFor={iconFor}
            onSelect={selectChannel}
            disabled={true}
          />

          {/* EMPTY STATE */}
          {grouped.text.length === 0 &&
            grouped.voice.length === 0 &&
            grouped.categories.length === 0 && (
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
      <p className="text-xs text-slate-500 uppercase px-1 mb-1">{title}</p>

      {list.map((ch) => {
        // disabled category row
        if (disabled) {
          return (
            <div
              key={ch.id}
              className="
                px-3 py-2 flex items-center gap-2 
                rounded-md text-sm text-slate-500 
                cursor-not-allowed opacity-50
              "
            >
              {iconFor(ch.type)} {ch.name}
            </div>
          );
        }

        // selectable channel
        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch)}
            className="
              w-full flex items-center gap-2 
              px-3 py-2 text-left text-sm text-slate-200 
              rounded-md hover:bg-slate-800
            "
          >
            {iconFor(ch.type)} {ch.name}
          </button>
        );
      })}
    </div>
  );
}
