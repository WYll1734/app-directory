"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, ChevronDown } from "lucide-react";
import RoleMultiSelect from "@/components/inputs/RoleMultiSelect";

// ---------------------------------------------------------
// Emoji picker for ticket button
// ---------------------------------------------------------
const EMOJI_LIST = [
  "🎫",
  "🎟️",
  "💬",
  "📩",
  "📨",
  "🆘",
  "🛠️",
  "❓",
  "📥",
  "📞",
  "💡",
  "⭐",
  "⚙️",
  "🔧",
  "🚨",
  "🧾",
];

function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = EMOJI_LIST.filter((emoji) =>
    emoji.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 hover:border-indigo-500/70 hover:bg-slate-800/90 transition"
      >
        <span className="text-lg">{value || "🎫"}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-800 bg-slate-950 shadow-xl shadow-black/60 z-[9999]">
          <div className="border-b border-slate-800 p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="max-h-40 overflow-y-auto p-2 grid grid-cols-6 gap-1 text-lg">
            {filtered.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onChange(emoji);
                  setOpen(false);
                }}
                className="flex items-center justify-center rounded-lg hover:bg-slate-800 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// ChannelSelect – dropdown stays above all UI
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

  const selectedChannel = channels.find((c) => c.id === value) || null;

  const textChannels = channels.filter(
    (c) => (c.type === 0 || c.type === 5 || c.type === 15) && c.name
  );

  const filtered = textChannels.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const disabled = loading || !!error;

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="relative w-full z-50" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
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
          {!loading && !error && !selectedChannel && placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 mt-1 rounded-xl border border-slate-800 bg-slate-950 shadow-xl shadow-black/60 z-[9999] overflow-hidden">
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
    if (!guildId) return;

    async function loadChannels() {
      try {
        setChannelsLoading(true);
        setChannelsError("");
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        let json;
        try {
          json = await res.json();
        } catch {
          throw new Error("Failed to parse channels response");
        }

        if (!res.ok || json.ok === false) {
          throw new Error(json.error || "Failed to load channels");
        }

        setChannels(json.channels || []);
      } catch (e) {
        console.error("Channels load error:", e);
        setChannelsError("Failed to load channels.");
      } finally {
        setChannelsLoading(false);
      }
    }

    async function loadRoles() {
      try {
        setRolesLoading(true);
        setRolesError("");
        const res = await fetch(`/api/discord/guilds/${guildId}/roles`);
        let json;
        try {
          json = await res.json();
        } catch {
          throw new Error("Failed to parse roles response");
        }

        if (!res.ok || json.ok === false) {
          throw new Error(json.error || "Failed to load roles");
        }

        setRoles(json.roles || []);
      } catch (e) {
        console.error("Roles load error:", e);
        setRolesError("Failed to load roles.");
      } finally {
        setRolesLoading(false);
      }
    }

    loadChannels();
    loadRoles();
  }, [guildId]);

  // =======================================================
  // PANEL + EMBED STATE
  // =======================================================
  const [panelName, setPanelName] = useState("Support Tickets");

  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "Click the button below to open a support ticket.",
    footerText: "ServerMate Ticketing System", // LOCKED
  });

  const updateEmbed = (field, value) =>
    setEmbed((prev) => ({ ...prev, [field]: value }));

  const [buttonLabel, setButtonLabel] = useState("Create Ticket");
  const [buttonEmoji, setButtonEmoji] = useState("🎫");

  const previewButtonLabel = (buttonLabel || "Create Ticket").trim();
  const previewButtonEmoji = (buttonEmoji || "").trim();

  const [publishChannelId, setPublishChannelId] = useState("");
  const [panelChannelId, setPanelChannelId] = useState("");
  const [transcriptChannelId, setTranscriptChannelId] = useState("");
  const [ticketManagerRoleIds, setTicketManagerRoleIds] = useState([]);

  const [dmTranscript, setDmTranscript] = useState(false);
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

  const [introSaving, setIntroSaving] = useState(false);
  const [introSaved, setIntroSaved] = useState(false);

  const saveIntro = () => {
    if (introSaving) return;
    setIntroSaving(true);
    setIntroSaved(false);

    // later: API call for intro config
    setTimeout(() => {
      setIntroSaving(false);
      setIntroSaved(true);
      setTimeout(() => setIntroSaved(false), 1200);
    }, 800);
  };

  return (
    <div className="relative p-6 space-y-8 overflow-visible">
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
      <div className="relative bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl space-y-5 overflow-visible">
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

              {/* Force the roles dropdown above other cards */}
              <div className="relative z-[9999]">
                <RoleMultiSelect
                  roles={roles}
                  value={ticketManagerRoleIds}
                  onChange={setTicketManagerRoleIds}
                />
              </div>

              {rolesLoading && (
                <p className="text-xs text-slate-500 mt-1">Loading roles…</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =======================================================
          MAIN CARD: FORM + PREVIEW (2 COLUMN)
      ======================================================= */}
      <div className="relative bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl space-y-6 overflow-visible">
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start overflow-visible">
          {/* LEFT: EMBED + BUTTON CONFIG */}
          <div className="space-y-5 overflow-visible">
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

            {/* Ticket Button config */}
            <div className="space-y-2">
              <label className="font-medium text-slate-200">
                Ticket Button
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={buttonLabel}
                    onChange={(e) => setButtonLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500"
                    placeholder="Create Ticket"
                  />
                </div>
                <div className="sm:w-auto">
                  <EmojiPicker value={buttonEmoji} onChange={setButtonEmoji} />
                </div>
              </div>
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

          {/* RIGHT: LIVE DISCORD-LIKE PREVIEW */}
          <div className="space-y-3 overflow-visible">
            <p className="text-sm font-medium text-slate-300">Preview</p>

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

                  {/* Ticket button */}
                  <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-xs font-medium text-white transition">
                    {previewButtonEmoji && (
                      <span className="mr-1">{previewButtonEmoji}</span>
                    )}
                    <span>{previewButtonLabel}</span>
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
      <div className="relative bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl space-y-4 overflow-visible">
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
                  onChange={(e) => updateIntroEmbed("color", e.target.value)}
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
                  onChange={(e) => updateIntroEmbed("title", e.target.value)}
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

        {/* Save intro section */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={saveIntro}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all
              ${
                introSaving
                  ? "bg-blue-600/60 cursor-not-allowed"
                  : introSaved
                  ? "bg-emerald-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
          >
            {introSaving && "Saving…"}
            {!introSaving && !introSaved && "Save introduction message"}
            {introSaved && "Saved!"}
          </button>
        </div>
      </div>

      {/* =======================================================
          TICKET TRANSCRIPT SECTION
      ======================================================= */}
      <div className="relative bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 shadow-xl space-y-5 overflow-visible">
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
