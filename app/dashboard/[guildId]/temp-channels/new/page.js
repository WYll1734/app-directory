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
  const { guildId } = params; // reserved for future API usage

  // ===========================
  // HUB NAME
  // ===========================
  const [nameTemplate, setNameTemplate] = useState(
    "#{index} - {username}'s Channel"
  );

  const previewName = useMemo(() => {
    return nameTemplate
      .replace("{index}", "1")
      .replace("{username}", "Username");
  }, [nameTemplate]);

  // ===========================
  // SETTINGS SLIDERS
  // ===========================
  const [userLimit, setUserLimit] = useState(0); // 0 = ∞
  const [bitrate, setBitrate] = useState(64); // kbps
  const [keepAlive, setKeepAlive] = useState(5); // minutes, 0 = immediately, 10 = ∞ visually
  const [ownershipLock, setOwnershipLock] = useState(2);

  // ===========================
  // PERMISSIONS
  // ===========================
  const [syncCategory, setSyncCategory] = useState(false);
  const [syncChannel, setSyncChannel] = useState(false);

  const [roleMode, setRoleMode] = useState<"deny" | "allow">("allow");
  const [accessRole, setAccessRole] = useState("");
  const [alsoAccessByRoles, setAlsoAccessByRoles] = useState(false);
  const [ignoredRole, setIgnoredRole] = useState("");
  const [moderatorRole, setModeratorRole] = useState("");

  // ===========================
  // OWNER PERMISSIONS
  // ===========================
  const [ownerPerms, setOwnerPerms] = useState({
    manageChannels: false,
    managePermissions: false,
    prioritySpeaker: false,
    moveMembers: false,
  });

  // ===========================
  // TEXT CHANNEL SETTINGS
  // ===========================
  const [textChannelSettings, setTextChannelSettings] = useState({
    enabled: false,
    restrictCommands: false,
    pinUsages: false,
    restrictTextChannel: false,
  });

  const handleOwnerPermToggle = (key: keyof typeof ownerPerms) => {
    setOwnerPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTextChannelToggle = (
    key: keyof typeof textChannelSettings
  ) => {
    setTextChannelSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDiscard = () => {
    // just reset everything for now
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
    // placeholder — hook into API later
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
    console.log("Save Temp Hub config:", payload);
  };

  const renderInfinityLabel = (value: number) => {
    return value === 0 ? "∞" : value;
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${guildId}/temp-channels`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-slate-300 hover:text-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-100">New Hub</h1>
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
            Hub <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Temporary Channels Name
            </span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              value={nameTemplate}
              onChange={(e) => setNameTemplate(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Channel name for all temporary channels. Can be changed on Discord
              directly for each channel separately. Can include{" "}
              <span className="font-mono text-slate-300">{`{index}`}</span> and{" "}
              <span className="font-mono text-slate-300">{`{username}`}</span>.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Preview:
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-100">
                <Volume2 className="h-3 w-3" />
              </span>
              <span>{previewName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SETTINGS SECTION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Settings <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-8">
          {/* User Limit */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">User Limit</h3>
            <p className="mt-1 text-xs text-slate-400">
              Default user limit for all temporary voice channels. Can be
              changed on Discord directly for each channel separately.
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>∞</span>
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>99</span>
              </div>
              <input
                type="range"
                min={0}
                max={99}
                value={userLimit}
                onChange={(e) => setUserLimit(Number(e.target.value))}
                className="mt-2 w-full cursor-pointer accent-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Current:{" "}
                <span className="font-semibold text-slate-200">
                  {userLimit === 0 ? "∞ (no limit)" : userLimit}
                </span>
              </p>
            </div>
          </div>

          {/* Bitrate */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">Bitrate</h3>
            <p className="mt-1 text-xs text-slate-400">
              Default bitrate in kbps for all temporary voice channels. Can be
              changed on Discord directly for each channel separately.
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>8</span>
                <span>64</span>
                <span>128</span>
                <span>256</span>
                <span>384</span>
              </div>
              <input
                type="range"
                min={8}
                max={384}
                step={8}
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                className="mt-2 w-full cursor-pointer accent-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Current:{" "}
                <span className="font-semibold text-slate-200">
                  {bitrate} kbps
                </span>
              </p>
            </div>
          </div>

          {/* Keep Alive */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">Keep Alive</h3>
            <p className="mt-1 text-xs text-slate-400">
              Duration in minutes until the temporary channels are deleted after
              everyone has left the temporary voice channel. 0 is immediately, ∞
              is never.
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>∞</span>
                <span>0</span>
                <span>1</span>
                <span>3</span>
                <span>5</span>
                <span>10</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={keepAlive}
                onChange={(e) => setKeepAlive(Number(e.target.value))}
                className="mt-2 w-full cursor-pointer accent-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Current:{" "}
                <span className="font-semibold text-slate-200">
                  {keepAlive === 10
                    ? "∞ (never delete)"
                    : `${keepAlive} min`}
                </span>
              </p>
            </div>
          </div>

          {/* Ownership lock */}
          <div>
            <h3 className="text-sm font-medium text-slate-100">
              Ownership lock
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Duration in minutes until the temporary channels are available for
              ownership takeover after the owner has left the temporary voice
              channel. 0 is immediately, ∞ is never.
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>∞</span>
                <span>0</span>
                <span>1</span>
                <span>3</span>
                <span>5</span>
                <span>10</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={ownershipLock}
                onChange={(e) => setOwnershipLock(Number(e.target.value))}
                className="mt-2 w-full cursor-pointer accent-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Current:{" "}
                <span className="font-semibold text-slate-200">
                  {ownershipLock === 10
                    ? "∞ (never available)"
                    : `${ownershipLock} min`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERMISSIONS SECTION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Permissions <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-7">
          {/* Sync toggles */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  Synchronize permissions with Hub category
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Synchronize the permissions of the temporary channels when
                  they are created with the permissions of the Hub category.
                </p>
              </div>
              <Toggle
                checked={syncCategory}
                onChange={() => setSyncCategory((v) => !v)}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  Synchronize permissions with Hub channel
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Synchronize the permissions of the temporary channels when
                  they are created with the permissions of the Hub channel.
                </p>
              </div>
              <Toggle
                checked={syncChannel}
                onChange={() => setSyncChannel((v) => !v)}
              />
            </div>
          </div>

          {/* Role permissions mode */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-100">
              Role permissions
            </h3>
            <div className="space-y-2 text-sm text-slate-200">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="roleMode"
                  className="h-3 w-3"
                  checked={roleMode === "deny"}
                  onChange={() => setRoleMode("deny")}
                />
                <span>Deny for all roles except</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="roleMode"
                  className="h-3 w-3"
                  checked={roleMode === "allow"}
                  onChange={() => setRoleMode("allow")}
                />
                <span>Allow for all roles except</span>
              </label>
            </div>

            {/* Access role selector */}
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Access roles
              </div>
              <button
                type="button"
                className="mt-1 flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                onClick={() => setAccessRole("Example Role")}
              >
                <span>{accessRole || "Select a role"}</span>
                <span className="text-xs text-slate-500">Role picker (soon)</span>
              </button>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-200">
                    Also use these roles to handle access to the temporary
                    channels.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Users with these roles will be able to create and join
                    temporary channels even if other restrictions apply.
                  </p>
                </div>
                <Toggle
                  checked={alsoAccessByRoles}
                  onChange={() => setAlsoAccessByRoles((v) => !v)}
                />
              </div>
            </div>
          </div>

          {/* Ignored + Moderator roles */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ignored roles
              </p>
              <button
                type="button"
                className="mt-1 flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                onClick={() => setIgnoredRole("Ignored Role")}
              >
                <span>{ignoredRole || "Select a role"}</span>
                <span className="text-xs text-slate-500">Role picker (soon)</span>
              </button>
              <p className="mt-1 text-xs text-slate-500">
                Users with one of these roles will NOT be impacted by the
                /voice-* commands.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Moderator roles
              </p>
              <button
                type="button"
                className="mt-1 flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                onClick={() => setModeratorRole("Moderator Role")}
              >
                <span>{moderatorRole || "Select a role"}</span>
                <span className="text-xs text-slate-500">Role picker (soon)</span>
              </button>
              <p className="mt-1 text-xs text-slate-500">
                Users with one of these roles can run the /voice-* commands
                without being the owners of the temporary channels and are NOT
                impacted by them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER PERMISSIONS SECTION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Owner Permissions <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-4">
          {[
            {
              key: "manageChannels" as const,
              title: "Manage Channels",
              desc: "The user that triggered the temporary channels creation can rename them on Discord and change the temporary voice channel user limit.",
            },
            {
              key: "managePermissions" as const,
              title: "Manage Permissions",
              desc: "The user that triggered the temporary channels creation can manage their advanced permissions on Discord.",
            },
            {
              key: "prioritySpeaker" as const,
              title: "Priority Speaker",
              desc: "The user that triggered the temporary channels creation will be the only priority speaker of the temporary voice channel on Discord.",
            },
            {
              key: "moveMembers" as const,
              title: "Move Members",
              desc: "The user that triggered the temporary channels creation can disconnect other users from the temporary voice channel on Discord.",
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
                <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
              </div>
              <Toggle
                checked={ownerPerms[item.key]}
                onChange={() => handleOwnerPermToggle(item.key)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* TEXT CHANNEL SECTION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Text Channel <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-4">
          {[
            {
              key: "enabled" as const,
              title: "Text Channel",
              desc: "Create a temporary text channel associated to the temporary voice channel.",
            },
            {
              key: "restrictCommands" as const,
              title: "Restrict commands to this channel",
              desc: "/voice-* commands can only be run in the associated temporary text channel.",
            },
            {
              key: "pinUsages" as const,
              title: "Pin command usages",
              desc: "Pin an embed message containing the /voice-* commands usages and descriptions in the associated temporary text channel.",
            },
            {
              key: "restrictTextChannel" as const,
              title: "Restrict text channel",
              desc: "Only bot masters, moderators, and users connected to the temporary voice channel will be able to read and send messages in the associated temporary text channel.",
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
                <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
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
