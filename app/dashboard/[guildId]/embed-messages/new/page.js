"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEmbedPage({ params }) {
  const { guildId } = params;

  // -------------------------
  // CHANNEL FETCH
  // -------------------------
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();
        setChannels(data.channels || []);
      } catch (err) {
        console.error("Channel fetch error:", err);
      }
      setLoadingChannels(false);
    }
    fetchChannels();
  }, [guildId]);

  // -------------------------
  // FORM STATE
  // -------------------------
  const [embed, setEmbed] = useState({
    title: "",
    description: "",
    footer: "",
    color: "#5865F2",
  });

  const [button, setButton] = useState({
    label: "",
    url: "",
  });

  const update = (field, value) =>
    setEmbed((prev) => ({ ...prev, [field]: value }));

  const updateButton = (field, value) =>
    setButton((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-6">

      {/* ------------------------- */}
      {/* BACK BUTTON */}
      {/* ------------------------- */}
      <Link
        href={`/dashboard/${guildId}/embed-builder`}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4"
      >
        <ArrowLeft size={18} /> Back
      </Link>

      <h1 className="text-2xl font-semibold mb-6">New Embed Message</h1>

      {/* =============================== */}
      {/* TWO-COLUMN LAYOUT */}
      {/* =============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — LIVE EMBED PREVIEW */}
        <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-800">

          <h2 className="text-lg font-medium mb-3">Embed Preview</h2>

          <div
            className="p-4 rounded-lg"
            style={{ borderLeft: `4px solid ${embed.color}` }}
          >
            {embed.title && (
              <p className="text-lg font-semibold text-white">{embed.title}</p>
            )}

            {embed.description && (
              <p className="text-gray-300 mt-1 whitespace-pre-line">
                {embed.description}
              </p>
            )}

            {embed.footer && (
              <p className="text-gray-500 text-sm mt-3">{embed.footer}</p>
            )}

            {button.label && button.url && (
              <a
                href={button.url}
                target="_blank"
                className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm hover:bg-indigo-700 transition"
              >
                {button.label}
              </a>
            )}
          </div>
        </div>

        {/* RIGHT — SETTINGS */}
        <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-800">
          <h2 className="text-lg font-medium mb-3">Settings</h2>

          {/* Channel dropdown */}
          <label className="block text-sm mb-1">Target channel</label>
          <select className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4 text-white">
            {loadingChannels ? (
              <option>Loading…</option>
            ) : (
              <>
                <option value="">Select a channel</option>
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    #{ch.name}
                  </option>
                ))}
              </>
            )}
          </select>

          {/* Embed title */}
          <label className="block text-sm mb-1">Embed title</label>
          <input
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4 text-white"
            placeholder="Enter title…"
            value={embed.title}
            onChange={(e) => update("title", e.target.value)}
          />

          {/* Description */}
          <label className="block text-sm mb-1">Embed description</label>
          <textarea
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4 text-white h-32"
            placeholder="Write description…"
            value={embed.description}
            onChange={(e) => update("description", e.target.value)}
          />

          {/* Footer */}
          <label className="block text-sm mb-1">Footer text</label>
          <input
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4 text-white"
            placeholder="Footer text…"
            value={embed.footer}
            onChange={(e) => update("footer", e.target.value)}
          />

          {/* Color */}
          <label className="block text-sm mb-1">Embed color (hex)</label>
          <input
            type="color"
            className="w-full h-10 rounded-lg mb-6 cursor-pointer"
            value={embed.color}
            onChange={(e) => update("color", e.target.value)}
          />

          {/* ------------------------- */}
          {/* LINK BUTTON (MEE6 STYLE) */}
          {/* ------------------------- */}
          <h3 className="text-md font-medium mb-2">Link Button</h3>

          <input
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mb-3 text-white"
            placeholder="Button label (e.g. Open Ticket)"
            value={button.label}
            onChange={(e) => updateButton("label", e.target.value)}
          />

          <input
            className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4 text-white"
            placeholder="Button URL (https://)"
            value={button.url}
            onChange={(e) => updateButton("url", e.target.value)}
          />

          {/* SUBMIT BUTTON */}
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white mt-4 w-full">
            Create embed
          </button>
        </div>
      </div>
    </div>
  );
}
