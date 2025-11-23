"use client";

import { useState, useMemo } from "react";
import { X, ChevronDown, Shield, UserRound } from "lucide-react";

export default function RoleMultiSelect({
  allRoles = [],
  selectedRoles = [],
  setSelectedRoles,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Remove already-selected roles
  const availableRoles = useMemo(() => {
    const selectedIds = new Set(selectedRoles.map((r) => r.id));
    return allRoles.filter((r) => !selectedIds.has(r.id));
  }, [allRoles, selectedRoles]);

  // Filter roles by search
  const filtered = useMemo(() => {
    return availableRoles.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [availableRoles, query]);

  // ===================================
  // Helpers
  // ===================================
  const addRole = (role) => {
    setSelectedRoles([...selectedRoles, role]);
    // DO NOT close — multi-select stays open
  };

  const removeRole = (id) => {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== id));
  };

  const iconFor = (role) => {
    if (role.managed) return <Shield size={14} className="text-indigo-300" />;
    return <UserRound size={14} className="text-slate-300" />;
  };

  return (
    <div className="relative w-full">
      {/* Selected chips */}
      {selectedRoles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedRoles.map((r) => (
            <span
              key={r.id}
              className="flex items-center gap-2 bg-slate-800 border border-slate-700
                         text-slate-200 text-xs px-2 py-1 rounded-lg"
            >
              {iconFor(r)} {r.name}
              <button
                onClick={() => removeRole(r.id)}
                className="text-slate-400 hover:text-red-400"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2
                   flex items-center justify-between cursor-pointer transition
                   hover:bg-slate-700/60"
      >
        <span className="text-sm text-slate-300">
          {selectedRoles.length === 0
            ? "Select roles…"
            : "Add more roles…"}
        </span>

        <ChevronDown
          size={16}
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto
                     bg-slate-900 border border-slate-700 rounded-lg shadow-xl"
        >
          {/* Search Box */}
          <div className="p-2 border-b border-slate-800">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles…"
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700
                         text-sm text-slate-200 placeholder-slate-500"
            />
          </div>

          {/* Role List */}
          <div className="p-2 space-y-1">
            {filtered.length > 0 ? (
              filtered.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => addRole(role)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                             text-slate-200 hover:bg-slate-800 transition"
                >
                  {iconFor(role)} {role.name}
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-slate-500 py-3">
                No roles found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
