"use client";

import { useState, useMemo } from "react";
import { X, Shield } from "lucide-react";

export default function RoleMultiSelect({ allRoles = [], selectedRoles = [], setSelectedRoles }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Remove already-selected roles from the list
  const filtered = useMemo(() => {
    const selectedIds = new Set(selectedRoles.map((r) => r.id));

    const remaining = allRoles.filter((r) => !selectedIds.has(r.id));

    return remaining.filter((role) =>
      role.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [allRoles, selectedRoles, query]);

  const addRole = (role) => {
    setSelectedRoles([...selectedRoles, role]);
  };

  const removeRole = (id) => {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== id));
  };

  const roleDot = (role) => {
    const hex = role.color ? `#${role.color.toString(16).padStart(6, "0")}` : null;

    return (
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ backgroundColor: hex || "var(--slate-600)" }}
      ></span>
    );
  };

  return (
    <div className="relative w-full">
      {/* Selected chips */}
      <div
        onClick={() => setOpen(true)}
        className="min-h-[44px] bg-slate-800/70 border border-slate-700 rounded-lg p-2 flex flex-wrap gap-2 cursor-pointer hover:bg-slate-700/60 transition"
      >
        {selectedRoles.length === 0 && (
          <span className="text-slate-400 text-sm pl-1">Select roles…</span>
        )}

        {selectedRoles.map((role) => (
          <div
            key={role.id}
            className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-lg text-sm text-slate-200"
          >
            {roleDot(role)}
            {role.name}
            <button onClick={() => removeRole(role.id)}>
              <X size={14} className="text-slate-400 hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-72 overflow-y-auto shadow-xl">
          {/* Search */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Role List */}
          {filtered.length > 0 ? (
            <div className="p-2">
              {filtered.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => addRole(role)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md text-sm text-slate-200 hover:bg-slate-800"
                >
                  {roleDot(role)}
                  {role.name}
                  {role.managed && (
                    <Shield size={14} className="text-blue-300 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500 py-3">No roles found</p>
          )}
        </div>
      )}
    </div>
  );
}
