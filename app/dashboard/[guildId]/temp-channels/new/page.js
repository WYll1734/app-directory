"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Volume2 } from "lucide-react";

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

export default function NewTempHubPage({ params }) {
  const { guildId } = params;

  // HUB NAME
  const [nameTemplate, setNameTemplate] = useState(
    "#{index} - {username}'s Channel"
  );

  const previewName = useMemo(
    () =>
      nameTemplate
        .replace("{index}", "1")
        .replace("{username}", "Username"),
    [nameTemplate]
  );

  // SETTINGS
  const [userLimit, setUserLimit] = useState(0);
  const [bitrate, setBitrate] = useState(64);
  const [keepAlive, setKeepAlive] = useState(5);
  const [ownershipLock, setOwnershipLock] = useState(2);

  // PERMISSIONS
  const [syncCategory, setSyncCategory] = useState(false);
  const [syncChannel, setSyncChannel] = useState(false);
  const [roleMode, setRoleMode] = useState("allow");

  const [accessRole, setAccessRole] = useState("");
  const [alsoAccessByRoles, setAlsoAccessByRoles] = useState(false);
  const [ignoredRole, setIgnoredRole] = useState("");
  const [moderatorRole, setModeratorRole] = useState("");

  // OWNER PERMISSIONS
  const [ownerPerms, setOwnerPerms] = useState({
    manageChannels: false,
    managePermissions: false,
    prioritySpeaker: false,
    moveMembers: false,
  });

  const handleOwnerPermToggle = (key) => {
    setOwnerPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // TEXT CHANNEL
  const [textChannelSettings, setTextChannelSettings] = useState({
    enabled: false,
    restrictCommands: false,
    pinUsages: false,
    restrictTextChannel: false,
  });

  const handleTextChannelToggle = (key) => {
    setTextChannelSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDiscard = () => {
    setNameTemplate("#{index} - {username}'s Channel");
    setUserLimit(0);
    setBitrate(64);
    setKeepAlive(5);
    setOwnershipLock(2);
    setSyncCategory(false);
    setSyncChannel(false);
    setRoleMode("allow");

    setAccessRole("");
    setAlsoAccessByRoles(false);
    setIgnoredRole("");
    setModeratorRole("");

    setOwnerPerms({
      manageChannels: false,
      managePermissions: false,
      prioritySpeaker: false,
      moveMembers: false,
    });

    setTextChannelSettings({
      enabled: false,
      restrictCommands: false,
      pinUsages: false,
      restrictTextChannel: false,
    });
  };

  const handleSave = () => {
    const payload = {
      guildId,
      nameTemplate,
      userLimit,
      bitrate,
      keepAlive,
      ownershipLock,
      syncCategory,
      syncChannel,
      roleMode,
      accessRole,
      alsoAccessByRoles,
      ignoredRole,
      moderatorRole,
      ownerPerms,
      textChannelSettings,
    };

    console.log("Saving new hub:", payload);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${guildId}/temp-channels`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-slate-300 hover:text-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <h1 className="text-lg font-semibold text-slate-100">
            New Hub
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Save
          </button>
        </div>
      </div>

      {/* HUB SECTION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Hub 👑
          </h2>
        </header>

        <div className="px-5 py-5">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Temporary Channels Name
            </span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              value={nameTemplate}
              onChange={(e) => setNameTemplate(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Supports {"{index}"} and {"{username}"}
            </p>
          </div>

          {/* PREVIEW */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400">Preview</p>

            <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800">
                <Volume2 className="h-3 w-3" />
              </span>
              {previewName}
            </div>
          </div>
        </div>
      </section>

      {/* SETTINGS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Settings 👑
          </h2>
        </header>

        <div className="px-5 py-5 space-y-10">
          {/* USER LIMIT */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">User Limit</h3>
            <p className="text-xs text-slate-500">
              0 = unlimited
            </p>
            <input
              type="range"
              min={0}
              max={99}
              value={userLimit}
              onChange={(e) => setUserLimit(Number(e.target.value))}
              className="mt-3 w-full accent-emerald-500"
            />
          </div>

          {/* BITRATE */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">Bitrate</h3>
            <input
              type="range"
              min={8}
              max={384}
              step={8}
              value={bitrate}
              onChange={(e) => setBitrate(Number(e.target.value))}
              className="mt-3 w-full accent-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              {bitrate} kbps
            </p>
          </div>

          {/* KEEP ALIVE */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">Keep Alive</h3>
            <input
              type="range"
              min={0}
              max={10}
              value={keepAlive}
              onChange={(e) => setKeepAlive(Number(e.target.value))}
              className="mt-3 w-full accent-emerald-500"
            />
          </div>

          {/* OWNERSHIP LOCK */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">
              Ownership Lock
            </h3>
            <input
              type="range"
              min={0}
              max={10}
              value={ownershipLock}
              onChange={(e) => setOwnershipLock(Number(e.target.value))}
              className="mt-3 w-full accent-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* PERMISSIONS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Permissions 👑
          </h2>
        </header>

        <div className="px-5 py-5 space-y-7">
          {/* Sync toggles */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-sm text-slate-200">
                Sync with Hub category
              </p>
              <p className="text-xs text-slate-500">
                Copies category permissions
              </p>
            </div>
            <Toggle
              checked={syncCategory}
              onChange={() => setSyncCategory(!syncCategory)}
            />
          </div>

          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-sm text-slate-200">
                Sync with Hub channel
              </p>
              <p className="text-xs text-slate-500">
                Copies channel permissions
              </p>
            </div>
            <Toggle
              checked={syncChannel}
              onChange={() => setSyncChannel(!syncChannel)}
            />
          </div>

          {/* Role mode */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">
              Role permissions
            </h3>

            <div className="mt-2 space-y-2 text-sm text-slate-200">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={roleMode === "deny"}
                  onChange={() => setRoleMode("deny")}
                />
                Deny for all roles except
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={roleMode === "allow"}
                  onChange={() => setRoleMode("allow")}
                />
                Allow for all roles except
              </label>
            </div>

            {/* Access role */}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Access role
              </p>
              <button
                className="mt-1 w-full flex items-center justify-between rounded-lg border bg-slate-900 border-slate-800 px-3 py-2 text-sm"
                onClick={() => setAccessRole("Example Role")}
              >
                <span>{accessRole || "Select a role"}</span>
              </button>

              {/* Use for access */}
              <div className="mt-4 flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-slate-200">
                    Also use these roles for access
                  </p>
                  <p className="text-xs text-slate-500">
                    (Applies additional access roles)
                  </p>
                </div>
                <Toggle
                  checked={alsoAccessByRoles}
                  onChange={() =>
                    setAlsoAccessByRoles(!alsoAccessByRoles)
                  }
                />
              </div>
            </div>
          </div>

          {/* Ignored + Moderator roles */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Ignored roles
              </p>
              <button
                className="mt-1 w-full flex items-center justify-between rounded-lg border bg-slate-900 border-slate-800 px-3 py-2 text-sm"
                onClick={() => setIgnoredRole("Ignored Role")}
              >
                <span>{ignoredRole || "Select a role"}</span>
              </button>

              <p className="mt-1 text-xs text-slate-500">
                These roles bypass /voice- commands
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Moderator roles
              </p>

              <button
                className="mt-1 w-full flex items-center justify-between rounded-lg border bg-slate-900 border-slate-800 px-3 py-2 text-sm"
                onClick={() => setModeratorRole("Moderator Role")}
              >
                <span>{moderatorRole || "Select a role"}</span>
              </button>

              <p className="mt-1 text-xs text-slate-500">
                Moderators can run /voice- commands
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER PERMISSIONS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Owner Permissions 👑
          </h2>
        </header>

        <div className="px-5 py-5 space-y-4">
          {[
            {
              key: "manageChannels",
              title: "Manage Channels",
              desc: "Rename temporary channels & adjust limits.",
            },
            {
              key: "managePermissions",
              title: "Manage Permissions",
              desc: "Edit advanced channel permissions.",
            },
            {
              key: "prioritySpeaker",
              title: "Priority Speaker",
              desc: "Owner becomes the only priority speaker.",
            },
            {
              key: "moveMembers",
              title: "Move Members",
              desc: "Owner can disconnect other users.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-4 rounded-xl bg-slate-900/40 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.desc}
                </p>
              </div>

              <Toggle
                checked={ownerPerms[item.key]}
                onChange={() => handleOwnerPermToggle(item.key)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* TEXT CHANNEL */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Text Channel 👑
          </h2>
        </header>

        <div className="px-5 py-5 space-y-4">
          {[
            {
              key: "enabled",
              title: "Text Channel",
              desc: "Create a temporary text channel.",
            },
            {
              key: "restrictCommands",
              title: "Restrict commands",
              desc: "Commands only usable inside temp text channel.",
            },
            {
              key: "pinUsages",
              title: "Pin usages",
              desc: "Pins embed with /voice- command usage.",
            },
            {
              key: "restrictTextChannel",
              title: "Restrict text channel",
              desc: "Only connected users can read & send messages.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-4 rounded-xl bg-slate-900/40 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.desc}
                </p>
              </div>

              <Toggle
                checked={textChannelSettings[item.key]}
                onChange={() => handleTextChannelToggle(item.key)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
