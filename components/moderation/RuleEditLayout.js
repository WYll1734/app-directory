"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import RoleMultiSelect from "@/components/moderation/RoleMultiSelect";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function RuleEditLayout({ guildId, ruleConfig }) {
  const {
    id,
    title,
    description,
    extraFields,
    demoTitle,
    demoExactLabel,
    demoAnyLabel,
  } = ruleConfig;

  const [roles, setRoles] = useState([]);
  const [channels, setChannels] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================================
  // Fetch roles & channels
  // ================================
  useEffect(() => {
    let cancel = false;

    async function loadAll() {
      setLoading(true);

      try {
        const [rolesRes, channelsRes] = await Promise.all([
          fetch(`/api/discord/guilds/${guildId}/roles`),
          fetch(`/api/discord/guilds/${guildId}/channels`),
        ]);

        const rolesJson = await rolesRes.json();
        const channelsJson = await channelsRes.json();

        if (cancel) return;

        setRoles(
          Array.isArray(rolesJson.roles)
            ? [...rolesJson.roles].sort((a, b) => b.position - a.position)
            : []
        );

        setChannels(Array.isArray(channelsJson.channels) ? channelsJson.channels : []);
      } catch (e) {
        console.error("Failed to load:", e);
        if (!cancel) {
          setRoles([]);
          setChannels([]);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    loadAll();
    return () => (cancel = true);
  }, [guildId]);

  if (loading) {
    return (
      <p className="text-slate-300 text-sm animate-pulse">Loading permissions…</p>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* ====================== HEADER ====================== */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/dashboard/${guildId}/moderation`}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            ← Back to AutoMod
          </Link>

          <h1 className="mt-2 text-xl font-semibold text-slate-100">{title}</h1>

          {description && (
            <p className="text-xs text-slate-400 max-w-2xl mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
            Discard
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
            Save &amp; Close
          </button>
        </div>
      </div>

      {/* ====================== PERMISSIONS CARD ====================== */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-8">

        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-200">Permissions</h2>
          <p className="text-[11px] text-slate-500">
            {selectedRoles.length} role{selectedRoles.length !== 1 && "s"} ·{" "}
            {selectedChannels.length} channel
            {selectedChannels.length !== 1 && "s"}
          </p>
        </div>

        {/* ====================== Role Permissions ====================== */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300">Role permissions</h3>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="rolePerms" defaultChecked />
            Deny for all roles except
          </label>

          <RoleMultiSelect
            allRoles={roles}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />

          <label className="flex items-center gap-2 text-sm text-slate-300 mt-2">
            <input type="radio" name="rolePerms" />
            Allow for all roles except
          </label>
        </div>

        {/* ====================== Channel Permissions ====================== */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300">Channel permissions</h3>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="channelPerms" defaultChecked />
            Deny for all channels except
          </label>

          <ChannelMultiSelect
            channels={channels}
            values={selectedChannels}
            onChange={setSelectedChannels}
          />

          <label className="flex items-center gap-2 text-sm text-slate-300 mt-2">
            <input type="radio" name="channelPerms" />
            Allow for all channels except
          </label>
        </div>
      </section>

      {/* ====================== Additional Settings ====================== */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
        <h2 className="font-semibold text-slate-200">Additional settings</h2>
        {extraFields}
      </section>

      {/* ====================== DEMO PREVIEW ====================== */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
        <h2 className="font-semibold text-slate-200">How does it work?</h2>

        <p className="text-sm text-slate-400">{demoTitle}</p>

        <div>
          <p className="text-xs text-slate-400 mb-1">Exact match</p>
          <div className="rounded-lg bg-slate-800 p-3 text-sm text-slate-200">
            <b>ServerMate</b>{" "}
            <span className="text-indigo-400 ml-1 text-[11px]">BOT</span>
            <br />
            {demoExactLabel}
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Match any part</p>
          <div className="rounded-lg bg-slate-800 p-3 text-sm text-slate-200">
            <b>ServerMate</b>{" "}
            <span className="text-indigo-400 ml-1 text-[11px]">BOT</span>
            <br />
            {demoAnyLabel}
          </div>
        </div>
      </section>
    </div>
  );
}
