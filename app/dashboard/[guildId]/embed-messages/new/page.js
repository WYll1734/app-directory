"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// ---------------------------------------------------------------
// Simple Discord-style embed preview
// ---------------------------------------------------------------
function EmbedPreview({ embed }) {
  return (
    <div className="bg-[#2b2d31] border border-[#1e1f22] rounded-lg p-4 mt-6">
      {/* Author */}
      {embed.author && (
        <div className="flex items-center gap-2 mb-2">
          {embed.authorIcon && (
            <img
              src={embed.authorIcon}
              className="w-5 h-5 rounded-full"
              alt=""
            />
          )}
          <p className="text-sm text-white">{embed.author}</p>
        </div>
      )}

      {/* Title */}
      {embed.title && (
        <p className="text-lg font-semibold text-white mb-1">
          {embed.title}
        </p>
      )}

      {/* Description */}
      {embed.description && (
        <p className="text-sm text-gray-300 whitespace-pre-line mb-2">
          {embed.description}
        </p>
      )}

      {/* Thumbnail */}
      {embed.thumb && (
        <img
          src={embed.thumb}
          className="w-20 h-20 object-cover rounded absolute top-4 right-4"
          alt=""
        />
      )}

      {/* Image */}
      {embed.image && (
        <img
          src={embed.image}
          className="w-full rounded-lg mt-4"
          alt=""
        />
      )}

      {/* Footer */}
      {embed.footer && (
        <p className="text-xs text-gray-400 mt-4 border-t border-[#1e1f22] pt-2">
          {embed.footer}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------
export default function NewEmbedPage({ params }) {
  const { guildId } = params;

  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  const [embed, setEmbed] = useState({
    title: "",
    description: "",
    author: "",
    authorIcon: "",
    thumb: "",
    image: "",
    footer: "",
  });

  // Fetch channels from your existing API
  useEffect(() => {
    async function loadChannels() {
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const data = await res.json();
        setChannels(data.channels || []);
      } catch (err) {
        console.error("Failed to load channels:", err);
      } finally {
        setLoadingChannels(false);
      }
    }
    loadChannels();
  }, [guildId]);

  return (
    <div className="p-6">

      {/* ----------------------------------------------------- */}
      {/* BACK BUTTON */}
      {/* ----------------------------------------------------- */}
      <Link
        href={`/dashboard/${guildId}/embed-builder`}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      <h1 className="text-2xl font-semibold text-white mb-6">New Embed</h1>

      {/* ----------------------------------------------------- */}
      {/* EMBED SETTINGS */}
      {/* ----------------------------------------------------- */}
      <div className="bg-[#1a1b1e] border border-[#2b2d31] rounded-lg p-5 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Embed Settings</h2>

        {/* Channel */}
        <label className="text-sm text-gray-400">Channel</label>
        <select
          className="w-full mt-1 p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
        >
          {loadingChannels ? (
            <option>Loading channels…</option>
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

        {/* Embed name */}
        <label className="text-sm text-gray-400 mt-4 block">Embed name</label>
        <input
          type="text"
          placeholder="New Embed"
          className="w-full mt-1 p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
        />
      </div>

      {/* ----------------------------------------------------- */}
      {/* EMBED BUILDER FORM */}
      {/* ----------------------------------------------------- */}
      <div className="bg-[#1a1b1e] border border-[#2b2d31] rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">
          Embed Message Builder
        </h2>

        {/* Message fields */}
        <div className="space-y-3">
          <input
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Title"
            value={embed.title}
            onChange={(e) => setEmbed({ ...embed, title: e.target.value })}
          />

          <textarea
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Description"
            rows={4}
            value={embed.description}
            onChange={(e) =>
              setEmbed({ ...embed, description: e.target.value })
            }
          />

          <input
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Author"
            value={embed.author}
            onChange={(e) => setEmbed({ ...embed, author: e.target.value })}
          />

          <input
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Author Icon URL"
            value={embed.authorIcon}
            onChange={(e) =>
              setEmbed({ ...embed, authorIcon: e.target.value })
            }
          />

          <input
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Thumbnail URL"
            value={embed.thumb}
            onChange={(e) => setEmbed({ ...embed, thumb: e.target.value })}
          />

          <input
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Main Image URL"
            value={embed.image}
            onChange={(e) => setEmbed({ ...embed, image: e.target.value })}
          />

          <input
            className="w-full p-2 bg-[#2b2d31] text-gray-200 rounded-lg"
            placeholder="Footer text"
            value={embed.footer}
            onChange={(e) => setEmbed({ ...embed, footer: e.target.value })}
          />
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* LIVE PREVIEW */}
      {/* ----------------------------------------------------- */}
      <EmbedPreview embed={embed} />

      {/* ----------------------------------------------------- */}
      {/* SAVE + PUBLISH BUTTONS */}
      {/* ----------------------------------------------------- */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600">
          Save
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Publish
        </button>
      </div>
    </div>
  );
}
