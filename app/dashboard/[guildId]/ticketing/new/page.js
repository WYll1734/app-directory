"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, ChevronDown } from "lucide-react";
import RoleMultiSelect from "@/components/inputs/RoleMultiSelect";

// ---------------------------------------------------------
// Reusable ChannelSelect (matches your existing channel UI)
// ---------------------------------------------------------
function ChannelSelect({
  channels,
  loading,
  error,
  value,
  onChange,
  placeholder = "Select a channel...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const selectedChannel = channels.find((c) => c.id === value) || null;

  const textChannels = channels.filter(
    (c) =>
      // Discord text channel type === 0
      (c.type === 0 || c.type === 15 || c.type === 5) && c.name
  );

  const filtered = textChannels.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const disabled = loading || !!error;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm
          ${
            disabled
              ? "cursor-not-allowed border-slate-800 bg-slate-900/60 text-slate-500"
              : "cursor-pointer border-slate-700 bg-slate-900/80 text-slate-100 hover:border-indigo-500/70 hover:bg-slate-800/90"
          } transition`}
      >
        <span className="truncate">
          {loading && "Loading channels…"}
          {error && "Failed to load channels"}
          {!loading && !error && selectedChannel && (
            <>
              <span className="text-slate-500 mr-1">#</span>
              {selectedChannel.name}
            </>
          )}
          {!loading && !error && !selectedChannel && !placeholder && "—"}
          {!loading && !error && !selectedChannel && placeholder && placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 mt-1 rounded-xl border border-slate-800 bg-slate-950 shadow-xl shadow-black/60 z-50 overflow-hidden">
          {/* Search */}
          <div className="border-b border-slate-800 p-2">
            <input
              placeholder="Search channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto text-sm">
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Text Channels
            </div>

            {filtered.length === 0 && (
              <div className="px-3 py-2 text-slate-500 text-sm">
                No channels found.
              </div>
            )}

            {filtered.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onChange(ch.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-slate-100 hover:bg-slate-800/80 transition"
              >
                <span className="text-slate-500">#</span>
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewTicketPanelPage({ params }) {
  const { guildId } = params;

  // =======================================================
  // SAVE BUTTON LOGIC (Save → Saving → Saved)
  // =======================================================
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const runSave = () => {
    if (saving) return;

    setSaving(true);
    setSaved(false);

    // later: call API here
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 1000);
  };

  // =======================================================
  // CHANNELS + ROLES FROM API
  // =======================================================
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [channelsError, setChannelsError] = useState("");

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState("");

  useEffect(() => {
    // Load channels
    async function loadChannels() {
      try {
        setChannelsLoading(true);
        const res = await fetch(
          `/api/discord/guilds/${guildId}/channels`
        );
        const json = await res.json();
        if (!json.ok) {
          throw new Error(json.error || "Failed to load channels");
        }
        setChannels(json.channels || []);
        setChannelsError("");
      } catch (e) {
        setChannelsError(e.message || "Failed to load channels");
      } finally {
        setChannelsLoading(false);
      }
    }

    // Load roles (assuming API exists at this path)
    async function loadRoles() {
      try {
        setRolesLoading(true);
        const res = await fetch(
          `/api/discord/guild/${guildId}/roles`
        );
        const json = await res.json();
        if (!json.ok) {
          throw new Error(json.error || "Failed to load roles");
        }
        setRoles(json.roles || json.data || []);
        setRolesError("");
      } catch (e) {
        setRolesError(e.message || "Failed to load roles");
      } finally {
        setRolesLoading(false);
      }
    }

    if (guildId) {
      loadChannels();
      loadRoles();
    }
  }, [guildId]);

  // =======================================================
  // PANEL + EMBED STATE
  // =======================================================
  const [panelName, setPanelName] = useState("");

  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "Click the button below to open a support ticket.",
    footerText: "ServerMate Ticketing System", // LOCKED HERE
  });

  const updateEmbed = (field, value) =>
    setEmbed((prev) => ({ ...prev, [field]: value }));

  // Which channels/roles we picked
  const [publishChannelId, setPublishChannelId] = useState("");
  const [panelChannelId, setPanelChannelId] = useState("");
  const [transcriptChannelId, setTranscriptChannelId] = useState("");
  const [ticketManagerRoleIds, setTicketManagerRoleIds] = useState([]);

  // ticket transcript settings
  const [dmTranscript, setDmTranscript] = useState(false);

  // General section collapse
  const [generalOpen, setGeneralOpen] = useState(true);

  // =======================================================
  // Ticket introduction message + embed
  // =======================================================
  const [introMessage, setIntroMessage] = useState(
    "Your ticket has been created.\nPlease provide any additional info you deem relevant to help us answer faster."
  );

  const [introEmbedOpen, setIntroEmbedOpen] = useState(false);
  const [introEmbed, setIntroEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "",
  });

  const updateIntroEmbed = (field, value) =>
    setIntroEmbed((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 space-y-8">
      {/* =======================================================
          BACK BUTTON + TITLE
      ======================================================= */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/${guildId}/ticketing`}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white">New Ticket Panel</h1>
          <p className="text-slate-400">
            Create your server&apos;s support ticket panel.
          </p>
        </div>
      </div>

      {/* =======================================================
          GENERAL SECTION (PUBLISH + TICKET MANAGER ROLES)
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
        <button
          type="button"
          onClick={() => setGeneralOpen((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-semibold text-slate-200"
        >
          <span>General</span>
          <span className="text-xs text-slate-400">
            {generalOpen ? "▾" : "▸"}
          </span>
        </button>

        {generalOpen && (
          <div className="space-y-5 pt-2">
            <div className="h-px bg-slate-800/80" />

            {/* Publish Channel */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200 text-sm">
                Publish Channel<span className="text-red-500"> *</span>
              </label>
              <ChannelSelect
                channels={channels}
                loading={channelsLoading}
                error={channelsError}
                value={publishChannelId}
                onChange={setPublishChannelId}
                placeholder="Select a channel..."
              />
            </div>

            {/* Ticket Manager Roles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="font-medium text-slate-200 text-sm">
                  Ticket Manager Roles<span className="text-red-500"> *</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {ticketManagerRoleIds.length} / 10
                </span>
              </div>

              {rolesError && (
                <p className="text-xs text-red-400">{rolesError}</p>
              )}

              <RoleMultiSelect
                roles={roles}
                value={ticketManagerRoleIds}
                onChange={setTicketManagerRoleIds}
              />

              {rolesLoading && (
                <p className="text-xs text-slate-500 mt-1">
                  Loading roles…
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =======================================================
          MAIN CARD: FORM + PREVIEW (2 COLUMN)
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
        {/* Panel Name (full width) */}
        <div className="space-y-2">
          <label className="font-medium text-slate-200">Panel Name</label>
          <input
            type="text"
            value={panelName}
            onChange={(e) => setPanelName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Support Tickets"
          />
        </div>

        {/* Editor + Preview grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* ---------------------------------------------------
              LEFT: EMBED CONFIG
          --------------------------------------------------- */}
          <div className="space-y-5">
            {/* Embed Color */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">Embed Color</label>
              <input
                type="color"
                value={embed.color}
                onChange={(e) => updateEmbed("color", e.target.value)}
                className="h-10 w-16 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
              />
            </div>

            {/* Embed Title */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">Embed Title</label>
              <input
                type="text"
                value={embed.title}
                onChange={(e) => updateEmbed("title", e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
                placeholder="Need help?"
              />
            </div>

            {/* Embed Description */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">
                Embed Description
              </label>
              <textarea
                value={embed.description}
                onChange={(e) => updateEmbed("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 min-h-[140px]"
                placeholder="Click the button below to open a support ticket."
              />
            </div>

            {/* Target Channel */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">
                Send Panel To Channel
              </label>
              <ChannelSelect
                channels={channels}
                loading={channelsLoading}
                error={channelsError}
                value={panelChannelId}
                onChange={setPanelChannelId}
                placeholder="Select a channel..."
              />
            </div>
          </div>

          {/* ---------------------------------------------------
              RIGHT: LIVE DISCORD-LIKE PREVIEW
          --------------------------------------------------- */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">Preview</p>

            {/* Fake Discord message container */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 shadow-inner">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="mt-1 h-10 w-10 rounded-full bg-slate-700" />

                <div className="flex-1 space-y-3">
                  {/* Username row */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-white">
                      ServerMate
                    </span>
                    <span className="rounded-sm bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      BOT
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Today at 9:12 AM
                    </span>
                  </div>

                  {/* Embed */}
                  <div className="rounded-lg bg-slate-900 border border-slate-800 flex overflow-hidden">
                    {/* Color bar */}
                    <div
                      className="w-1"
                      style={{ backgroundColor: embed.color || "#5865F2" }}
                    />

                    <div className="flex-1 p-3 space-y-2">
                      {embed.title && (
                        <div className="font-semibold text-white">
                          {embed.title}
                        </div>
                      )}

                      {embed.description && (
                        <div className="text-sm text-slate-100 whitespace-pre-wrap">
                          {embed.description}
                        </div>
                      )}

                      {embed.footerText && (
                        <div className="pt-2 text-[11px] text-slate-400">
                          {embed.footerText}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fake button */}
                  <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-xs font-medium text-white transition">
                    Create Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          TICKET INTRODUCTION MESSAGE (EDITABLE + EMBED)
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Ticket introduction message
          </h2>
          <span className="text-slate-500 text-xs">▾</span>
        </div>

        <div className="h-px bg-slate-800/80" />

        {/* Editable intro text */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Introduction message
          </label>
          <textarea
            value={introMessage}
            onChange={(e) => setIntroMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 min-h-[110px] text-sm"
            placeholder="Your ticket has been created. Please provide any additional info you deem relevant to help us answer faster."
          />
        </div>

        {/* Intro message preview */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="mt-1 h-10 w-10 rounded-full bg-slate-700" />

            <div className="flex-1 space-y-3">
              {/* Username row */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-white">
                  Random Mafia Shooter
                </span>
                <span className="rounded-sm bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  BOT
                </span>
                <span className="text-[11px] text-slate-400">
                  Today at 9:12 AM
                </span>
              </div>

              {/* Message text */}
              <div className="space-y-1 text-sm text-slate-100 whitespace-pre-wrap">
                {introMessage.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {/* Optional embed inside ticket intro */}
              {(introEmbed.title || introEmbed.description) && (
                <div className="rounded-lg bg-slate-900 border border-slate-800 flex overflow-hidden mt-3">
                  <div
                    className="w-1"
                    style={{ backgroundColor: introEmbed.color || "#5865F2" }}
                  />
                  <div className="flex-1 p-3 space-y-2">
                    {introEmbed.title && (
                      <div className="font-semibold text-white">
                        {introEmbed.title}
                      </div>
                    )}
                    {introEmbed.description && (
                      <div className="text-sm text-slate-100 whitespace-pre-wrap">
                        {introEmbed.description}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIntroEmbedOpen(true)}
            className="mt-4 inline-flex items-center rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition"
          >
            {introEmbedOpen ? "Edit embed" : "+ Add embed"}
          </button>
        </div>

        {/* Embed editor for intro message */}
        {introEmbedOpen && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-200">
                  Intro embed color
                </label>
                <input
                  type="color"
                  value={introEmbed.color}
                  onChange={(e) =>
                    updateIntroEmbed("color", e.target.value)
                  }
                  className="h-10 w-16 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-200">
                  Intro embed title
                </label>
                <input
                  type="text"
                  value={introEmbed.title}
                  onChange={(e) =>
                    updateIntroEmbed("title", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500"
                  placeholder="Extra info"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-200">
                  Intro embed description
                </label>
                <textarea
                  value={introEmbed.description}
                  onChange={(e) =>
                    updateIntroEmbed("description", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 min-h-[100px]"
                  placeholder="Add any embed content that will show inside the ticket when it is created."
                />
              </div>
            </div>

            {/* Small live preview */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
              <p className="text-xs font-semibold text-slate-300 mb-2">
                Intro embed preview
              </p>
              <div className="rounded-lg bg-slate-900 border border-slate-800 flex overflow-hidden">
                <div
                  className="w-1"
                  style={{ backgroundColor: introEmbed.color || "#5865F2" }}
                />
                <div className="flex-1 p-3 space-y-2">
                  {introEmbed.title && (
                    <div className="font-semibold text-white">
                      {introEmbed.title}
                    </div>
                  )}
                  {introEmbed.description && (
                    <div className="text-sm text-slate-100 whitespace-pre-wrap">
                      {introEmbed.description}
                    </div>
                  )}
                  {!introEmbed.title && !introEmbed.description && (
                    <div className="text-xs text-slate-500">
                      Start typing above to see the embed preview.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =======================================================
          TICKET TRANSCRIPT SECTION
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Ticket transcript
          </h2>
        </div>

        {/* Transcript channel select */}
        <div className="space-y-2">
          <label className="font-medium text-slate-200 text-sm">
            Transcripts Channel<span className="text-red-500"> *</span>
          </label>
          <ChannelSelect
            channels={channels}
            loading={channelsLoading}
            error={channelsError}
            value={transcriptChannelId}
            onChange={setTranscriptChannelId}
            placeholder="Select a channel..."
          />
        </div>

        {/* DM transcript toggle */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-sm text-slate-300">
            Send the transcript link in private to the member that created the
            ticket
          </p>

          <button
            type="button"
            onClick={() => setDmTranscript((v) => !v)}
            className={`flex h-6 w-11 items-center rounded-full border transition-all ${
              dmTranscript
                ? "border-blue-500 bg-blue-500"
                : "border-slate-600 bg-slate-800"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                dmTranscript ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* =======================================================
          SAVE BUTTON
      ======================================================= */}
      <div>
        <button
          onClick={runSave}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
            ${
              saving
                ? "bg-blue-600/60 cursor-not-allowed"
                : saved
                ? "bg-emerald-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          `}
        >
          {saving && "Saving…"}
          {!saving && !saved && (
            <>
              <Save className="w-5 h-5" /> Save Ticket Panel
            </>
          )}
          {saved && "Saved!"}
        </button>
      </div>
    </div>
  );
}
