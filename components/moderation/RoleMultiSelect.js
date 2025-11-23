"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function RoleMultiSelect({
  allRoles = [],
  selectedRoles,
  setSelectedRoles,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);

  // 🔍 Filter roles + remove already-selected ones
  const filtered = useMemo(() => {
    return allRoles
      .filter((r) => !selectedRoles.some((s) => s.id === r.id))
      .filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
  }, [allRoles, selectedRoles, search]);

  // Click outside = close
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Add selected role
  function addRole(role) {
    setSelectedRoles([...selectedRoles, role]);
    setSearch("");
  }

  // Remove pill
  function removeRole(id) {
    setSelectedRoles(selectedRoles.filter((r) => r.id !== id));
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* SELECTOR BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between 
          rounded-lg border border-slate-700 bg-slate-800/70 
          text-sm px-3 py-2 cursor-pointer 
          hover:bg-slate-800 transition
        "
      >
        <span className="text-slate-300">
          {selectedRoles.length > 0
            ? `${selectedRoles.length} selected`
            : "Select roles..."}
        </span>

        <ChevronDown size={18} className="text-slate-400" />
      </div>

      {/* SELECTED PILL ROW */}
      {selectedRoles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedRoles.map((role) => (
            <div
              key={role.id}
              className="
                flex items-center gap-2 
                text-xs px-2 py-1 
                bg-indigo-600/30 border border-indigo-500/40 
                text-indigo-200 rounded-lg
              "
            >
              {role.name}
              <button
                onClick={() => removeRole(role.id)}
                className="text-indigo-300 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 z-30 
            bg-slate-900 border border-slate-800 
            rounded-xl shadow-xl p-3
            max-h-64 overflow-y-auto
          "
        >
          {/* SEARCH BAR */}
          <input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full mb-3 px-3 py-2 
              bg-slate-800 border border-slate-700 
              text-sm rounded-lg text-slate-200
              focus:outline-none focus:ring-1 focus:ring-indigo-500
            "
          />

          {/* NO ROLES */}
          {filtered.length === 0 && (
            <p className="text-xs text-slate-500 py-2">No roles found</p>
          )}

          {/* ROLE ITEMS */}
          {filtered.map((role) => (
            <button
              key={role.id}
              onClick={() => addRole(role)}
              className="
                w-full text-left px-3 py-2 rounded-lg 
                text-sm text-slate-200 hover:bg-slate-800
              "
            >
              {role.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
