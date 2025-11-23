"use client";

import { useState } from "react";
import useSWR from "swr";

import Toggle from "@/components/ui/Toggle";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AuditLoggingTab({ guildId }) {
  const { data, isLoading } = useSWR(
    `/api/discord/guilds/${guildId}/channels`,
    fetcher
  );

  const channels = data?.channels ?? [];

  // CORE
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [ignoredChannels, setIgnoredChannels] = useState([]);

  // EVENT GROUPS
  const [events, setEvents] = useState({
    mute: true,
    unmute: true,
    ban: true,
    unban: true,

    msgUpdate: false,
    msgDelete: false,
    invite: false,

    nick: false,
    memberBan: false,
    join: false,
    leave: false,
    memberUnban: false,
    userUpdate: false,

    roleCreate: false,
    roleUpdate: false,
    roleDelete: false,
    roleMemberChange: false,

    voiceJoin: false,
    voiceLeave: false,

    serverEdit: false,
    emojiUpdate: false,
  });

  const toggleEvent = (key) =>
    setEvents((prev) => ({ ...prev, [key]: !prev[key] }));

  const [ignoreBots, setIgnoreBots] = useState(true);
  const [noThumbnails, setNoThumbnails] = useState(false);

  if (!data && isLoading) {
    return (
      <p className="text-slate-300 text-sm animate-pulse">
        Loading channels…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Audit Logging</h2>
          <p className="mt-1 text-sm text-slate-400">
            Configure what events should be logged.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">Active</span>
          <Toggle value={loggingEnabled} onChange={setLoggingEnabled} />
        </div>
      </div>

      {/* MAIN CARD */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="px-6 py-6 space-y-8">

          {/* LOGGING CHANNEL */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300">
              Logging Channel <span className="text-red-400">*</span>
            </label>

            <ChannelDropdown
              channels={channels}
              value={selectedChannel}
              onChange={setSelectedChannel}
            />
          </div>

          {/* EVENT GRID */}
          <div className="grid gap-10 md:grid-cols-2">

            {/* LEFT */}
            <div className="space-y-8">
              <EventGroup title="Moderation Events">
                <ToggleRow label="Member muted" value={events.mute} onClick={() => toggleEvent("mute")} />
                <ToggleRow label="Member unmuted" value={events.unmute} onClick={() => toggleEvent("unmute")} />
                <ToggleRow label="Member banned" value={events.ban} onClick={() => toggleEvent("ban")} />
                <ToggleRow label="Member unbanned" value={events.unban} onClick={() => toggleEvent("unban")} />
              </EventGroup>

              <EventGroup title="Message Events">
                <ToggleRow label="Message updated" value={events.msgUpdate} onClick={() => toggleEvent("msgUpdate")} />
                <ToggleRow label="Message deleted" value={events.msgDelete} onClick={() => toggleEvent("msgDelete")} />
                <ToggleRow label="Invite posted" value={events.invite} onClick={() => toggleEvent("invite")} />
              </EventGroup>

              <EventGroup title="Channel Events">
                <ToggleRow label="Channel created" value={events.roleCreate} onClick={() => toggleEvent("roleCreate")} />
                <ToggleRow label="Channel updated" value={events.roleUpdate} onClick={() => toggleEvent("roleUpdate")} />
                <ToggleRow label="Channel deleted" value={events.roleDelete} onClick={() => toggleEvent("roleDelete")} />
              </EventGroup>
            </div>

            {/* RIGHT */}
            <div className="space-y-8">
              <EventGroup title="Member Events">
                <ToggleRow label="Nickname changed" value={events.nick} onClick={() => toggleEvent("nick")} />
                <ToggleRow label="Member banned" value={events.memberBan} onClick={() => toggleEvent("memberBan")} />
                <ToggleRow label="Member joined" value={events.join} onClick={() => toggleEvent("join")} />
                <ToggleRow label="Member left" value={events.leave} onClick={() => toggleEvent("leave")} />
                <ToggleRow label="Member unbanned" value={events.memberUnban} onClick={() => toggleEvent("memberUnban")} />
                <ToggleRow label="User updated" value={events.userUpdate} onClick={() => toggleEvent("userUpdate")} />
              </EventGroup>

              <EventGroup title="Voice Events">
                <ToggleRow label="Joined voice channel" value={events.voiceJoin} onClick={() => toggleEvent("voiceJoin")} />
                <ToggleRow label="Left voice channel" value={events.voiceLeave} onClick={() => toggleEvent("voiceLeave")} />
              </EventGroup>

              <EventGroup title="Server Events">
                <ToggleRow label="Server edited" value={events.serverEdit} onClick={() => toggleEvent("serverEdit")} />
                <ToggleRow label="Emojis updated" value={events.emojiUpdate} onClick={() => toggleEvent("emojiUpdate")} />
              </EventGroup>
            </div>

          </div>
        </div>
      </section>

      {/* IGNORED CHANNELS */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="px-6 py-6 space-y-6">

          <div>
            <h3 className="text-base font-semibold text-slate-50">Ignored Channels</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Messages deleted/updated in these channels will not be logged.
            </p>
          </div>

          <ChannelMultiSelect
            channels={channels}
            values={ignoredChannels}
            onChange={setIgnoredChannels}
          />

          <div className="space-y-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Additional settings
            </p>

            <ToggleRow
              label="Ignore bot actions"
              value={ignoreBots}
              onClick={() => setIgnoreBots((p) => !p)}
            />

            <ToggleRow
              label="Hide user thumbnails"
              value={noThumbnails}
              onClick={() => setNoThumbnails((p) => !p)}
            />
          </div>

        </div>
      </section>
    </div>
  );
}

/* COMPONENTS */

function EventGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 uppercase tracking-wide">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, value, onClick }) {
  return (
    <div className="flex items-center gap-4">
      <Toggle value={value} onChange={onClick} />
      <span className="text-sm text-slate-200">{label}</span>
    </div>
  );
}
