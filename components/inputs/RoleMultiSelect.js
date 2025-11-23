"use client";

import { useState, useEffect, useRef } from "react";

export default function RoleMultiSelect({ roles = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleRole = (roleId) => {
    if (value.includes(roleId)) {
      onChange(value.filter((x) => x !== roleId));
    } else {
      onChange([...value, roleId]);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Selection Box */}
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-wrap items-center gap-1 min-h-[44px] rounded-xl border border-slate-700 bg-slate-800 p-2 cursor-pointer hover:bg-slate-700 transition"
      >
        {value.length === 0 && (
          <span className="text-sm text-slate-400">Select roles…</span>
        )}

        {value.map((id) => {
          const role = roles.find((r) => r.id === id);
          if (!role) return null;

          return (
            <span
              key={id}
              className="flex items-center gap-1 bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded-md"
            >
              {role.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRole(id);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </span>
          );
        })}
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 animate-fadeIn">
          {/* Search Bar */}
          <div className="p-2 border-b border-slate-800">
            <input
              placeholder="Search roles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200"
            />
          </div>

          {/* Role List */}
          <div className="max-h-60 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm p-2">No roles found.</p>
            )}

            {filtered.map((role) => {
              const active = value.includes(role.id);
              return (
                <div
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm mb-1 transition ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {role.name}
                  {active && <span>✔</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
