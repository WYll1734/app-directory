"use client";

import { useState, useEffect, useRef } from "react";

export default function RoleMultiSelect({ roles = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef(null);

  // close if clicking outside
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
      onChange(value.filter((id) => id !== roleId));
    } else {
      onChange([...value, roleId]);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input button */}
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-wrap gap-1 rounded-lg bg-slate-800 border border-slate-700 p-2 cursor-pointer min-h-[42px]"
      >
        {value.length === 0 && (
          <span className="text-slate-400 text-sm">Select roles…</span>
        )}

        {value.map((id) => {
          const role = roles.find((r) => r.id === id);
          if (!role) return null;

          return (
            <span
              key={id}
              className="bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded-md flex items-center gap-1"
            >
              {role.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRole(id);
                }}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg bg-slate-900 border border-slate-700 shadow-xl max-h-60 overflow-y-auto z-50 p-2">
          <input
            placeholder="Search roles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full mb-2 p-2 rounded-md bg-slate-800 border border-slate-700 text-sm text-slate-200"
          />

          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm p-2">No roles found.</p>
          )}

          <div className="flex flex-col gap-1">
            {filtered.map((r) => {
              const active = value.includes(r.id);

              return (
                <div
                  key={r.id}
                  onClick={() => toggleRole(r.id)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {r.name}
                  {active && <span className="text-white">✔</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
