"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function RoleMultiSelect({
  allRoles = [],
  selectedRoles = [],
  setSelectedRoles,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredRoles = useMemo(() => {
    return allRoles
      .filter((r) => !selectedRoles.some((s) => s.id === r.id))
      .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
  }, [allRoles, selectedRoles, query]);

  function addRole(role) {
    setSelectedRoles([...selectedRoles, role]);
    setQuery("");
  }

  function removeRole(roleId) {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== roleId));
  }

  return (
    <div className="relative w-full">
      {/* Selected roles */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition"
      >
        <div className="flex flex-wrap gap-2">
          {selectedRoles.length === 0 && (
            <span className="text-slate-400 text-sm">Select roles…</span>
          )}

          {selectedRoles.map((role) => (
            <span
              key={role.id}
              className="bg-indigo-600/30 text-indigo-200 px-2 py-1 rounded-md text-xs flex items-center gap-1"
            >
              @{role.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeRole(role.id);
                }}
                className="text-slate-300 hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="p-1">
            {filteredRoles.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-3">
                No roles found
              </p>
            )}

            {filteredRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => addRole(role)}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-800"
              >
                @{role.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
