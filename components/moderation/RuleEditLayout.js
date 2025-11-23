"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import RoleMultiSelect from "@/components/inputs/RoleMultiSelect";
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

  // === STATE ===
  const [roles, setRoles] = useState([]);
  const [channels, setChannels] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState([]);     // MULTI
  const [selectedChannels, setSelectedChannels] = useState([]); // MULTI

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // === FETCH ROLES + CHANNELS ===
  useEffect(() => {
    async function load() {
      try {
        const [r, c] = await Promise.all([
          fetch(`/api/discord/guild/${guildId}/roles`).then((res) => res.json()),
          fetch(`/api/discord/guild/${guildId}/channels`).then((res) =>
            res.json()
          ),
        ]);

        if (!r.ok) throw new Error("Failed to load roles");
        if (!c.ok) throw new Error("Failed to load channels");

        setRoles(r.roles || []);
        setChannels(c.channels || []);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [guildId]);

  if (loading) {
    return (
      <div className="text-slate-300 text-sm">
        Loading rule editor…
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-red-400 text-sm">
        Error: {fetchError}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* TOP BAR */}
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
            <p className="text-xs text-slate-400">{description}</p>
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

      {/* PERMISSIONS */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-slate-200">Permissions</h2>

        {/* ROLE PERMISSIONS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-slate-300">Role permissions</h3>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="rolePerms" defaultChecked />
            Deny for all roles except:
          </label>

          <RoleMultiSelect
            roles={roles}
            value={selectedRoles}
            onChange={setSelectedRoles}
          />

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="rolePerms" />
            Allow for all roles except:
          </label>
        </div>

        {/* CHANNEL PERMISSIONS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-slate-300">
            Channel permissions
          </h3>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="channelPerms" defaultChecked />
            Deny for all channels except:
          </label>

          <ChannelMultiSelect
            channels={channels}
            value={selectedChannels}
            onChange={setSelectedChannels}
          />

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name="channelPerms" />
            Allow for all channels except:
          </label>
        </div>
      </div>

      {/* EXTRA RULE SETTINGS */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-slate-200">Additional settings</h2>

        {extraFields}
      </div>

      {/* DEMO SECTION */}
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
