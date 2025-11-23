"use client";

import { useState, useEffect } from "react";
import Toggle from "@/components/ui/Toggle";

import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function AuditLoggingTab({ guildId }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  // SETTINGS
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [logChannel, setLogChannel] = useState(null);
  const [ignoredChannels, setIgnoredChannels] = useState([]);

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

  const [settings, setSettings] = useState({
    ignoreBots: true,
    noThumbs: false,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/discord/guild/${guildId}/channels`);
      const json = await res.json();
      if (json.channels) setChannels(json.channels);
      setLoading(false);
    }
    load();
  }, [guildId]);

  if (loading)
    return (
      <p className="text-slate-300 animate-pulse">
        Loading channels…
      </p>
    );

  const toggleEvent = (key) =>
    setEvents({ ...events, [key]: !events[key] });

  const updateSetting = (key) =>
    setSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="space-y-10 pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            Audit Logging
          </h2>
          <p className="text-sm text-slate-400">
            Configure what events should be logged.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">Active</span>
          <Toggle value={loggingEnabled} onChange={setLoggingEnabled} />
        </div>
      </div>

      {/* MAIN CARD */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-10">

        {/* LOG CHANNEL */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            Logging Channel <span className="text-red-400">*</span>
          </label>

          <ChannelDropdown
            channels={channels}
            value={logChannel}
            onChange={setLogChannel}
          />
        </div>

        {/* EVENT GROUPS */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT */}
          <div className="space-y-10">

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
          <div className="space-y-10">

            <EventGroup title="Member Events">
              <ToggleRow label="Nickname changed" value={events.nick} onClick={() => toggleEvent("nick")} />
              <ToggleRow label="Member joined" value={events.join} onClick={() => toggleEvent("join")} />
              <ToggleRow label="Member left" value={events.leave} onClick={() => toggleEvent("leave")} />
              <ToggleRow label="User updated" value={events.userUpdate} onClick={() => toggleEvent("userUpdate")} />
            </EventGroup>

            <EventGroup title="Role Events">
              <ToggleRow label="Role created" value={events.roleCreate} onClick={() => toggleEvent("roleCreate")} />
              <ToggleRow label="Role updated" value={events.roleUpdate} onClick={() => toggleEvent("roleUpdate")} />
              <ToggleRow label="Role deleted" value={events.roleDelete} onClick={() => toggleEvent("roleDelete")} />
              <ToggleRow label="Member role changed" value={events.roleMemberChange} onClick={() => toggleEvent("roleMemberChange")} />
            </EventGroup>

            <EventGroup title="Voice Events">
              <ToggleRow label="Joined voice" value={events.voiceJoin} onClick={() => toggleEvent("voiceJoin")} />
              <ToggleRow label="Left voice" value={events.voiceLeave} onClick={() => toggleEvent("voiceLeave")} />
            </EventGroup>

            <EventGroup title="Server Events">
              <ToggleRow label="Server edited" value={events.serverEdit} onClick={() => toggleEvent("serverEdit")} />
              <ToggleRow label="Emojis updated" value={events.emojiUpdate} onClick={() => toggleEvent("emojiUpdate")} />
            </EventGroup>
          </div>
        </div>
      </section>

      {/* IGNORED CHANNELS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">

        <div>
          <h3 className="text-base font-semibold text-slate-50">
            Ignored Channels
          </h3>
          <p className="text-xs text-slate-400">
            Actions inside these channels will not be logged.
          </p>
        </div>

        <ChannelMultiSelect
          channels={channels}
          values={ignoredChannels}
          onChange={setIgnoredChannels}
        />

        <div className="space-y-2 pt-4">
          <ToggleRow
            label="Ignore bot actions"
            value={settings.ignoreBots}
            onClick={() => updateSetting("ignoreBots")}
          />
          <ToggleRow
            label="Hide user thumbnails"
            value={settings.noThumbs}
            onClick={() => updateSetting("noThumbs")}
          />
        </div>
      </section>
    </div>
  );
}

function EventGroup({ title, children }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, value, onClick }) {
  return (
    <div className="flex items-center gap-3">
      <Toggle value={value} onChange={onClick} />
      <span className="text-sm text-slate-200">{label}</span>
    </div>
  );
}
