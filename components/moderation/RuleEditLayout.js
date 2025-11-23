"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

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

  // -----------------------------------------
  // FETCH ROLES + CHANNELS
  // -----------------------------------------
  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data: rolesData } = useSWR(
    `/api/discord/guild/${guildId}/roles`,
    fetcher
  );
  const { data: channelsData } = useSWR(
    `/api/discord/guild/${guildId}/channels`,
    fetcher
  );

  const roles = rolesData || [];
  const channels = channelsData || [];

  // -----------------------------------------
  // LOCAL STATE
  // -----------------------------------------
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${guildId}/moderation`}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            ← Back to AutoMod
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
            {description && (
              <p className="text-xs text-slate-400">{description}</p>
            )}
          </div>
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

      {/* Permissions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-slate-200">Permissions</h2>

        {/* Role permissions */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-slate-300">Role permissions</h3>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="rolePerms" defaultChecked />
            Deny for all roles except
          </label>

          {/* REAL ROLE SELECT */}
          <select
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select a role...</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="rolePerms" />
            Allow for all roles except
          </label>
        </div>

        {/* Channel permissions */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-slate-300">
            Channel permissions
          </h3>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="channelPerms" defaultChecked />
            Deny for all channels except
          </label>

          {/* REAL CHANNEL SELECT */}
          <select
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            <option value="">Select a channel...</option>

            {channels
              .filter((c) => c.type === 0 || c.type === 5 || c.type === 15) // text / announcement / forum
              .map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.name}
                </option>
              ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="channelPerms" />
            Allow for all channels except
          </label>
        </div>
      </div>

      {/* Rule-specific extra settings */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-slate-200">Additional settings</h2>

        {extraFields}
      </div>

      {/* Demo section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
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
      </div>
    </div>
  );
}
