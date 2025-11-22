"use client";

import { useEffect, useState } from "react";
import RoleDropdown from "@/components/inputs/RoleDropdown";

export default function EditReactionRolePanelPage({ params }) {
  const { guildId, panelId } = params;

  const [loaded, setLoaded] = useState(false);

  // panel fields
  const [panelName, setPanelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("create");

  // embed
  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    description: "",
    footerText: "",
  });

  const updateEmbed = (key, value) =>
    setEmbed((prev) => ({ ...prev, [key]: value }));

  // reaction buttons
  const [buttons, setButtons] = useState([]);

  const addButton = () => {
    setButtons((prev) => [
      ...prev,
      { id: Date.now(), emoji: "⭐", label: "", roleId: "", selectOpen: false },
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

  // roles from API
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch(`/api/discord/roles?guildId=${guildId}`);
        const data = await res.json();
        if (data.ok) setRoles(data.roles);
      } catch (err) {
        console.error(err);
      }
      setLoadingRoles(false);
    }
    fetchRoles();
  }, [guildId]);

  // channels from API
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch(`/api/discord/channels?guildId=${guildId}`);
        const data = await res.json();
        if (data.ok) setChannels(data.channels);
      } catch (err) {
        console.error(err);
      }
      setLoadingChannels(false);
    }
    fetchChannels();
  }, [guildId]);

  // load existing panel
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("sm_reaction_panels") || "[]"
    );

    const panel = saved.find((p) => p.id === panelId);

    if (!panel) return;

    setPanelName(panel.name);
    setSelectedChannel(panel.channel);
    setEmbed(panel.embed);
    setButtons(panel.buttons);
    setLoaded(true);
  }, [panelId]);

  const presetColors = [
    "#5865F2",
    "#57F287",
    "#FEE75C",
    "#EB459E",
    "#ED4245",
    "#2B2D31",
  ];

  const handleSave = () => {
    const savedPanels = JSON.parse(
      localStorage.getItem("sm_reaction_panels") || "[]"
    );

    const updated = savedPanels.map((p) =>
      p.id === panelId
        ? {
            ...p,
            name: panelName,
            channel: selectedChannel,
            embed,
            buttons,
            lastUpdated: "Just now",
          }
        : p
    );

    localStorage.setItem("sm_reaction_panels", JSON.stringify(updated));

    window.location.href = `/dashboard/${guildId}/reaction-roles`;
  };

  if (!loaded) return <div className="text-slate-400">Loading panel...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Edit Reaction Role Panel
          </h1>
          <p className="text-sm text-slate-400">
            Update your embed and role buttons.
          </p>
        </div>
      </div>

      {/* PANEL NAME */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div>
          <label className="text-sm text-slate-300">Panel name</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={panelName}
            onChange={(e) => setPanelName(e.target.value)}
          />
        </div>
      </section>

      {/* BIG GRID */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)]">
        {/* LEFT SIDE */}
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">

          {/* COLOR */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Embed color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={embed.color}
                onChange={(e) => updateEmbed("color", e.target.value)}
                className="h-8 w-10 rounded-md border border-slate-700 bg-slate-950 cursor-pointer"
              />

              <input
                className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                value={embed.color}
                onChange={(e) => updateEmbed("color", e.target.value)}
              />

              {presetColors.map((c) => (
                <button
                  key={c}
                  style={{ backgroundColor: c }}
                  onClick={() => updateEmbed("color", c)}
                  className={`h-5 w-5 rounded-full border ${
                    embed.color === c ? "border-white" : "border-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className="text-sm text-slate-300">Embed title</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              placeholder="Choose your roles"
              value={embed.title}
              onChange={(e) => updateEmbed("title", e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-slate-300">Embed description</label>
            <textarea
              className="mt-1 h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              placeholder="Click a button below to get your roles."
              value={embed.description}
              onChange={(e) => updateEmbed("description", e.target.value)}
            />
          </div>

          {/* FOOTER */}
          <div>
            <label className="text-sm text-slate-300">
              Footer text (optional)
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={embed.footerText}
              onChange={(e) => updateEmbed("footerText", e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-200">
                Role buttons
              </h2>
              <button
                type="button"
                onClick={addButton}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
              >
                + Add button
              </button>
            </div>

            <div className="space-y-3">
              {buttons.map((btn, idx) => (
                <div
                  key={btn.id}
                  className="flex flex-col md:flex-row md:items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs"
                >
                  {/* Index */}
                  <span className="text-slate-500 w-16 text-[11px]">
                    Button {idx + 1}
                  </span>

                  {/* Emoji */}
                  <input
                    className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
                    value={btn.emoji}
                    onChange={(e) => updateButton(btn.id, "emoji", e.target.value)}
                  />

                  {/* Label */}
                  <input
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
                    value={btn.label}
                    onChange={(e) => updateButton(btn.id, "label", e.target.value)}
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
                      className="rounded-lg border border-red-700/50 bg-red-700/20 px-2 py-1 text-[11px] text-red-300"
                      onClick={() => removeButton(btn.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
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
                <p className="mt-2 text-slate-300 whitespace-pre-line">
                  {embed.description}
                </p>
              )}

              {embed.footerText && (
                <p className="mt-3 text-[11px] border-t border-slate-800 pt-2 text-slate-400">
                  {embed.footerText}
                </p>
              )}

              {buttons.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {buttons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      className="flex items-center gap-1 rounded-md bg-slate-800 px-3 py-1.5 text-xs"
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

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
