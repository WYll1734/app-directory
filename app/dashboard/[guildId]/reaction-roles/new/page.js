"use client";

import { useEffect, useState } from "react";
import RoleDropdown from "@/components/inputs/RoleDropdown";

export default function NewReactionRolePanelPage({ params }) {
  const { guildId } = params;

  // ============= PANEL HEADER =============
  const [panelName, setPanelName] = useState("");

  // ============= EMBED STATE =============
  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "",
    footerText: "",
  });

  const updateEmbed = (key, value) =>
    setEmbed((prev) => ({ ...prev, [key]: value }));

  // ============= ROLE BUTTONS =============
  const [buttons, setButtons] = useState([
    { id: 1, emoji: "😀", label: "", roleId: "" },
  ]);

  const addButton = () => {
    setButtons((prev) => [
      ...prev,
      { id: Date.now(), emoji: "⭐", label: "", roleId: "" },
    ]);
  };

  const updateButton = (id, key, value) => {
    setButtons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  };

  const removeButton = (id) => {
    setButtons((prev) => prev.filter((b) => b.id !== id));
  };

  // ============= ROLES (for dropdown) =============
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch(`/api/discord/roles?guildId=${guildId}`);
        const data = await res.json();

        if (data.ok && Array.isArray(data.roles)) {
          setRoles(data.roles);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    }

    fetchRoles();
  }, [guildId]);

  // ============= CHANNELS (for panel send location) =============
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("create");
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch(`/api/discord/channels?guildId=${guildId}`);
        const data = await res.json();

        if (data.ok && Array.isArray(data.channels)) {
          setChannels(data.channels);
        } else {
          setChannels([]);
        }
      } catch (err) {
        console.error("Failed to fetch channels:", err);
        setChannels([]);
      } finally {
        setLoadingChannels(false);
      }
    }

    fetchChannels();
  }, [guildId]);

  // ============= COLOR PRESETS =============
  const presetColors = [
    "#5865F2",
    "#57F287",
    "#FEE75C",
    "#EB459E",
    "#ED4245",
    "#2B2D31",
  ];

  // ============= SAVE HANDLER (localStorage only) =============
  const handleSave = (e) => {
    e.preventDefault();

    const savedPanels = JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("sm_reaction_panels") || "[]"
        : "[]"
    );

    const newPanel = {
      id: Date.now().toString(),
      guildId,
      name: panelName || "Untitled panel",
      channel: selectedChannel, // now uses actual selected channel
      embed,
      buttons,
      lastUpdated: "Just now",
    };

    savedPanels.push(newPanel);

    if (typeof window !== "undefined") {
      localStorage.setItem("sm_reaction_panels", JSON.stringify(savedPanels));
      window.location.href = `/dashboard/${guildId}/reaction-roles`;
    }
  };

  // ============= RENDER =============
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            New Reaction Role Panel
          </h1>
          <p className="text-sm text-slate-400">
            Configure an embed and role buttons for your server.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Panel name */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div>
            <label className="text-sm text-slate-300">Panel name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Gamemode selector, Region roles, etc."
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
            />
          </div>
        </section>

        {/* Channel selector */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div>
            <label className="text-sm text-slate-300">Send panel in</label>

            <button
              type="button"
              onClick={() => setChannelDropdownOpen((o) => !o)}
              className="mt-1 flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2 text-left text-sm text-slate-200"
            >
              <span>
                {selectedChannel === "create"
                  ? "Create #reaction-roles automatically"
                  : selectedChannel}
              </span>
              <span className="text-slate-400">
                {channelDropdownOpen ? "▴" : "▾"}
              </span>
            </button>

            {channelDropdownOpen && (
              <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 shadow-xl text-sm">
                {/* Create option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChannel("create");
                    setChannelDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-slate-800 ${
                    selectedChannel === "create"
                      ? "text-indigo-400"
                      : "text-slate-300"
                  }`}
                >
                  Create #reaction-roles channel (recommended)
                </button>

                {/* Loading state */}
                {loadingChannels && (
                  <div className="px-4 py-2 text-xs text-slate-400">
                    Loading channels...
                  </div>
                )}

                {/* Category channels */}
                {!loadingChannels &&
                  channels
                    .filter((c) => c.type === 4)
                    .sort((a, b) => a.position - b.position)
                    .map((cat) => (
                      <div key={cat.id}>
                        <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-slate-500">
                          {cat.name}
                        </p>

                        {channels
                          .filter(
                            (ch) => ch.parent_id === cat.id && ch.type === 0
                          )
                          .sort((a, b) => a.position - b.position)
                          .map((ch) => (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => {
                                setSelectedChannel(`#${ch.name}`);
                                setChannelDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-slate-800 ${
                                selectedChannel === `#${ch.name}`
                                  ? "text-indigo-400"
                                  : "text-slate-300"
                              }`}
                            >
                              #{ch.name}
                            </button>
                          ))}
                      </div>
                    ))}

                {/* Uncategorised text channels */}
                {!loadingChannels &&
                  channels
                    .filter((c) => c.type === 0 && !c.parent_id)
                    .sort((a, b) => a.position - b.position)
                    .map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          setSelectedChannel(`#${ch.name}`);
                          setChannelDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-slate-800 ${
                          selectedChannel === `#${ch.name}`
                            ? "text-indigo-400"
                            : "text-slate-300"
                        }`}
                      >
                        #{ch.name}
                      </button>
                    ))}
              </div>
            )}
          </div>
        </section>

        {/* Embed + buttons grid */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)]">
          {/* LEFT: embed + buttons */}
          <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Embed color
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  type="color"
                  value={embed.color}
                  onChange={(e) => updateEmbed("color", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-md border border-slate-700 bg-slate-950"
                />

                <input
                  className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none"
                  value={embed.color}
                  onChange={(e) => updateEmbed("color", e.target.value)}
                />

                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateEmbed("color", c)}
                    style={{ backgroundColor: c }}
                    className={`h-5 w-5 rounded-full border ${
                      embed.color === c ? "border-white" : "border-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Embed title */}
            <div>
              <label className="text-sm text-slate-300">Embed title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                placeholder="Choose your roles"
                value={embed.title}
                onChange={(e) => updateEmbed("title", e.target.value)}
              />
            </div>

            {/* Embed description */}
            <div>
              <label className="text-sm text-slate-300">
                Embed description
              </label>
              <textarea
                className="mt-1 h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                placeholder="Click a button below to get your roles."
                value={embed.description}
                onChange={(e) => updateEmbed("description", e.target.value)}
              />
            </div>

            {/* Footer */}
            <div>
              <label className="text-sm text-slate-300">
                Footer text (optional)
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                placeholder="You can change roles anytime."
                value={embed.footerText}
                onChange={(e) => updateEmbed("footerText", e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">
                  Role buttons
                </h2>

                <button
                  type="button"
                  onClick={addButton}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
                >
                  + Add button
                </button>
              </div>

              <div className="space-y-3">
                {buttons.map((btn, idx) => (
                  <div
                    key={btn.id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs md:flex-row md:items-center"
                  >
                    {/* Index */}
                    <span className="w-12 text-[11px] text-slate-500">
                      Button {idx + 1}
                    </span>

                    {/* Emoji */}
                    <input
                      className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none"
                      placeholder="😀"
                      value={btn.emoji}
                      onChange={(e) =>
                        updateButton(btn.id, "emoji", e.target.value)
                      }
                    />

                    {/* Label */}
                    <input
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none"
                      placeholder="EU, NA, ASIA"
                      value={btn.label}
                      onChange={(e) =>
                        updateButton(btn.id, "label", e.target.value)
                      }
                    />

                    {/* Role dropdown */}
                    <RoleDropdown
                      btn={btn}
                      roles={roles}
                      loading={loadingRoles}
                      updateButton={updateButton}
                    />

                    {/* Remove */}
                    {buttons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeButton(btn.id)}
                        className="rounded-lg border border-rose-700/50 bg-rose-700/20 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-700/40"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preview
            </h2>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-slate-100">
                  ServerMate Bot
                </span>{" "}
                • Today
              </p>

              <div
                className="mt-3 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: embed.color,
                }}
              >
                {embed.title && (
                  <p className="font-semibold">{embed.title}</p>
                )}

                {embed.description && (
                  <p className="mt-2 whitespace-pre-line text-slate-300">
                    {embed.description}
                  </p>
                )}

                {embed.footerText && (
                  <p className="mt-3 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                    {embed.footerText}
                  </p>
                )}

                {/* Button row */}
                {buttons.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {buttons.map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        className="flex items-center gap-1 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                      >
                        <span>{btn.emoji || "🔘"}</span>
                        <span>{btn.label || "Button"}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Save panel
          </button>
        </div>
      </form>
    </div>
  );
}
