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

  // CHANNEL SELECTOR STATE
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("create");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // FETCH CHANNELS FROM API (YOUR ACTUAL API)
  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();

        if (data.ok) setChannels(data.channels);
        else console.error("Channel fetch failed:", data);
      } catch (err) {
        console.error("Channel fetch error:", err);
      } finally {
        setLoadingChannels(false);
      }
    }
    fetchChannels();
  }, [guildId]);

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

      {/** HEADER */}
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

      {/** CHANNEL SELECTOR */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="text-sm font-semibold text-slate-200">
          Choose your Welcome Channel
        </h2>

        <div className="mt-4 relative">

          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
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

              {/** FIRST OPTION: create */}
              <button
                type="button"
                onClick={() => {
                  setSelectedChannel("create");
                  setDropdownOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 hover:bg-slate-800 ${
                  selectedChannel === "create"
                    ? "text-indigo-400"
                    : "text-slate-200"
                }`}
              >
                <span>Create #welcome channel (recommended)</span>
                {selectedChannel === "create" && (
                  <span className="text-xs text-indigo-400">Selected</span>
                )}
              </button>

              {/** CATEGORY SECTIONS */}
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
                            <span className="text-xs text-indigo-400">
                              Selected
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                ))}

              {/** UNCATEGORIZED TEXT CHANNELS */}
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

      {/** EMBED BUILDER... (KEEP YOUR ORIGINAL) */}
      {/* (Not repeating here, your embed builder code stays exactly the same) */}

    </div>
  );
}
