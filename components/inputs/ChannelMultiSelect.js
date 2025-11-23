"use client";

import { useState, useEffect, useRef } from "react";

const icons = {
  0: "💬",  // Text
  5: "📢",  // Announcement
  15: "🧵", // Forum
  2: "🔊",  // Voice
  4: "📁"   // Category
};

export default function ChannelMultiSelect({ channels = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    function click(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  const filtered = channels.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const categories = {};
  for (const ch of filtered) {
    const parent = ch.parent_id || "uncategorized";
    if (!categories[parent]) categories[parent] = [];
    categories[parent].push(ch);
  }

  const selectedChannel = channels.find((c) => c.id === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Selection Box */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 min-h-[44px] rounded-xl border border-slate-700 bg-slate-800 p-2 cursor-pointer hover:bg-slate-700 transition"
      >
        {selectedChannel ? (
          <span className="flex items-center gap-2 text-sm text-slate-200">
            {icons[selectedChannel.type] || "📄"} #{selectedChannel.name}
          </span>
        ) : (
          <span className="text-sm text-slate-400">Select a channel…</span>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 animate-fadeIn">
          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              placeholder="Search channels…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200"
            />
          </div>

          {/* Channel List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {Object.entries(categories).map(([catId, chans]) => (
              <div key={catId} className="mb-2">
                {catId !== "uncategorized" && (
                  <div className="text-xs text-slate-500 px-2 mb-1">
                    📁 {channels.find((x) => x.id === catId)?.name || "Other"}
                  </div>
                )}

                {chans.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onChange(c.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition mb-1"
                  >
                    <span>{icons[c.type] || "📄"}</span>
                    <span>#{c.name}</span>
                  </div>
                ))}
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm p-2">No channels found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
