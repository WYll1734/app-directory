"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Link2 } from "lucide-react";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";

function TopSaveBar({ onDiscard, onSave, onPublish, saving, saved }) {
  return (
    <div className="flex items-center justify-end gap-3 border-b border-slate-800/80 bg-slate-950/70 px-5 py-3">
      <button
        type="button"
        onClick={onDiscard}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
      >
        Discard
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={onPublish}
        className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500"
      >
        Publish
      </button>
    </div>
  );
}

function MessagePreview({ message, embeds }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Fake author line */}
      <div className="flex items-center gap-3 text-sm">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400" />
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100">
              Random Mafia Shooter
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-900">
              Bot
            </span>
            <span className="text-[11px] text-slate-500">Today at 1:01 AM</span>
          </div>
        </div>
      </div>

      {/* Content preview box */}
      {message && (
        <div className="w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
          {message}
        </div>
      )}

      {/* Embeds preview */}
      {embeds.map((embed) => (
        <div
          key={embed.id}
          className="mt-1 flex overflow-hidden rounded-md border-l-4 border-sky-500 bg-slate-900/90"
        >
          <div className="flex-1 px-4 py-3 text-sm">
            {embed.title && (
              <div className="mb-1 font-semibold text-slate-50">
                {embed.title}
              </div>
            )}
            {embed.description && (
              <div className="whitespace-pre-line text-slate-200">
                {embed.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EditableEmbedCard({ embed, onChange, onRemove }) {
  const update = (field, value) => {
    onChange({ ...embed, [field]: value });
  };

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <div className="absolute right-3 top-3">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Color</span>
            <input
              type="color"
              value={embed.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-slate-700 bg-slate-900 p-0"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">
              Title
              <input
                value={embed.title}
                onChange={(e) => update("title", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                placeholder="Write your title here!"
              />
            </label>

            <label className="text-xs font-medium text-slate-400">
              Description
              <textarea
                rows={4}
                value={embed.description}
                onChange={(e) => update("description", e.target.value)}
                className="mt-1 w-full resize-none rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                placeholder="Write your description here…"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">
              Thumbnail URL
              <input
                value={embed.thumbnail}
                onChange={(e) => update("thumbnail", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                placeholder="https://example.com/thumb.png"
              />
            </label>

            <label className="text-xs font-medium text-slate-400">
              Image URL
              <input
                value={embed.image}
                onChange={(e) => update("image", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                placeholder="https://example.com/image.png"
              />
            </label>

            <label className="text-xs font-medium text-slate-400">
              Footer text
              <input
                value={embed.footer}
                onChange={(e) => update("footer", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                placeholder="Write footer text…"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewEmbedPage({ params }) {
  const { guildId } = params;
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [channelId, setChannelId] = useState("");
  const [embedName, setEmbedName] = useState("New Embed");

  const [message, setMessage] = useState("");
  const [embeds, setEmbeds] = useState([
    {
      id: "embed-1",
      title: "Title",
      description: "",
      color: "#5865F2",
      thumbnail: "",
      image: "",
      footer: "",
    },
  ]);

  const [linkButtons, setLinkButtons] = useState([]);

  const runSave = () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);

    // UI-only for now – log the payload, swap to real API later
    setTimeout(() => {
      console.log("Embed save payload", {
        guildId,
        channelId,
        embedName,
        message,
        embeds,
        linkButtons,
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 700);
  };

  const runPublish = () => {
    // For now publish = save; you can swap this to a different endpoint later
    runSave();
  };

  const addEmbed = () => {
    if (embeds.length >= 10) return;
    setEmbeds((prev) => [
      ...prev,
      {
        id: `embed-${prev.length + 1}`,
        title: "",
        description: "",
        color: "#5865F2",
        thumbnail: "",
        image: "",
        footer: "",
      },
    ]);
  };

  const updateEmbed = (id, next) => {
    setEmbeds((prev) => prev.map((e) => (e.id === id ? next : e)));
  };

  const removeEmbed = (id) => {
    setEmbeds((prev) => prev.filter((e) => e.id !== id));
  };

  const addLinkButton = () => {
    setLinkButtons((prev) => [
      ...prev,
      { id: `btn-${prev.length + 1}`, label: "Button label", url: "" },
    ]);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800/90 bg-slate-950/70">
      <TopSaveBar
        onDiscard={() => router.back()}
        onSave={runSave}
        onPublish={runPublish}
        saving={saving}
        saved={saved}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        {/* Embed meta section */}
        <section className="rounded-xl border border-slate-800 bg-slate-950/60 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Embed</h2>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-400">
                Channel<span className="text-red-500">*</span>
                <div className="mt-1">
                  <ChannelDropdown
                    guildId={guildId}
                    value={channelId}
                    onChange={setChannelId}
                    placeholder="Select a channel"
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">
                Embed name<span className="text-red-500">*</span>
                <input
                  value={embedName}
                  onChange={(e) => setEmbedName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Message + embeds */}
        <section className="rounded-xl border border-slate-800 bg-slate-950/60 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">Message</h2>
          <p className="mt-1 text-xs text-slate-400">
            Embed message builder – create your embed with optional message the
            way you want it.
          </p>

          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            {/* Left side – editor */}
            <div className="flex flex-col gap-4">
              <label className="text-xs font-medium text-slate-400">
                Message content
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full resize-none rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                  placeholder="Write your message here!"
                />
              </label>

              <div className="flex flex-col gap-4">
                {embeds.map((embed) => (
                  <EditableEmbedCard
                    key={embed.id}
                    embed={embed}
                    onChange={(next) => updateEmbed(embed.id, next)}
                    onRemove={() => removeEmbed(embed.id)}
                  />
                ))}

                <button
                  type="button"
                  onClick={addEmbed}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-900/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add embed
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={addLinkButton}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-900/70"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Add link button
                </button>

                {linkButtons.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
                    {linkButtons.map((btn) => (
                      <div
                        key={btn.id}
                        className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-1.5"
                      >
                        <input
                          value={btn.label}
                          onChange={(e) =>
                            setLinkButtons((prev) =>
                              prev.map((b) =>
                                b.id === btn.id
                                  ? { ...b, label: e.target.value }
                                  : b
                              )
                            )
                          }
                          className="w-32 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none focus:border-slate-500"
                          placeholder="Label"
                        />
                        <input
                          value={btn.url}
                          onChange={(e) =>
                            setLinkButtons((prev) =>
                              prev.map((b) =>
                                b.id === btn.id
                                  ? { ...b, url: e.target.value }
                                  : b
                              )
                            )
                          }
                          className="flex-1 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none focus:border-slate-500"
                          placeholder="https://example.com"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side – live preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preview
              </h3>
              <MessagePreview message={message} embeds={embeds} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
