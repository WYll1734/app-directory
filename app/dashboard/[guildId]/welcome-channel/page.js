"use client";

import { useEffect, useState } from "react";

export default function WelcomeChannelPage({ params }) {
  const { guildId } = params;

  // =========================================
  // SAVE BUTTON STATE (Save → Saving → Saved)
  // =========================================
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const runSave = () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setTimeout(() => setSaved(false), 1300);
    }, 900);
  };

  // =========================================
  // EMBED STATE
  // =========================================
  const [embed, setEmbed] = useState({
    color: "#5865F2",
    title: "",
    url: "",
    description: "",
    authorName: "",
    authorIcon: "",
    thumb: "",
    image: "",
    footerText: "",
    footerIcon: "",
  });

  const update = (field, value) =>
    setEmbed((prev) => ({ ...prev, [field]: value }));

  // =========================================
  // CHANNEL SELECT DROPDOWN (API)
  // =========================================
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("create");

  useEffect(() => {
    async function getChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();
        if (data.ok) setChannels(data.channels);
      } catch (e) {
        console.error(e);
      }
      setLoadingChannels(false);
    }
    getChannels();
  }, [guildId]);

  const presetColors = [
    "#5865F2",
    "#57F287",
    "#FEE75C",
    "#EB459E",
    "#ED4245",
    "#2B2D31",
  ];

  // =========================================
  // PAGE RENDER
  // =========================================
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Welcome Channel</h1>
          <p className="text-sm text-slate-400">
            A dedicated place to welcome new members and share essential information.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
          Publish
        </button>
      </div>

      {/* CHANNEL SELECTOR */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="text-sm font-semibold text-slate-200">
          Choose your Welcome Channel
        </h2>

        <div className="mt-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-200"
          >
            <span>
              {selectedChannel === "create"
                ? "Create a #welcome channel for me"
                : selectedChannel}
            </span>
            <span className="text-slate-400">{dropdownOpen ? "▴" : "▾"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 shadow-xl max-h-72 overflow-y-auto text-sm">

              {loadingChannels && (
                <div className="px-4 py-3 text-xs text-slate-400">
                  Loading channels...
                </div>
              )}

              {/* CREATE OPTION */}
              <button
                className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                  selectedChannel === "create"
                    ? "text-indigo-400"
                    : "text-slate-200"
                }`}
                onClick={() => {
                  setSelectedChannel("create");
                  setDropdownOpen(false);
                }}
              >
                Create #welcome channel (recommended)
                {selectedChannel === "create" && (
                  <span className="text-xs text-indigo-400">Selected</span>
                )}
              </button>

              {/* CATEGORIES */}
              {channels
                .filter((c) => c.type === 4)
                .map((cat) => (
                  <div key={cat.id}>
                    <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-slate-500">
                      {cat.name}
                    </p>

                    {channels
                      .filter((ch) => ch.parent_id === cat.id && ch.type === 0)
                      .map((ch) => (
                        <button
                          key={ch.id}
                          className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                            selectedChannel === `#${ch.name}`
                              ? "text-indigo-400"
                              : "text-slate-200"
                          }`}
                          onClick={() => {
                            setSelectedChannel(`#${ch.name}`);
                            setDropdownOpen(false);
                          }}
                        >
                          #{ch.name}
                          {selectedChannel === `#${ch.name}` && (
                            <span className="text-xs text-indigo-400">
                              Selected
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                ))}

              {/* UNCATEGORIZED */}
              {channels
                .filter((c) => c.type === 0 && !c.parent_id)
                .map((ch) => (
                  <button
                    key={ch.id}
                    className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                      selectedChannel === `#${ch.name}`
                        ? "text-indigo-400"
                        : "text-slate-200"
                    }`}
                    onClick={() => {
                      setSelectedChannel(`#${ch.name}`);
                      setDropdownOpen(false);
                    }}
                  >
                    #{ch.name}
                    {selectedChannel === `#${ch.name}` && (
                      <span className="text-xs text-indigo-400">Selected</span>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* EMBED BUILDER */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          * All fields are optional
        </h2>

        {/* COLOR PICKER */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-200">
            Color
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="color"
              value={embed.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-8 w-10 cursor-pointer rounded-md border border-slate-700 bg-slate-950"
            />
            <input
              value={embed.color}
              onChange={(e) => update("color", e.target.value)}
              className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            />
            {presetColors.map((c) => (
              <button
                key={c}
                onClick={() => update("color", c)}
                style={{ backgroundColor: c }}
                className={`h-5 w-5 rounded-full border ${
                  embed.color === c ? "border-white" : "border-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* TITLE + URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-slate-300">Title</label>
            <input
              value={embed.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="🍒 Welcome to {server} 🍒"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Title URL</label>
            <input
              value={embed.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://example.com"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="text-sm text-slate-300">Description</label>
          <textarea
            value={embed.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder={"Welcome to {server} {username}!"}
            className="mt-1 h-40 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        {/* FOOTER */}
        <details className="group mb-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <summary className="cursor-pointer text-sm text-slate-300 group-open:text-indigo-400">
            + Footer
          </summary>

          <div className="mt-3 space-y-3 text-xs text-slate-300">
            <div>
              <label>Footer Text</label>
              <input
                value={embed.footerText}
                onChange={(e) => update("footerText", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label>Footer Icon</label>
              <input
                value={embed.footerIcon}
                onChange={(e) => update("footerIcon", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </details>

        {/* SAVE BUTTON #2 */}
        <button
          onClick={runSave}
          disabled={saving}
          className={`mt-4 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            saved
              ? "bg-emerald-500 text-slate-900"
              : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
          }`}
        >
          {saving ? "Saving…" : saved ? "Saved!" : "Save"}
        </button>

        {/* PREVIEW */}
        <h3 className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Preview
        </h3>

        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-100">ServerMate Bot</span> • Today
          </p>
          <div className="mt-3 flex gap-3">
            <div
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-4"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: embed.color,
              }}
            >
              {embed.title && (
                <p className="text-sm font-semibold text-slate-100">{embed.title}</p>
              )}
              {embed.description && (
                <p className="mt-2 whitespace-pre-line text-slate-300">
                  {embed.description}
                </p>
              )}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
