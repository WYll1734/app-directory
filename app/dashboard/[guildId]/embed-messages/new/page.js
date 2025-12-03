"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function NewEmbedPage({ params }) {
  const { guildId } = params;

  // ===============================
  // EMBED STATE
  // ===============================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [footer, setFooter] = useState("");
  const [color, setColor] = useState("#5865F2");

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6 flex flex-col gap-6">

      {/* BACK BUTTON */}
      <Link
        href={`/dashboard/${guildId}/embed-builder`}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
      >
        <ChevronLeft size={18} />
        Back to embeds
      </Link>

      <h1 className="text-2xl font-semibold text-white">New Embed Message</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* =================== PREVIEW =================== */}
        <div className="bg-[#111319] p-4 rounded-xl border border-white/5">
          <h2 className="text-gray-300 mb-3">Embed Preview</h2>

          <div
            className="rounded-lg p-4"
            style={{ borderLeft: `4px solid ${color}` }}
          >
            {title && (
              <p className="text-lg font-semibold text-white">{title}</p>
            )}

            {description && (
              <p className="text-gray-300 whitespace-pre-wrap mt-2">
                {description}
              </p>
            )}

            {footer && (
              <p className="text-gray-500 text-sm mt-4">{footer}</p>
            )}
          </div>
        </div>

        {/* =================== SETTINGS =================== */}
        <div className="bg-[#111319] p-4 rounded-xl border border-white/5">
          <h2 className="text-gray-300 mb-3">Settings</h2>

          <div className="flex flex-col gap-4">

            {/* TITLE */}
            <input
              className="bg-[#0d0f16] p-3 rounded-lg border border-white/5 text-white"
              placeholder="Embed title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* DESCRIPTION */}
            <textarea
              className="bg-[#0d0f16] p-3 rounded-lg border border-white/5 text-white h-40"
              placeholder="Embed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* FOOTER */}
            <input
              className="bg-[#0d0f16] p-3 rounded-lg border border-white/5 text-white"
              placeholder="Footer text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
            />

            {/* COLOR PICKER */}
            <div>
              <label className="text-sm text-gray-400">Color</label>
              <input
                type="color"
                className="w-full h-10 p-1 rounded-lg bg-[#0d0f16] border border-white/5"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            {/* CREATE BUTTON */}
            <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white p-3 rounded-lg">
              Create embed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
