"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ChevronLeft, Volume2 } from "lucide-react";
import RoleDropdown from "@/components/inputs/RoleDropdown";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";

const fetcher = (url) => fetch(url).then((r) => r.json());

// ---------------------------------------------------
// Reusable Toggle
// ---------------------------------------------------
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

// ---------------------------------------------------
// Reusable Slider Row – smooth + live value
// ---------------------------------------------------
function SliderRow({
  label,
  helper,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
}) {
  const display = formatValue ? formatValue(value) : value;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-100">{label}</h3>
          {helper && (
            <p className="mt-0.5 text-xs text-slate-500">{helper}</p>
          )}
        </div>
        <div className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-emerald-400">
          {display}
        </div>
      </div>

      <div className="relative mt-1">
        {/* subtle track background */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-800" />
        {/* native slider on top */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 w-full cursor-pointer appearance-none bg-transparent focus:outline-none
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-emerald-500
                     [&::-webkit-slider-thumb]:shadow
                     [&::-webkit-slider-runnable-track]:h-1
                     [&::-webkit-slider-runnable-track]:rounded-full
                     [&::-webkit-slider-runnable-track]:bg-transparent
                     accent-emerald-500"
        />
      </div>
    </div>
  );
}

export default function NewTempHubPage({ params }) {
  const { guildId } = params;

  // ================================
  // FETCH ROLES & CHANNELS
  // ================================
  const {
    data: rolesData,
    error: rolesError,
    isLoading: rolesLoading,
  } = useSWR(`/api/discord/guilds/${guildId}/roles`, fetcher);

  const {
    data: channelsData,
    error: channelsError,
    isLoading: channelsLoading,
  } = useSWR(`/api/discord/guilds/${guildId}/channels`, fetcher);

  const roles = rolesData?.roles ?? [];
  const channels = channelsData?.channels ?? [];

  const voiceChannels = channels.filter((c) => c.type === 2);
  const categoryChannels = channels.filter((c) => c.type === 4);

  // ================================
  // HUB NAME
  // ================================
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

  // ================================
  // SETTINGS
  // ================================
  const [userLimit, setUserLimit] = useState(0); // 0 = unlimited
  const [bitrate, setBitrate] = useState(64); // kbps
  const [keepAlive, setKeepAlive] = useState(5); // minutes
  const [ownershipLock, setOwnershipLock] = useState(2); // minutes

  // ================================
  // HUB LOCATION (CHANNEL + CATEGORY)
// ================================
  const [hubChannel, setHubChannel] = useState(null); // full channel object
  const [hubCategory, setHubCategory] = useState(null); // full category object

  // ================================
  // PERMISSIONS
  // ================================
  const [syncCategory, setSyncCategory] = useState(false);
  const [syncChannel, setSyncChannel] = useState(false);
  const [roleMode, setRoleMode] = useState("allow"); // "allow" | "deny"

  // These follow the btn shape RoleDropdown expects: { id, roleId }
  const [accessRoleBtn, setAccessRoleBtn] = useState({
    id: "access-role",
    roleId: "",
  });
  const [ignoredRoleBtn, setIgnoredRoleBtn] = useState({
    id: "ignored-role",
    roleId: "",
  });
  const [moderatorRoleBtn, setModeratorRoleBtn] = useState({
    id: "moderator-role",
    roleId: "",
  });

  const [alsoAccessByRoles, setAlsoAccessByRoles] = useState(false);

  // RoleDropdown-style update handlers
  const updateAccessRoleBtn = (id, field, value) => {
    if (field !== "roleId") return;
    setAccessRoleBtn((prev) => ({ ...prev, roleId: value }));
  };

  const updateIgnoredRoleBtn = (id, field, value) => {
    if (field !== "roleId") return;
    setIgnoredRoleBtn((prev) => ({ ...prev, roleId: value }));
  };

  const updateModeratorRoleBtn = (id, field, value) => {
    if (field !== "roleId") return;
    setModeratorRoleBtn((prev) => ({ ...prev, roleId: value }));
  };

  // ================================
  // OWNER PERMISSIONS
  // ================================
  const [ownerPerms, setOwnerPerms] = useState({
    manageChannels: false,
    managePermissions: false,
    prioritySpeaker: false,
    moveMembers: false,
  });

  const handleOwnerPermToggle = (key) => {
    setOwnerPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ================================
  // TEXT CHANNEL
  // ================================
  const [textChannelSettings, setTextChannelSettings] = useState({
    enabled: false,
    restrictCommands: false,
    pinUsages: false,
    restrictTextChannel: false,
  });

  const handleTextChannelToggle = (key) => {
    setTextChannelSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ================================
  // ACTIONS
  // ================================
  const handleDiscard = () => {
    setNameTemplate("#{index} - {username}'s Channel");
    setUserLimit(0);
    setBitrate(64);
    setKeepAlive(5);
    setOwnershipLock(2);
    setHubChannel(null);
    setHubCategory(null);
    setSyncCategory(false);
    setSyncChannel(false);
    setRoleMode("allow");
    setAccessRoleBtn({ id: "access-role", roleId: "" });
    setIgnoredRoleBtn({ id: "ignored-role", roleId: "" });
    setModeratorRoleBtn({ id: "moderator-role", roleId: "" });
    setAlsoAccessByRoles(false);
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
      settings: {
        userLimit,
        bitrate,
        keepAlive,
        ownershipLock,
      },
      hubLocation: {
        hubChannelId: hubChannel?.id ?? null,
        hubCategoryId: hubCategory?.id ?? null,
      },
      permissions: {
        syncCategory,
        syncChannel,
        roleMode,
        accessRoleId: accessRoleBtn.roleId || null,
        ignoredRoleId: ignoredRoleBtn.roleId || null,
        moderatorRoleId: moderatorRoleBtn.roleId || null,
        alsoAccessByRoles,
      },
      ownerPerms,
      textChannelSettings,
    };

    console.log("Saving new hub:", payload);
    // later: POST to /api/dashboard/[guildId]/temp-channels
  };

  // ================================
  // RENDER
  // ================================
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

          <div>
            <h1 className="text-lg font-semibold text-slate-100">
              New Hub
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Configure how temporary voice channels behave for this hub.
            </p>
          </div>
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

      {/* HUB NAME */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Hub <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Temporary Channels Name
            </span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              value={nameTemplate}
              onChange={(e) => setNameTemplate(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Supports{" "}
              <span className="font-mono text-slate-300">{`{index}`}</span> and{" "}
              <span className="font-mono text-slate-300">{`{username}`}</span>.
            </p>
          </div>

          {/* PREVIEW */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Preview
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800">
                <Volume2 className="h-3 w-3" />
              </span>
              <span>{previewName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* HUB LOCATION (CHANNEL + CATEGORY) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Hub Location <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Hub voice channel
            </p>
            <ChannelDropdown
              channels={voiceChannels}
              value={hubChannel}
              onChange={setHubChannel}
            />
            {channelsLoading && (
              <p className="text-xs text-slate-500 mt-1">
                Loading channels…
              </p>
            )}
            {channelsError && (
              <p className="text-xs text-red-400 mt-1">
                Failed to load channels.
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Members will join this channel to create their own temporary
              voice channels.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Category for temporary channels
            </p>
            <ChannelDropdown
              channels={categoryChannels}
              value={hubCategory}
              onChange={setHubCategory}
            />
            <p className="text-xs text-slate-500 mt-1">
              New temporary channels for this hub will be created under this
              category (optional).
            </p>
          </div>
        </div>
      </section>

      {/* SETTINGS – sliders */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Settings <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-8">
          <SliderRow
            label="User Limit"
            helper="0 = unlimited"
            min={0}
            max={99}
            value={userLimit}
            onChange={setUserLimit}
            formatValue={(v) => (v === 0 ? "∞ (unlimited)" : v)}
          />

          <SliderRow
            label="Bitrate"
            helper="Default bitrate for new temporary channels."
            min={8}
            max={384}
            step={8}
            value={bitrate}
            onChange={setBitrate}
            formatValue={(v) => `${v} kbps`}
          />

          <SliderRow
            label="Keep Alive"
            helper="How long to keep the channel after everyone leaves."
            min={0}
            max={10}
            value={keepAlive}
            onChange={setKeepAlive}
            formatValue={(v) =>
              v === 0 ? "Delete immediately" : `${v} min`
            }
          />

          <SliderRow
            label="Ownership Lock"
            helper="How long before others can take ownership once the owner leaves."
            min={0}
            max={10}
            value={ownershipLock}
            onChange={setOwnershipLock}
            formatValue={(v) =>
              v === 0 ? "Immediately available" : `${v} min`
            }
          />
        </div>
      </section>

      {/* PERMISSIONS – RoleDropdown style */}
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
                  Sync with Hub category
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Copy permissions from the category of the hub channel.
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
                  Sync with Hub channel
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Copy permissions directly from the hub voice channel.
                </p>
              </div>
              <Toggle
                checked={syncChannel}
                onChange={() => setSyncChannel((v) => !v)}
              />
            </div>
          </div>

          {/* Role mode */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-100">
              Role permissions
            </h3>
            <div className="space-y-2 text-sm text-slate-200">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="h-3 w-3"
                  checked={roleMode === "deny"}
                  onChange={() => setRoleMode("deny")}
                />
                <span>Deny for all roles except</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="h-3 w-3"
                  checked={roleMode === "allow"}
                  onChange={() => setRoleMode("allow")}
                />
                <span>Allow for all roles except</span>
              </label>
            </div>

            {/* Access role – RoleDropdown style */}
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Access role
              </p>
              <RoleDropdown
                btn={accessRoleBtn}
                roles={roles}
                loading={rolesLoading}
                updateButton={updateAccessRoleBtn}
              />
              {rolesError && (
                <p className="text-xs text-red-400 mt-1">
                  Failed to load roles.
                </p>
              )}
            </div>

            {/* Extra access toggle */}
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-200">
                  Also use these roles for temporary channel access
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Users with the access role can always join and create
                  temporary channels for this hub.
                </p>
              </div>
              <Toggle
                checked={alsoAccessByRoles}
                onChange={() => setAlsoAccessByRoles((v) => !v)}
              />
            </div>
          </div>

          {/* Ignored + Moderator roles – RoleDropdown style */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ignored roles
              </p>
              <RoleDropdown
                btn={ignoredRoleBtn}
                roles={roles}
                loading={rolesLoading}
                updateButton={updateIgnoredRoleBtn}
              />
              <p className="text-xs text-slate-500 mt-1">
                Users with this role will not be affected by /voice-* commands.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Moderator roles
              </p>
              <RoleDropdown
                btn={moderatorRoleBtn}
                roles={roles}
                loading={rolesLoading}
                updateButton={updateModeratorRoleBtn}
              />
              <p className="text-xs text-slate-500 mt-1">
                Users with this role can run /voice-* commands even if they
                don&apos;t own the temporary channel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER PERMISSIONS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-sm">
        <header className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Owner Permissions <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-4">
          {[
            {
              key: "manageChannels",
              title: "Manage Channels",
              desc: "Allow the owner to rename and change user limits of their temporary channel.",
            },
            {
              key: "managePermissions",
              title: "Manage Permissions",
              desc: "Allow the owner to edit advanced permissions on the temporary channel.",
            },
            {
              key: "prioritySpeaker",
              title: "Priority Speaker",
              desc: "Make the owner the only priority speaker of the temporary channel.",
            },
            {
              key: "moveMembers",
              title: "Move Members",
              desc: "Allow the owner to disconnect other users from the temporary channel.",
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
            Text Channel <span className="ml-1">👑</span>
          </h2>
        </header>

        <div className="px-5 py-5 space-y-4">
          {[
            {
              key: "enabled",
              title: "Text Channel",
              desc: "Create a temporary text channel linked to the temporary voice channel.",
            },
            {
              key: "restrictCommands",
              title: "Restrict commands",
              desc: "Limit /voice-* commands to the linked temporary text channel only.",
            },
            {
              key: "pinUsages",
              title: "Pin usages",
              desc: "Pin an embed explaining all /voice-* commands in the linked text channel.",
            },
            {
              key: "restrictTextChannel",
              title: "Restrict text channel",
              desc: "Only moderators, bot masters, and connected users can read/send messages there.",
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
