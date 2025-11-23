"use client";

import { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";

export default function RoleMultiSelect({ allRoles = [], selectedRoles, setSelectedRoles }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Filter available roles (hide already selected)
  const filtered = useMemo(() => {
    return allRoles.filter(
      (r) =>
        !selectedRoles.some((s) => s.id === r.id) &&
        r.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [allRoles, selectedRoles, query]);

  // Add role + auto-close
  function addRole(role) {
    setSelectedRoles([...selectedRoles, role]);
    setQuery("");
    setOpen(false); // <-- 🔥 AUTO CLOSE HERE
  }

  // Remove role
  function removeRole(roleId) {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== roleId));
  }

  return (
    <div className="relative w-full">
      {/* Selected roles pills */}
      <div
        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 flex flex-wrap gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selectedRoles.length === 0 ? (
          <span className="text-slate-400 text-sm">Select roles…</span>
        ) : (
          selectedRoles.map((role) => (
            <div
              key={role.id}
              className="flex items-center gap-2 bg-slate-700/70 text-slate-200 text-xs px-2 py-1 rounded-md"
            >
              {role.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeRole(role.id);
                }}
              >
                <X size={12} className="text-slate-400 hover:text-red-400" />
              </button>
            </div>
          ))
        )}

        <ChevronDown size={16} className="ml-auto text-slate-400" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-72 overflow-y-auto">

          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* List */}
          <div className="p-2 space-y-1">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-600 text-sm py-2">No roles found</p>
            ) : (
              filtered.map((role) => (
                <button
                  key={role.id}
                  className="w-full text-left text-sm text-slate-200 px-3 py-2 rounded hover:bg-slate-800"
                  onClick={() => addRole(role)}
                >
                  {role.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
