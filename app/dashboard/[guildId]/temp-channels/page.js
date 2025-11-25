"use client";

import { useState, useMemo } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function TempChannelsPage({ params }) {
  const { guildId } = params; // not used yet but keep for future API calls

  const [moduleActive, setModuleActive] = useState(true);
  const [search, setSearch] = useState("");

  const [hubs] = useState([
    {
      id: "hub-1",
      name: "Hub - Join to create",
      channels: 1,
    },
    // later you can load these from API
  ]);

  const [commands, setCommands] = useState([
    {
      id: "voice-ban",
      name: "/voice-ban",
      description: "Ban a user from the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-claim",
      name: "/voice-claim",
      description: "Claim ownership of the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-clean",
      name: "/voice-clean",
      description: "Delete all the inactive temporary channels",
      enabled: true,
    },
    {
      id: "voice-hide",
      name: "/voice-hide",
      description: "Hide the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-kick",
      name: "/voice-kick",
      description: "Kick a user from the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-limit",
      name: "/voice-limit",
      description: "Change the user limit of the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-lock",
      name: "/voice-lock",
      description: "Lock the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-owner",
      name: "/voice-owner",
      description: "Check ownership of the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-rename",
      name: "/voice-rename",
      description: "Rename the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-reveal",
      name: "/voice-reveal",
      description: "Reveal the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-transfer",
      name: "/voice-transfer",
      description: "Transfer ownership of the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-unban",
      name: "/voice-unban",
      description: "Unban a user from the temporary voice channel",
      enabled: true,
    },
    {
      id: "voice-unlock",
      name: "/voice-unlock",
      description: "Unlock the temporary voice channel",
      enabled: true,
    },
  ]);

  const filteredHubs = useMemo(
    () =>
      hubs.filter((hub) =>
        hub.name.toLowerCase().includes(search.toLowerCase())
      ),
    [hubs, search]
  );

  function toggleCommand(id) {
    setCommands((prev) =>
      prev.map((cmd) =>
        cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd
      )
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Temporary Channels
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Allow your members to create temporary voice channels in one click
            in your server.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">Active</span>
          <Toggle
            checked={moduleActive}
            onChange={() => setModuleActive((v) => !v)}
          />
        </div>
      </header>

      {/* New Hub button */}
      <button
        type="button"
        className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-4 text-left shadow-sm transition hover:border-emerald-500/70 hover:bg-slate-900"
      >
        <div>
          <p className="text-sm font-medium text-slate-100">New Hub</p>
          <p className="mt-1 text-xs text-slate-400">
            Create a new hub where users can join to spawn their own voice
            channels.
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 text-lg font-semibold group-hover:border-emerald-500/80">
          <Plus className="h-4 w-4" />
        </span>
      </button>

      {/* Hubs section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-medium text-slate-200">Your Hubs</h2>
          <span className="text-xs text-slate-500">
            {hubs.length} / 100
          </span>
        </div>

        {/* Search */}
        <div className="border-b border-slate-800 px-5 py-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Hub list */}
        <div className="px-5 py-4">
          {filteredHubs.length === 0 ? (
            <p className="text-sm text-slate-500">No hubs found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredHubs.map((hub) => (
                <div
                  key={hub.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 transition hover:bg-slate-900"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{hub.name}</span>
                    <span className="mt-1 text-xs text-slate-400">
                      {hub.channels} active channel
                      {hub.channels === 1 ? "" : "s"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 hover:text-slate-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Commands section (always open) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-medium text-slate-200">Commands</h2>
        </div>

        <div className="divide-y divide-slate-900/80">
          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="max-w-xl">
                <p className="text-sm font-medium text-slate-100">
                  {cmd.name}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {cmd.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Toggle
                  checked={cmd.enabled}
                  onChange={() => toggleCommand(cmd.id)}
                />
                <button
                  type="button"
                  className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:border-emerald-500/80"
                >
                  Permissions
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
