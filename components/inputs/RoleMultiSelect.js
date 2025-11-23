"use client";

import { useState, useEffect, useRef } from "react";

export default function RoleMultiSelect({ roles = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sort roles similar to Discord (highest position first)
  const sortedRoles = [...roles].sort((a, b) => {
    if (typeof a.position === "number" && typeof b.position === "number") {
      return b.position - a.position;
    }
    return a.name.localeCompare(b.name);
  });

  // Filter + drop @everyone from UI
  const filtered = sortedRoles.filter(
    (r) =>
      r.name !== "@everyone" &&
      r.name.toLowerCase().includes(query.toLowerCase())
  );

  // Keep highlighted index in range
  useEffect(() => {
    if (highlightedIndex >= filtered.length) {
      setHighlightedIndex(filtered.length > 0 ? filtered.length - 1 : 0);
    }
  }, [filtered.length, highlightedIndex]);

  const toggleRole = (roleId) => {
    if (value.includes(roleId)) {
      onChange(value.filter((x) => x !== roleId));
    } else {
      onChange([...value, roleId]);
    }
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const scrollToHighlighted = (index) => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(`[data-index="${index}"]`);
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = Math.min(prev + 1, filtered.length - 1);
        scrollToHighlighted(next);
        return next;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        scrollToHighlighted(next);
        return next;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const role = filtered[highlightedIndex];
      if (role) toggleRole(role.id);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }

    if (e.key === "Backspace" && query === "" && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const getRoleColor = (role) => {
    if (!role || !role.color) return null;
    try {
      return `#${role.color.toString(16).padStart(6, "0")}`;
    } catch {
      return null;
    }
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
          <span className="text-sm text-slate-400">Select roles…</span>
        )}

        {value.map((id) => {
          const role = roles.find((r) => r.id === id);
          if (!role || role.name === "@everyone") return null;

          const color = getRoleColor(role);

          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-slate-800/90 px-2 py-1 text-xs text-slate-100 shadow-sm shadow-black/40"
            >
              {color && (
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="max-w-[120px] truncate">{role.name}</span>
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
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/40 z-50 animate-fadeIn">
          {/* Search */}
          <div className="border-b border-slate-800 px-2 py-2">
            <input
              placeholder="Search roles…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* List with scroll shadows */}
          <div className="relative max-h-60 overflow-y-auto" ref={listRef}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950 to-transparent" />

            <div className="p-2 space-y-1">
              {filtered.length === 0 && (
                <p className="text-slate-500 text-sm px-1 py-2">
                  No roles found.
                </p>
              )}

              {filtered.map((role, index) => {
                const active = value.includes(role.id);
                const highlighted = index === highlightedIndex;
                const color = getRoleColor(role);

                return (
                  <div
                    key={role.id}
                    data-index={index}
                    onClick={() => toggleRole(role.id)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm cursor-pointer transition
                      ${
                        highlighted
                          ? "bg-indigo-600/70 text-white"
                          : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {color && (
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border border-black/40"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      <span className="truncate max-w-[180px]">
                        {role.name}
                      </span>
                    </div>
                    {active && <span className="text-xs">✔</span>}
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
