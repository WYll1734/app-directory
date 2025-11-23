"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Hash, Mic, Folder } from "lucide-react";

export default function ChannelMultiSelect({
  channels = [],
  values,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef(null);

  // ==========================
  // Format channels into groups
  // ==========================
  function groupChannels(chList) {
    const categories = {};
    const text = [];
    const voice = [];

    chList.forEach((ch) => {
      if (values.some((v) => v.id === ch.id)) return; // hide selected

      // CATEGORY
      if (ch.type === 4) {
        categories[ch.id] = { ...ch, children: [] };
      }

      // TEXT
      else if (ch.type === 0) {
        text.push(ch);
      }

      // VOICE
      else if (ch.type === 2) {
        voice.push(ch);
      }
    });

    // Attach children to their category
    chList.forEach((ch) => {
      if (ch.parent_id && categories[ch.parent_id] && ch.type !== 4) {
        categories[ch.parent_id].children.push(ch);
      }
    });

    return {
      categories: Object.values(categories),
      text,
      voice,
    };
  }

  const grouped = useMemo(() => {
    const list = channels.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    return groupChannels(list);
  }, [channels, search, values]);

  // ==========================
  // Click outside to close
  // ==========================
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ==========================
  // Add & Remove
  // ==========================
  const addChannel = (ch) => {
    onChange([...values, ch]);
    setSearch("");
  };

  const removeChannel = (id) => {
    onChange(values.filter((x) => x.id !== id));
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/70 text-sm px-3 py-2 cursor-pointer hover:bg-slate-800 transition"
      >
        <span className="text-slate-300">
          {values.length > 0
            ? `${values.length} selected`
            : "Select channels..."}
        </span>

        <ChevronDown size={18} className="text-slate-400" />
      </div>

      {/* SELECTED PILLS */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {values.map((ch) => (
            <div
              key={ch.id}
              className="
                flex items-center gap-2 text-xs px-2 py-1 
                bg-indigo-600/30 border border-indigo-500/40 
                text-indigo-200 rounded-lg
              "
            >
              {ch.name}
              <button
                onClick={() => removeChannel(ch.id)}
                className="text-indigo-300 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 z-40 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-3 max-h-72 overflow-y-auto">
          {/* Search */}
          <input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-slate-800 border border-slate-700 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* If everything filtered out */}
          {!grouped.text.length &&
            !grouped.voice.length &&
            !grouped.categories.length && (
              <p className="text-xs text-slate-500 py-2">No channels found</p>
            )}

          {/* CATEGORY GROUPS */}
          {grouped.categories.map((cat) => (
            <div key={cat.id} className="mb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase px-1 mb-1">
                <Folder size={14} />
                {cat.name}
              </div>

              {cat.children.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => addChannel(ch)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  <Hash size={15} className="text-slate-500" />
                  {ch.name}
                </button>
              ))}
            </div>
          ))}

          {/* TEXT CHANNELS */}
          {grouped.text.length > 0 && (
            <>
              <p className="text-xs text-slate-500 uppercase px-1 mb-1">
                Text Channels
              </p>
              {grouped.text.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => addChannel(ch)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  <Hash size={15} className="text-slate-500" />
                  {ch.name}
                </button>
              ))}
            </>
          )}

          {/* VOICE CHANNELS */}
          {grouped.voice.length > 0 && (
            <>
              <p className="text-xs text-slate-500 uppercase px-1 mt-3 mb-1">
                Voice Channels
              </p>
              {grouped.voice.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => addChannel(ch)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  <Mic size={15} className="text-slate-500" />
                  {ch.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
