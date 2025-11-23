"use client";

import { useState, useEffect, useRef } from "react";

export default function RoleMultiSelect({ roles = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Sort roles Discord-style (highest first)
  const sortedRoles = [...roles].sort((a, b) => {
    if (typeof a.position === "number" && typeof b.position === "number")
      return b.position - a.position;
    return a.name.localeCompare(b.name);
  });

  // Hide @everyone + hide already selected
  const filtered = sortedRoles.filter(
    (r) =>
      r.name !== "@everyone" &&
      !value.includes(r.id) && // ⬅️ NEW: selected roles removed from list
      r.name.toLowerCase().includes(query.toLowerCase())
  );

  // Keep highlight in range
  useEffect(() => {
    if (highlightedIndex >= filtered.length) {
      setHighlightedIndex(filtered.length > 0 ? filtered.length - 1 : 0);
    }
  }, [filtered.length, highlightedIndex]);

  const toggleRole = (id) => {
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
    const item = listRef.current.querySelector(`[data-index="${index}"]`);
    if (item) item.scrollIntoView({ block: "nearest" });
  };

  const getRoleColor = (role) => {
    if (!role?.color) return null;
    return `#${role.color.toString(16).padStart(6, "0")}`;
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(highlightedIndex + 1, filtered.length - 1);
      setHighlightedIndex(next);
      scrollTo(next);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.max(highlightedIndex - 1, 0);
      setHighlightedIndex(next);
      scrollTo(next);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const role = filtered[highlightedIndex];
      if (role) toggleRole(role.id);
    }

    if (e.key === "Escape") setOpen(false);

    if (e.key === "Backspace" && query === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Selected pills */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-1 min-h-[44px] rounded-xl border border-slate-700 bg-slate-900/80 px-2 py-2 cursor-pointer hover:border-indigo-500/70 hover:bg-slate-800/90 transition"
      >
        {value.length === 0 && (
          <span className="text-sm text-slate-400">Select roles…</span>
        )}

        {value.map((id) => {
          const role = roles.find((r) => r.id === id);
          if (!role || role.name === "@everyone") return null;

          const col = getRoleColor(role);

          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-slate-800/90 px-2 py-1 text-xs text-slate-100 shadow-sm shadow-black/40"
            >
              {col && <span style={{ backgroundColor: col }} className="h-2 w-2 rounded-full" />}
              <span className="max-w-[140px] truncate">{role.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRole(id);
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
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-950 border border-slate-800 shadow-xl shadow-black/50 z-50 animate-fadeIn">
          {/* Search */}
          <div className="border-b border-slate-800 p-2">
            <input
              placeholder="Search roles…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* List */}
          <div ref={listRef} className="max-h-60 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm p-2">No roles found.</p>
            )}

            {filtered.map((role, index) => {
              const col = getRoleColor(role);
              const highlighted = highlightedIndex === index;

              return (
                <div
                  key={role.id}
                  data-index={index}
                  onClick={() => toggleRole(role.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition
                    ${
                      highlighted
                        ? "bg-indigo-600/70 text-white"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {col && (
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/40"
                        style={{ backgroundColor: col }}
                      />
                    )}
                    <span>{role.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
