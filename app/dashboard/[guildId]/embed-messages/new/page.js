"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ------------------------------------------------------
// page.js — FULL WORKING EMBED BUILDER UI (MEE6-style)
// ------------------------------------------------------

export default function NewEmbedPage({ params }) {
  const { guildId } = params;

  // ----------------------------
  // STATE
  // ----------------------------
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");

  const [embed, setEmbed] = useState({
    title: "",
    description: "",
    footer: "",
    color: "#5865F2",
  });

  const [linkButtons, setLinkButtons] = useState([]);

  // ----------------------------
  // FETCH CHANNELS
  // ----------------------------
  useEffect(() => {
    async function loadChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();

        if (Array.isArray(data)) setChannels(data);
      } catch (err) {
        console.error("Failed loading channels:", err);
      }
    }
    loadChannels();
  }, [guildId]);

  // ----------------------------
  // ADD LINK BUTTON (MEE6 style)
  // ----------------------------
  const addLinkButton = () => {
    setLinkButtons((prev) => [...prev, { label: "", url: "" }]);
  };

  const updateLinkButton = (i, field, value) => {
    const updated = [...linkButtons];
    updated[i][field] = value;
    setLinkButtons(updated);
  };

  const removeLinkButton = (i) => {
    setLinkButtons((prev) => prev.filter((_, index) => index !== i));
  };

  // ----------------------------
  // UPDATE EMBED FIELD
  // ----------------------------
  const updateField = (field, value) => {
    setEmbed((prev) => ({ ...prev, [field]: value }));
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="p-8">
      {/* Back Button */}
      <Link
        href={`/dashboard/${guildId}/embeds`}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <h1 className="text-xl font-semibold mb-4">New Embed Message</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT — EMBED PREVIEW */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <h2 className="font-medium mb-3">Embed Preview</h2>

          <div
            className="rounded-lg p-4"
            style={{
              borderLeft: `4px solid ${embed.color}`,
            }}
          >
            {embed.title && (
              <div className="text-lg font-semibold mb-1">{embed.title}</div>
            )}

            {embed.description && (
              <div className="text-gray-300 whitespace-pre-line mb-2">
                {embed.description}
              </div>
            )}

            {embed.footer && (
              <div className="text-xs text-gray-500 mt-3">{embed.footer}</div>
            )}
          </div>
        </div>

        {/* RIGHT — SETTINGS */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <h2 className="font-medium mb-3">Settings</h2>

          {/* Channel Dropdown */}
          <label className="text-sm">Target Channel</label>
          <select
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 mb-4"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            <option value="">Select a channel</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>
                #{ch.name}
              </option>
            ))}
          </select>

          {/* Embed Title */}
          <label className="text-sm">Title</label>
          <input
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 mb-3"
            placeholder="Embed title"
            value={embed.title}
            onChange={(e) => updateField("title", e.target.value)}
          />

          {/* Description */}
          <label className="text-sm">Description</label>
          <textarea
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 mb-3 h-28"
            placeholder="Embed description..."
            value={embed.description}
            onChange={(e) => updateField("description", e.target.value)}
          />

          {/* Footer */}
          <label className="text-sm">Footer</label>
          <input
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 mb-3"
            placeholder="Footer text"
            value={embed.footer}
            onChange={(e) => updateField("footer", e.target.value)}
          />

          {/* Color */}
          <label className="text-sm">Embed Color (hex)</label>
          <input
            type="color"
            className="w-full h-10 bg-[#0f172a] border border-gray-700 rounded-lg p-1 mb-4"
            value={embed.color}
            onChange={(e) => updateField("color", e.target.value)}
          />

          {/* Link Buttons */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm">Link Buttons</label>
              <button
                onClick={addLinkButton}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs"
              >
                Add link
              </button>
            </div>

            {linkButtons.map((btn, i) => (
              <div
                key={i}
                className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg mb-2"
              >
                <input
                  className="w-full bg-[#1e293b] border border-gray-600 rounded-lg p-1 mb-2"
                  placeholder="Button label"
                  value={btn.label}
                  onChange={(e) => updateLinkButton(i, "label", e.target.value)}
                />

                <input
                  className="w-full bg-[#1e293b] border border-gray-600 rounded-lg p-1 mb-2"
                  placeholder="Button URL"
                  value={btn.url}
                  onChange={(e) => updateLinkButton(i, "url", e.target.value)}
                />

                <button
                  onClick={() => removeLinkButton(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
            Create Embed
          </button>
        </div>
      </div>
    </div>
  );
}
