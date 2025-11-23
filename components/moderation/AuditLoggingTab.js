"use client";

import { useEffect, useState } from "react";

import Toggle from "@/components/ui/Toggle";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function AuditLoggingTab({ guildId }) {
  // ================================
  // CHANNEL LOADING
  // ================================
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadChannels() {
      setLoadingChannels(true);
      try {
        const res = await fetch(`/api/discord/guilds/${guildId}/channels`);
        const json = await res.json();

        if (cancelled) return;

        // API returns: { ok: true, channels: [...] }
        let list = [];
        if (Array.isArray(json)) {
          list = json;
        } else if (Array.isArray(json.channels)) {
          list = json.channels;
        }

        setChannels(list);
      } catch (err) {
        console.error("Failed to load channels for Audit Logging:", err);
        if (!cancelled) setChannels([]);
      } finally {
        if (!cancelled) setLoadingChannels(false);
      }
    }

    loadChannels();
    return () => {
      cancelled = true;
    };
  }, [guildId]);

  // ================================
  // CORE STATE
  // ================================
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [ignoredChannels, setIgnoredChannels] = useState([]);

  // Moderation events
  const [eventMute, setEventMute] = useState(true);
  const [eventUnmute, setEventUnmute] = useState(true);
  const [eventBan, setEventBan] = useState(true);
  const [eventUnban, setEventUnban] = useState(true);

  // Message events
  const [eventMsgUpdate, setEventMsgUpdate] = useState(false);
  const [eventMsgDelete, setEventMsgDelete] = useState(false);
  const [eventInvite, setEventInvite] = useState(false);

  // Member events
  const [eventNick, setEventNick] = useState(false);
  const [eventMemberBan, setEventMemberBan] = useState(false);
  const [eventJoin, setEventJoin] = useState(false);
  const [eventLeave, setEventLeave] = useState(false);
  const [eventMemberUnban, setEventMemberUnban] = useState(false);
  const [eventUserUpdate, setEventUserUpdate] = useState(false);

  // Role events
  const [eventRoleCreate, setEventRoleCreate] = useState(false);
  const [eventRoleUpdate, setEventRoleUpdate] = useState(false);
  const [eventRoleDelete, setEventRoleDelete] = useState(false);
  const [eventRoleMemberChange, setEventRoleMemberChange] = useState(false);

  // Voice events
  const [eventVoiceJoin, setEventVoiceJoin] = useState(false);
  const [eventVoiceLeave, setEventVoiceLeave] = useState(false);

  // Server events
  const [eventServerEdit, setEventServerEdit] = useState(false);
  const [eventEmojiUpdate, setEventEmojiUpdate] = useState(false);

  // Additional settings
  const [ignoreBots, setIgnoreBots] = useState(true);
  const [noThumbnails, setNoThumbnails] = useState(false);

  // ================================
  // LOADING STATE
  // ================================
  if (loadingChannels) {
    return (
      <p className="text-slate-300 text-sm animate-pulse">
        Loading channels…
      </p>
    );
  }

  // ================================
  // RENDER
  // ================================
  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Audit Logging</h2>
          <p className="mt-1 text-sm text-slate-400">
            Configure what events should be logged in your server.
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
          {/* Logging channel (single select) */}
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

          {/* Event groups grid */}
          <div className="grid gap-10 md:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="space-y-8">
              <EventGroup title="Moderation Events">
                <ToggleRow
                  label="Member muted"
                  value={eventMute}
                  onChange={setEventMute}
                />
                <ToggleRow
                  label="Member unmuted"
                  value={eventUnmute}
                  onChange={setEventUnmute}
                />
                <ToggleRow
                  label="Moderation ban"
                  value={eventBan}
                  onChange={setEventBan}
                />
                <ToggleRow
                  label="Moderation unban"
                  value={eventUnban}
                  onChange={setEventUnban}
                />
              </EventGroup>

              <EventGroup title="Message Events">
                <ToggleRow
                  label="Message updated"
                  value={eventMsgUpdate}
                  onChange={setEventMsgUpdate}
                />
                <ToggleRow
                  label="Message deleted"
                  value={eventMsgDelete}
                  onChange={setEventMsgDelete}
                />
                <ToggleRow
                  label="Invite posted"
                  value={eventInvite}
                  onChange={setEventInvite}
                />
              </EventGroup>

              <EventGroup title="Channel Events">
                <ToggleRow
                  label="Channel created"
                  value={eventRoleCreate}
                  onChange={setEventRoleCreate}
                />
                <ToggleRow
                  label="Channel updated"
                  value={eventRoleUpdate}
                  onChange={setEventRoleUpdate}
                />
                <ToggleRow
                  label="Channel deleted"
                  value={eventRoleDelete}
                  onChange={setEventRoleDelete}
                />
              </EventGroup>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-8">
              <EventGroup title="Member Events">
                <ToggleRow
                  label="Nickname changed"
                  value={eventNick}
                  onChange={setEventNick}
                />
                <ToggleRow
                  label="Member banned"
                  value={eventMemberBan}
                  onChange={setEventMemberBan}
                />
                <ToggleRow
                  label="Member joined server"
                  value={eventJoin}
                  onChange={setEventJoin}
                />
                <ToggleRow
                  label="Member left server"
                  value={eventLeave}
                  onChange={setEventLeave}
                />
                <ToggleRow
                  label="Member unbanned"
                  value={eventMemberUnban}
                  onChange={setEventMemberUnban}
                />
                <ToggleRow
                  label="User updated"
                  value={eventUserUpdate}
                  onChange={setEventUserUpdate}
                />
              </EventGroup>

              <EventGroup title="Role Events">
                <ToggleRow
                  label="Role created"
                  value={eventRoleCreate}
                  onChange={setEventRoleCreate}
                />
                <ToggleRow
                  label="Role updated"
                  value={eventRoleUpdate}
                  onChange={setEventRoleUpdate}
                />
                <ToggleRow
                  label="Role deleted"
                  value={eventRoleDelete}
                  onChange={setEventRoleDelete}
                />
                <ToggleRow
                  label="Member roles changed"
                  value={eventRoleMemberChange}
                  onChange={setEventRoleMemberChange}
                />
              </EventGroup>

              <EventGroup title="Voice Events">
                <ToggleRow
                  label="Member joined voice channel"
                  value={eventVoiceJoin}
                  onChange={setEventVoiceJoin}
                />
                <ToggleRow
                  label="Member left voice channel"
                  value={eventVoiceLeave}
                  onChange={setEventVoiceLeave}
                />
              </EventGroup>

              <EventGroup title="Server Events">
                <ToggleRow
                  label="Server edited"
                  value={eventServerEdit}
                  onChange={setEventServerEdit}
                />
                <ToggleRow
                  label="Emojis updated"
                  value={eventEmojiUpdate}
                  onChange={setEventEmojiUpdate}
                />
              </EventGroup>
            </div>
          </div>
        </div>
      </section>

      {/* IGNORED CHANNELS + EXTRA SETTINGS */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="px-6 py-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-50">
              Ignored Channels
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Messages updated/deleted in these channels will be ignored.
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
              label="Don't log actions made by bots"
              value={ignoreBots}
              onChange={setIgnoreBots}
            />
            <ToggleRow
              label="Don't display user thumbnails"
              value={noThumbnails}
              onChange={setNoThumbnails}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* REUSABLE SUBCOMPONENTS */

function EventGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-4">
      <Toggle value={value} onChange={onChange} />
      <span className="text-sm text-slate-200">{label}</span>
    </div>
  );
}
