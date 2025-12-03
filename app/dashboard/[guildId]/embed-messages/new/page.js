"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ---------------------------------------------------------
// LIVE PREVIEW COMPONENT
// ---------------------------------------------------------
function EmbedPreview({ embed }) {
  return (
    <div className="p-4 bg-[#1a1d29] rounded-xl border border-white/5 text-white w-full">
      {/* Color bar */}
      <div className="w-full h-1 rounded-md" style={{ background: embed.color }} />

      <div className="mt-3">
        {embed.title && <p className="text-lg font-semibold">{embed.title}</p>}
        {embed.description && (
          <p className="text-sm text-white/70 whitespace-pre-line mt-1">
            {embed.description}
          </p>
        )}
      </div>

      {embed.footer && (
        <div className="mt-4">
          <p className="text-xs text-white/40">{embed.footer}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------
export default function NewEmbedPage({ params }) {
  const { guildId } = params;

  const [channels, setChannels] = useState([]);

  // -----------------------------
  // EMBED STATE
  // -----------------------------
  const [embed, setEmbed] = useState({
    title: "",
    description: "",
    footer: "",
    color: "#5865F2",
    buttonLabel: "Open Ticket",
    buttonStyle: "Primary",
    linkButtons: [],
    channelId: "",
  });

  // -----------------------------
  // Fetch channels from your existing API
  // -----------------------------
  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();
        setChannels(data.channels || []);
      } catch (err) {
        console.error("Failed to load channels:", err);
      }
    }

    fetchChannels();
  }, [guildId]);

  // -----------------------------
  // LINK BUTTON HANDLER
  // -----------------------------
  const addLinkButton = () => {
    setEmbed((prev) => ({
      ...prev,
      linkButtons: [...prev.linkButtons, { label: "", url: "" }],
    }));
  };

  const updateLinkButton = (i, field, value) => {
    const updated = [...embed.linkButtons];
    updated[i][field] = value;
    setEmbed((prev) => ({ ...prev, linkButtons: updated }));
  };

  return (
    <div className="p-8">

      {/* BACK BUTTON */}
      <Link
        href={`/dashboard/${guildId}/embeds`}
        className="flex items-center gap-2 text-white/60 hover:text-white transition mb-6"
      >
        <ChevronLeft size={20} /> Back
      </Link>

      <h1 className="text-xl font-semibold text-white mb-6">New Embed Message</h1>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-2 gap-8">

        {/* LEFT SIDE – LIVE PREVIEW */}
        <div className="space-y-4">

          <h2 className="text-white/70 text-sm">Embed Preview</h2>

          <EmbedPreview embed={embed} />

        </div>

        {/* RIGHT SIDE – SETTINGS */}
        <div className="space-y-6">

          {/* CHANNEL DROPDOWN */}
          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-sm">Target Channel</label>
            <select
              value={embed.channelId}
              onChange={(e) =>
                setEmbed((prev) => ({ ...prev, channelId: e.target.value }))
              }
              className="bg-[#11131b] border border-white/5 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select a channel…</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  #{ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-sm">Title</label>
            <input
              type="text"
              value={embed.title}
              onChange={(e) =>
                setEmbed((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-[#11131b] border border-white/5 rounded-lg px-3 py-2 text-white"
              placeholder="Embed title…"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-sm">Description</label>
            <textarea
              value={embed.description}
              onChange={(e) =>
                setEmbed((prev) => ({ ...prev, description: e.target.value }))
              }
              className="bg-[#11131b] border border-white/5 rounded-lg px-3 py-2 text-white"
              rows={4}
              placeholder="Embed description…"
            />
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-sm">Footer</label>
            <input
              type="text"
              value={embed.footer}
              onChange={(e) =>
                setEmbed((prev) => ({ ...prev, footer: e.target.value }))
              }
              className="bg-[#11131b] border border-white/5 rounded-lg px-3 py-2 text-white"
              placeholder="Footer text…"
            />
          </div>

          {/* EMBED COLOR */}
          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-sm">Embed Color</label>
            <input
              type="color"
              value={embed.color}
              onChange={(e) =>
                setEmbed((prev) => ({ ...prev, color: e.target.value }))
              }
              className="h-10 w-20 rounded border border-white/10"
            />
          </div>

          {/* LINK BUTTONS */}
          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-sm">Link Buttons</label>

            {embed.linkButtons.map((btn, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Button label"
                  value={btn.label}
                  className="bg-[#11131b] border border-white/5 rounded-lg px-3 py-2 text-white"
                  onChange={(e) => updateLinkButton(i, "label", e.target.value)}
                />

                <input
                  type="text"
                  placeholder="URL"
                  value={btn.url}
                  className="bg-[#11131b] border border-white/5 rounded-lg px-3 py-2 text-white"
                  onChange={(e) => updateLinkButton(i, "url", e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={addLinkButton}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm w-fit mt-1"
            >
              + Add Link Button
            </button>
          </div>

          {/* CREATE EMBED BUTTON */}
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Create Embed
          </button>

        </div>
      </div>
    </div>
  );
}
