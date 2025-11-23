"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";

export default function RoleMultiSelect({ allRoles = [], selectedRoles, setSelectedRoles }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return allRoles.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allRoles]);

  function toggleRole(role) {
    if (selectedRoles.some((r) => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  }

  function remove(roleId) {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== roleId));
  }

  return (
    <div className="relative">
      {/* Selected Roles */}
      <div
        className="min-h-[42px] bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 flex items-center gap-2 flex-wrap cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selectedRoles.length === 0 ? (
          <span className="text-slate-400 text-sm">Select roles...</span>
        ) : (
          selectedRoles.map((r) => (
            <span
              key={r.id}
              className="px-2 py-[2px] text-xs bg-slate-700 rounded flex items-center gap-1"
            >
              {r.name}
              <X
                size={12}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(r.id);
                }}
              />
            </span>
          ))
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg max-h-72 overflow-y-auto shadow-xl">
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500"
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-3">
              No roles found
            </p>
          )}

          {filtered.map((role) => {
            const active = selectedRoles.some((r) => r.id === role.id);
            return (
              <button
                type="button"
                key={role.id}
                onClick={() => toggleRole(role)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-800 ${
                  active ? "text-indigo-400" : "text-slate-200"
                }`}
              >
                {role.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
