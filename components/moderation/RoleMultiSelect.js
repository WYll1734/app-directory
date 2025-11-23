"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function RoleMultiSelect({ allRoles = [], selectedRoles, setSelectedRoles }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Remove selected roles from list
  const filtered = useMemo(() => {
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
      {/* SELECTED ROLES */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition"
      >
        <div className="flex flex-wrap gap-2">
          {selectedRoles.length === 0 && (
            <span className="text-slate-400 text-sm">Select roles...</span>
          )}

          {selectedRoles.map((role) => (
            <span
              key={role.id}
              className="bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded-md text-xs flex items-center gap-1"
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

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">

          {/* SEARCH */}
          <input
            className="w-full p-2 bg-slate-800 border-b border-slate-700 text-sm text-slate-200"
            placeholder="Search roles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="p-1">
            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm p-3 text-center">No roles found</p>
            )}

            {filtered.map((role) => (
              <div
                key={role.id}
                onClick={() => addRole(role)}
                className="px-3 py-2 hover:bg-slate-800 cursor-pointer text-slate-200 text-sm rounded-md"
              >
                @{role.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
