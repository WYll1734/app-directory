"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export default function RoleMultiSelect({
  allRoles,
  selectedRoles,
  setSelectedRoles,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter roles with search
  const filteredRoles = allRoles.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  function toggleRole(role) {
    if (selectedRoles.some((r) => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  }

  return (
    <div className="w-full relative" ref={containerRef}>
      
      {/* Input box */}
      <div
        onClick={() => setOpen(!open)}
        className="
          flex flex-wrap gap-2 cursor-pointer
          bg-slate-900/60 border border-slate-700 rounded-xl p-3
        "
      >
        {selectedRoles.length === 0 && (
          <span className="text-slate-500 text-sm">Select roles…</span>
        )}

        {selectedRoles.map((role) => (
          <div
            key={role.id}
            className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-800 border border-slate-600 text-sm"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: role.color }}
            />
            <span className="text-slate-200">@{role.name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleRole(role);
              }}
              className="text-slate-400 hover:text-red-400"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Dropdown Arrow */}
        <ChevronDown className="ml-auto text-slate-400" size={18} />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 
            max-h-60 overflow-y-auto 
            bg-slate-900 border border-slate-700 
            rounded-xl shadow-xl z-50
            animate-fadeIn
          "
        >
          {/* Search input */}
          <div className="p-2 border-b border-slate-800">
            <input
              autoFocus
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                w-full bg-slate-800 text-slate-200 text-sm 
                px-3 py-2 rounded-lg outline-none
              "
            />
          </div>

          {/* Role list */}
          <div className="p-1">
            {filteredRoles.length === 0 && (
              <p className="text-slate-500 text-sm px-3 py-2">No roles found</p>
            )}

            {filteredRoles.map((role) => {
              const selected = selectedRoles.some((r) => r.id === role.id);

              return (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left
                    ${selected ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"}
                  `}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  @{role.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
