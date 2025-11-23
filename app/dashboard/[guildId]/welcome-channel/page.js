"use client";

import { useEffect, useState } from "react";

export default function WelcomeChannelPage({ params }) {
  const { guildId } = params;

  // EMBED STATE
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

  const update = (key, value) =>
    setEmbed((prev) => ({ ...prev, [key]: value }));

  // CHANNEL SELECTOR
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("create");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // FETCH CHANNELS
  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();
        if (data.ok) setChannels(data.channels);
      } catch (e) {
        console.error("Channel fetch error:", e);
      } finally {
        setLoadingChannels(false);
      }
    }
    fetchChannels();
  }, [guildId]);

  // COLOR PRESETS
  const presetColors = [
    "#5865F2",
    "#57F287",
    "#FEE75C",
    "#EB459E",
    "#ED4245",
    "#2B2D31",
  ];

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
        <h2 className="text-sm font-semibold text-slate-200">Choose your Welcome Channel</h2>

        <div className="mt-4 relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2 text-left text-sm text-slate-200"
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
                type="button"
                onClick={() => {
                  setSelectedChannel("create");
                  setDropdownOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                  selectedChannel === "create" ? "text-indigo-400" : "text-slate-200"
                }`}
              >
                <span>Create #welcome channel (recommended)</span>
                {selectedChannel === "create" && (
                  <span className="text-xs text-indigo-400">Selected</span>
                )}
              </button>

              {/* CATEGORIES */}
              {channels
                .filter((c) => c.type === 4)
                .sort((a, b) => a.position - b.position)
                .map((cat) => (
                  <div key={cat.id}>
                    <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-slate-500">
                      {cat.name}
                    </p>

                    {channels
                      .filter((ch) => ch.parent_id === cat.id && ch.type === 0)
                      .sort((a, b) => a.position - b.position)
                      .map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            setSelectedChannel(`#${ch.name}`);
                            setDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                            selectedChannel === `#${ch.name}`
                              ? "text-indigo-400"
                              : "text-slate-200"
                          }`}
                        >
                          <span>#{ch.name}</span>
                          {selectedChannel === `#${ch.name}` && (
                            <span className="text-xs text-indigo-400">Selected</span>
                          )}
                        </button>
                      ))}
                  </div>
                ))}

              {/* UNCATEGORIZED TEXT CHANNELS */}
              {channels
                .filter((c) => c.type === 0 && !c.parent_id)
                .sort((a, b) => a.position - b.position)
                .map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setSelectedChannel(`#${ch.name}`);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                      selectedChannel === `#${ch.name}`
                        ? "text-indigo-400"
                        : "text-slate-200"
                    }`}
                  >
                    <span>#{ch.name}</span>
                    {selectedChannel === `#${ch.name}` && (
                      <span className="text-xs text-indigo-400">Selected</span>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* EMBED BUILDER (FULL RESTORED) */}
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
              className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-500"
              value={embed.color}
              onChange={(e) => update("color", e.target.value)}
            />

            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
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
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-300">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
              placeholder="🍒 Welcome to {server} 🍒"
              value={embed.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Title URL</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
              placeholder="https://example.com"
              value={embed.url}
              onChange={(e) => update("url", e.target.value)}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="text-sm text-slate-300">Description</label>
          <textarea
            className="mt-1 h-40 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            placeholder={
              "Welcome to {server} {username}!\n\nBe careful I heard roads are dangerous around here..."
            }
            value={embed.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        {/* AUTHOR */}
        <details className="group mb-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <summary className="list-none cursor-pointer text-sm text-slate-300 group-open:text-indigo-400">
            + Author
          </summary>

          <div className="mt-3 space-y-3 text-xs text-slate-300">
            <div>
              <label>Author Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Enter name"
                value={embed.authorName}
                onChange={(e) => update("authorName", e.target.value)}
              />
            </div>

            <div>
              <label>Author Icon</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Enter image URL"
                value={embed.authorIcon}
                onChange={(e) => update("authorIcon", e.target.value)}
              />
            </div>
          </div>
        </details>

        {/* IMAGE + THUMB */}
        <details className="group mb-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <summary className="list-none cursor-pointer text-sm text-slate-300 group-open:text-indigo-400">
            + Image/Thumb
          </summary>

          <div className="mt-3 space-y-3 text-xs text-slate-300">
            <div>
              <label>Thumbnail</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Thumbnail URL"
                value={embed.thumb}
                onChange={(e) => update("thumb", e.target.value)}
              />
            </div>

            <div>
              <label>Main Image</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Image URL"
                value={embed.image}
                onChange={(e) => update("image", e.target.value)}
              />
            </div>
          </div>
        </details>

        {/* FOOTER */}
        <details className="group mb-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <summary className="list-none cursor-pointer text-sm text-slate-300 group-open:text-indigo-400">
            + Footer
          </summary>

          <div className="mt-3 space-y-3 text-xs text-slate-300">
            <div>
              <label>Footer Text</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Footer text"
                value={embed.footerText}
                onChange={(e) => update("footerText", e.target.value)}
              />
            </div>

            <div>
              <label>Footer Icon</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Icon URL"
                value={embed.footerIcon}
                onChange={(e) => update("footerIcon", e.target.value)}
              />
            </div>
          </div>
        </details>

        {/* SAVE */}
        <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Save
        </button>

        {/* PREVIEW */}
        <h3 className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Preview
        </h3>

        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-95
0 p-4">
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
              {/* AUTHOR */}
              {embed.authorName && (
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-300">
                  {embed.authorIcon && (
                    <div
                      className="h-5 w-5 rounded-full bg-slate-700 bg-cover bg-center"
                      style={{ backgroundImage: `url(${embed.authorIcon})` }}
                    />
                  )}
                  <span>{embed.authorName}</span>
                </div>
              )}

              {/* TITLE */}
              {embed.title && (
                <p className="text-sm font-semibold text-slate-100">
                  {embed.url ? (
                    <a
                      href={embed.url}
                      className="text-sky-400 hover:underline"
                      target="_blank"
                    >
                      {embed.title}
                    </a>
                  ) : (
                    embed.title
                  )}
                </p>
              )}

              {/* DESCRIPTION */}
              {embed.description && (
                <p className="mt-2 whitespace-pre-line text-slate-300">
                  {embed.description}
                </p>
              )}

              {/* IMAGE */}
              {embed.image && (
                <div
                  className="mt-3 h-32 rounded-md bg-slate-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${embed.image})` }}
                />
              )}

              {/* FOOTER */}
              {(embed.footerText || embed.footerIcon) && (
                <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                  {embed.footerIcon && (
                    <div
                      className="h-4 w-4 rounded-full bg-slate-700 bg-cover bg-center"
                      style={{ backgroundImage: `url(${embed.footerIcon})` }}
                    />
                  )}
                  <span>{embed.footerText}</span>
                </div>
              )}
            </div>

            {/* THUMB */}
            {embed.thumb && (
              <div
                className="h-16 w-16 rounded-md bg-slate-800 bg-cover bg-center shrink-0 mt-1"
                style={{ backgroundImage: `url(${embed.thumb})` }}
              />
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
