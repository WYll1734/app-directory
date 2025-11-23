"use client";

import { useState, useEffect } from "react";
import ModerationTabs from "@/components/moderation/ModerationTabs";
import RoleMultiSelect from "@/components/inputs/RoleMultiSelect"; // ← updated path

export default function AdminPage({ params }) {
  const guildId = params.guildId;

  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/roles`); // ← FIXED URL
        const data = await res.json();

        if (!data?.roles) return;

        // Sort like Discord
        const sorted = [...data.roles].sort((a, b) => b.position - a.position);
        setRoles(sorted);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    }

    loadRoles();
  }, [guildId]);

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-50">Admin</h1>
        <p className="text-sm text-slate-400">
          Manage admin tools, immunity roles, and permissions for your server.
        </p>
      </div>

      {/* TABS */}
      <ModerationTabs guildId={guildId} activeTab="admin" />

      {/* IMMUNITY ROLES */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Immunity Roles</h2>

        <p className="text-sm text-slate-400 mt-1">
          Members with these roles are ignored by AutoMod, Admin tools, and moderation commands.
        </p>

        <div className="mt-4">
          <RoleMultiSelect
            roles={roles}
            value={selectedRoles}
            onChange={setSelectedRoles}
          />
        </div>
      </section>
    </div>
  );
}
