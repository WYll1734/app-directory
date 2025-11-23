"use client";

import { useState, useEffect, useRef } from "react";

const icons = {
  0: "💬",  // GUILD_TEXT
  5: "📢",  // GUILD_ANNOUNCEMENT
  15: "🧵", // GUILD_FORUM / threads
  2: "🔊",  // GUILD_VOICE
  4: "📁",  // GUILD_CATEGORY
};

export default function ChannelMultiSelect({
  channels = [],
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    function click(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  const selectableChannels = channels.filter(
    (c) =>
      c.type === 0 || // text
      c.type === 5 || // announcement
      c.type === 15 || // forum
      c.type === 2 // optional: voice
  );

  const filtered = selectableChannels.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  // group by parent category
  const categories = {};
  for (const ch of filtered) {
    const parent = ch.parent_id || "uncategorized";
    if (!categories[parent]) categories[parent] = [];
    categories[parent].push(ch);
  }

  useEffect(() => {
    if (highlightedIndex >= filtered.length) {
      setHighlightedIndex(filtered.length - 1 < 0 ? 0 : filtered.length - 1);
    }
  }, [filtered.length, highlightedIndex]);

  const selectedChannel = channels.find((c) => c.id === value) || null;

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 >= filtered.length ? filtered.length - 1 : prev + 1
      );
      scrollToHighlighted(highlightedIndex + 1);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 < 0 ? 0 : prev - 1));
      scrollToHighlighted(highlightedIndex - 1);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const ch = filtered[highlightedIndex];
      if (ch) {
        onChange(ch.id);
        setOpen(false);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const scrollToHighlighted = (index) => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(
      `[data-index="${index}"]`
    );
    if (item) {
      item.scrollIntoView({
        block: "nearest",
      });
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Selection Box */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 min-h-[44px] rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 cursor-pointer hover:border-indigo-500/70 hover:bg-slate-800/90 transition"
      >
        {selectedChannel ? (
          <>
            <span>{icons[selectedChannel.type] || "📄"}</span>
            <span className="text-sm text-slate-100 truncate">
              #{selectedChannel.name}
            </span>
            <button
              onClick={clearSelection}
              className="ml-auto text-[11px] text-slate-400 hover:text-red-400"
            >
              Clear
            </button>
          </>
        ) : (
          <span className="text-sm text-slate-400">Select a channel…</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/40 z-50 animate-fadeIn">
          {/* Search */}
          <div className="border-b border-slate-800 px-2 py-2">
            <input
              placeholder="Search channels…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* List with scroll shadows */}
          <div className="relative max-h-64 overflow-y-auto" ref={listRef}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950 to-transparent" />

            <div className="p-2 space-y-2">
              {filtered.length === 0 && (
                <p className="text-slate-500 text-sm px-1 py-2">
                  No channels found.
                </p>
              )}

              {Object.entries(categories).map(([catId, chans]) => {
                const category =
                  channels.find((x) => x.id === catId && x.type === 4) ||
                  null;

                return (
                  <div key={catId}>
                    {category && (
                      <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-slate-500 px-1 mb-1">
                        <span className="text-xs">📁</span>
                        <span className="truncate">{category.name}</span>
                      </div>
                    )}

                    {chans.map((c, indexForGroup) => {
                      const globalIndex = filtered.findIndex(
                        (f) => f.id === c.id
                      );
                      const highlighted = globalIndex === highlightedIndex;

                      return (
                        <div
                          key={c.id}
                          data-index={globalIndex}
                          onClick={() => {
                            onChange(c.id);
                            setOpen(false);
                          }}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm mb-1 transition
                            ${
                              highlighted
                                ? "bg-indigo-600/70 text-white"
                                : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                            }
                          `}
                        >
                          <span>{icons[c.type] || "📄"}</span>
                          <span className="truncate">#{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
