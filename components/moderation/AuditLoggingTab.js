"use client";

import { useEffect, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function AuditLoggingTab({ guildId }) {
  const [channels, setChannels] = useState(null); // null = not loaded
  const [loading, setLoading] = useState(true);

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
    async function loadChannels() {
      try {
        const res = await fetch(`/api/discord/guild/${guildId}/channels`);
        const json = await res.json();

        if (json.channels && Array.isArray(json.channels)) {
          setChannels(json.channels);
        } else {
          setChannels([]);
        }
      } catch (err) {
        console.error("Failed to load channels:", err);
        setChannels([]);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, [guildId]);

  if (loading || channels === null) {
    return (
      <p className="text-slate-300 text-sm animate-pulse">
        Loading channels…
      </p>
    );
  }

  const toggleEvent = (key) =>
    setEvents((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

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

      {/* MAIN SETTINGS CARD */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-10">
        {/* Logging channel */}
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

        {/* Event groups */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <EventGroup title="Moderation Events">
              <ToggleRow
                label="Member muted"
                value={events.mute}
                onChange={() => toggleEvent("mute")}
              />
              <ToggleRow
                label="Member unmuted"
                value={events.unmute}
                onChange={() => toggleEvent("unmute")}
              />
              <ToggleRow
                label="Member banned"
                value={events.ban}
                onChange={() => toggleEvent("ban")}
              />
              <ToggleRow
                label="Member unbanned"
                value={events.unban}
                onChange={() => toggleEvent("unban")}
              />
            </EventGroup>

            <EventGroup title="Message Events">
              <ToggleRow
                label="Message updated"
                value={events.msgUpdate}
                onChange={() => toggleEvent("msgUpdate")}
              />
              <ToggleRow
                label="Message deleted"
                value={events.msgDelete}
                onChange={() => toggleEvent("msgDelete")}
              />
              <ToggleRow
                label="Invite posted"
                value={events.invite}
                onChange={() => toggleEvent("invite")}
              />
            </EventGroup>

            <EventGroup title="Channel Events">
              <ToggleRow
                label="Channel created"
                value={events.roleCreate}
                onChange={() => toggleEvent("roleCreate")}
              />
              <ToggleRow
                label="Channel updated"
                value={events.roleUpdate}
                onChange={() => toggleEvent("roleUpdate")}
              />
              <ToggleRow
                label="Channel deleted"
                value={events.roleDelete}
                onChange={() => toggleEvent("roleDelete")}
              />
            </EventGroup>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            <EventGroup title="Member Events">
              <ToggleRow
                label="Nickname changed"
                value={events.nick}
                onChange={() => toggleEvent("nick")}
              />
              <ToggleRow
                label="Member joined"
                value={events.join}
                onChange={() => toggleEvent("join")}
              />
              <ToggleRow
                label="Member left"
                value={events.leave}
                onChange={() => toggleEvent("leave")}
              />
              <ToggleRow
                label="User updated"
                value={events.userUpdate}
                onChange={() => toggleEvent("userUpdate")}
              />
            </EventGroup>

            <EventGroup title="Role Events">
              <ToggleRow
                label="Role created"
                value={events.roleCreate}
                onChange={() => toggleEvent("roleCreate")}
              />
              <ToggleRow
                label="Role updated"
                value={events.roleUpdate}
                onChange={() => toggleEvent("roleUpdate")}
              />
              <ToggleRow
                label="Role deleted"
                value={events.roleDelete}
                onChange={() => toggleEvent("roleDelete")}
              />
              <ToggleRow
                label="Member roles changed"
                value={events.roleMemberChange}
                onChange={() => toggleEvent("roleMemberChange")}
              />
            </EventGroup>

            <EventGroup title="Voice Events">
              <ToggleRow
                label="Joined voice"
                value={events.voiceJoin}
                onChange={() => toggleEvent("voiceJoin")}
              />
              <ToggleRow
                label="Left voice"
                value={events.voiceLeave}
                onChange={() => toggleEvent("voiceLeave")}
              />
            </EventGroup>

            <EventGroup title="Server Events">
              <ToggleRow
                label="Server edited"
                value={events.serverEdit}
                onChange={() => toggleEvent("serverEdit")}
              />
              <ToggleRow
                label="Emojis updated"
                value={events.emojiUpdate}
                onChange={() => toggleEvent("emojiUpdate")}
              />
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
            Actions inside these channels will be ignored by logging.
          </p>
        </div>

        <ChannelMultiSelect
          channels={channels}
          values={ignoredChannels}
          onChange={setIgnoredChannels}
        />

        <div className="space-y-2 pt-4 border-t border-slate-800">
          <ToggleRow
            label="Ignore bot actions"
            value={settings.ignoreBots}
            onChange={() => toggleSetting("ignoreBots")}
          />
          <ToggleRow
            label="Hide user thumbnails"
            value={settings.noThumbs}
            onChange={() => toggleSetting("noThumbs")}
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

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <Toggle value={value} onChange={onChange} />
      <span className="text-sm text-slate-200">{label}</span>
    </div>
  );
}
