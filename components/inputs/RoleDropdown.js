"use client";

import { useState } from "react";

export default function RoleDropdown({ btn, roles, loading, updateButton }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const safeRoles = Array.isArray(roles) ? roles : [];

  const filteredRoles = safeRoles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (role) => {
    updateButton(btn.id, "roleId", role.id);
    setOpen(false);
  };

  const selectedRoleLabel = () => {
    if (loading) return "Loading...";
    if (!btn.roleId) return "Select a role";
    const role = safeRoles.find((r) => r.id === btn.roleId);
    return role ? role.name : "Unknown role";
  };

  return (
    <div className="relative w-full md:max-w-[160px]">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-left text-xs text-slate-200"
      >
        {selectedRoleLabel()}
        <span className="float-right text-slate-400">{open ? "▴" : "▾"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 shadow-xl max-h-64 overflow-y-auto">
          {/* SEARCH BAR */}
          <div className="p-2 border-b border-slate-800">
            <input
              className="w-full rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-200 border border-slate-700 outline-none"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LOADING */}
          {loading && (
            <div className="px-3 py-2 text-xs text-slate-400">
              Loading roles...
            </div>
          )}

          {/* NO ROLES */}
          {!loading && filteredRoles.length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-500">
              No roles found
            </div>
          )}

          {/* LIST */}
          {!loading &&
            filteredRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelect(role)}
                className={`flex w-full px-3 py-2 text-left text-xs hover:bg-slate-800 ${
                  btn.roleId === role.id ? "text-indigo-400" : "text-slate-300"
                }`}
              >
                {role.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
