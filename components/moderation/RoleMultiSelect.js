"use client";

import { useState, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";

export default function RoleMultiSelect({ allRoles = [], selectedRoles = [], setSelectedRoles }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Remove selected roles from available list
  const filtered = useMemo(() => {
    const selectedIds = new Set(selectedRoles.map((r) => r.id));

    return allRoles.filter(
      (r) =>
        !selectedIds.has(r.id) &&
        r.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [allRoles, selectedRoles, query]);

  function addRole(role) {
    setSelectedRoles([...selectedRoles, role]);
  }

  function removeRole(id) {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== id));
  }

  // Discord-style role color
  function roleColor(role) {
    if (!role.color || role.color === 0) return "text-slate-200";
    return `style={{ color: #${role.color.toString(16).padStart(6, "0")} }}`;
  }

  return (
    <div className="relative w-full">
      {/* Selected role chips */}
      <div
        onClick={() => setOpen(true)}
        className="min-h-[44px] cursor-text flex items-center flex-wrap gap-2 px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-lg"
      >
        {selectedRoles.length === 0 && (
          <span className="text-slate-500 text-sm">Select roles…</span>
        )}

        {selectedRoles.map((role) => (
          <span
            key={role.id}
            className="flex items-center gap-1 bg-slate-700 text-slate-200 px-2 py-[3px] rounded-md text-xs"
          >
            <span
              className="font-semibold"
              style={{
                color:
                  role.color && role.color !== 0
                    ? `#${role.color.toString(16).padStart(6, "0")}`
                    : "#d1d5db",
              }}
            >
              @{role.name}
            </span>

            <button
              className="ml-1 text-slate-400 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                removeRole(role.id);
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <ChevronDown size={16} className="ml-auto text-slate-400" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-80 overflow-y-auto shadow-xl">
          {/* Search bar */}
          <div className="p-2 border-b border-slate-800">
            <input
              autoFocus
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 outline-none"
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Roles list */}
          {filtered.length > 0 ? (
            filtered.map((role) => (
              <button
                key={role.id}
                className="w-full text-left px-3 py-2 flex items-center gap-2 rounded-md text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => addRole(role)}
              >
                <span
                  className="font-semibold"
                  style={{
                    color:
                      role.color && role.color !== 0
                        ? `#${role.color.toString(16).padStart(6, "0")}`
                        : "#cbd5e1",
                  }}
                >
                  @{role.name}
                </span>
              </button>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500 py-3">
              No roles found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
