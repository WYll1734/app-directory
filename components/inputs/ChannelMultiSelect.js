"use client";

import { useState, useEffect, useRef } from "react";

const icons = {
  0: "💬",  // Text
  5: "📢",  // Announcement
  15: "🧵", // Forum
  2: "🔊",  // Voice
  4: "📁",  // Category
};

export default function ChannelMultiSelect({ channels = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function click(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  // Only allow text / announcement / forum / voice (if you want)
  const selectable = channels.filter(
    (c) => c.type === 0 || c.type === 5 || c.type === 15 || c.type === 2
  );

  const filtered = selectable.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  // group by category
  const categories = {};
  for (const c of filtered) {
    const parent = c.parent_id || "uncategorized";
    if (!categories[parent]) categories[parent] = [];
    categories[parent].push(c);
  }

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

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
      scrollTo(highlightedIndex + 1);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 < 0 ? 0 : prev - 1));
      scrollTo(highlightedIndex - 1);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[highlightedIndex];
      if (c) toggle(c.id);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }

    if (e.key === "Backspace" && query === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const scrollTo = (index) => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(`[data-index="${index}"]`);
    if (item) item.scrollIntoView({ block: "nearest" });
  };

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Selection box */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-1 min-h-[44px] rounded-xl border border-slate-700 bg-slate-900/80 px-2 py-2 cursor-pointer hover:border-indigo-500/70 hover:bg-slate-800/90 transition"
      >
        {value.length === 0 && (
          <span className="text-sm text-slate-400">Select channels…</span>
        )}

        {value.map((id) => {
          const c = channels.find((ch) => ch.id === id);
          if (!c) return null;

          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-slate-800/90 px-2 py-1 text-xs text-slate-100 shadow-sm shadow-black/40"
            >
              {icons[c.type] || "📄"}
              <span>#{c.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(id);
                }}
                className="text-slate-400 hover:text-white text-[10px]"
              >
                ✕
              </button>
            </span>
          );
        })}

        {value.length > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto text-[11px] text-slate-400 hover:text-red-400 px-1"
          >
            Clear
          </button>
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

          {/* List */}
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
                  channels.find((x) => x.id === catId && x.type === 4) || null;

                return (
                  <div key={catId}>
                    {category && (
                      <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-slate-500 px-1 mb-1">
                        📁 {category.name}
                      </div>
                    )}

                    {chans.map((c) => {
                      const index = filtered.findIndex((f) => f.id === c.id);
                      const highlighted = highlightedIndex === index;
                      const active = value.includes(c.id);

                      return (
                        <div
                          key={c.id}
                          data-index={index}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onClick={() => toggle(c.id)}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-sm mb-1 transition 
                            ${
                              highlighted
                                ? "bg-indigo-600/70 text-white"
                                : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <span>{icons[c.type] || "📄"}</span>
                            <span>#{c.name}</span>
                          </div>
                          {active && <span>✔</span>}
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
