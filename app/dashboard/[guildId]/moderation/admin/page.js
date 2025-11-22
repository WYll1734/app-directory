"use client";

import { useState, useEffect } from "react";
import ModerationTabs from "@/components/moderation/ModerationTabs";
import RoleMultiSelect from "@/components/moderation/RoleMultiSelect";

export default function AdminPage({ params }) {
  // FIXED — must match folder name [guildid]
  const guildId = params.guildid;

  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Fetch roles from API
  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetch(`/api/discord/guild/${guildId}/roles`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        // Sort roles by position
        const sorted = data.sort((a, b) => b.position - a.position);

        setRoles(sorted);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    }

    loadRoles();
  }, [guildId]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-50">Admin</h1>
        <p className="text-sm text-slate-400">
          Manage admin tools, immunity roles, and permissions for your server.
        </p>
      </div>

      {/* Tabs */}
      <ModerationTabs guildId={guildId} activeTab="admin" />

      {/* Immunity Roles */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Immunity Roles</h2>

        <p className="text-sm text-slate-400 mt-1">
          Members with these roles are ignored by AutoMod, Admin tools, and moderation commands.
        </p>

        <div className="mt-4">
          <RoleMultiSelect
            allRoles={roles}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />
        </div>
      </section>
    </div>
  );
}
