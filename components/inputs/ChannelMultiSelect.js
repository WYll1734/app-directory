"use client";

import { useState, useEffect, useRef } from "react";

const icons = {
  0: "💬", // text
  2: "🔊", // voice
  4: "📁", // category
};

export default function ChannelMultiSelect({ channels = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function click(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  // Selectable types (text + voice)
  const selectable = channels.filter((c) => c.type === 0 || c.type === 2);

  // Hide selected channels
  const filtered = selectable.filter(
    (c) =>
      !value.includes(c.id) && // ⬅️ NEW: removes selected from list
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const categories = {};
  for (const c of filtered) {
    const parent = c.parent_id || "uncategorized";
    if (!categories[parent]) categories[parent] = [];
    categories[parent].push(c);
  }

  useEffect(() => {
    if (highlightedIndex >= filtered.length) {
      setHighlightedIndex(filtered.length > 0 ? filtered.length - 1 : 0);
    }
  }, [filtered.length, highlightedIndex]);

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

  const scrollTo = (index) => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${index}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  };

  return (
    <div
      className="relative w-full"
      tabIndex={0}
      ref={containerRef}
      onKeyDown={() => {}}
    >
      {/* Selected chips */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-1 min-h-[44px] rounded-xl border border-slate-700 bg-slate-900/80 px-2 py-2 cursor-pointer hover:border-indigo-500/70 hover:bg-slate-800/90 transition"
      >
        {value.length === 0 && (
          <span className="text-sm text-slate-400">Select channels…</span>
        )}

        {value.map((id) => {
          const c = channels.find((x) => x.id === id);
          if (!c) return null;

          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-slate-800/90 px-2 py-1 text-xs text-slate-100"
            >
              {icons[c.type] || "📄"} #{c.name}
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
            className="ml-auto text-[11px] text-slate-400 hover:text-red-400"
            onClick={clearAll}
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-950 border border-slate-800 shadow-xl shadow-black/50 z-50 animate-fadeIn">
          {/* Search */}
          <div className="border-b border-slate-800 p-2">
            <input
              placeholder="Search channels…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* List */}
          <div ref={listRef} className="max-h-64 overflow-y-auto p-2 space-y-2">
            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm p-2">No channels found.</p>
            )}

            {Object.entries(categories).map(([catId, chans]) => {
              const category = channels.find(
                (x) => x.id === catId && x.type === 4
              );

              return (
                <div key={catId}>
                  {category && (
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-1 px-1">
                      📁 {category.name}
                    </div>
                  )}

                  {chans.map((c) => {
                    const index = filtered.findIndex((f) => f.id === c.id);

                    return (
                      <div
                        key={c.id}
                        data-index={index}
                        onClick={() => toggle(c.id)}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <span>{icons[c.type] || "📄"}</span>
                          <span>#{c.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
