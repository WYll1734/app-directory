"use client";

import { useState } from "react";
import useSWR from "swr";

import Toggle from "@/components/ui/Toggle";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function AuditLoggingTab({ guildId }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());

  // ----------------------------
  // FETCH CHANNELS
  // ----------------------------
  const { data, isLoading } = useSWR(
    `/api/discord/guilds/${guildId}/channels`,
    fetcher
  );

  const channels = data?.channels || [];

  // ----------------------------
  // UI STATES
  // ----------------------------
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

  // Channel events
  const [eventChannelCreate, setEventChannelCreate] = useState(false);
  const [eventChannelUpdate, setEventChannelUpdate] = useState(false);
  const [eventChannelDelete, setEventChannelDelete] = useState(false);

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

  if (isLoading)
    return <p className="text-slate-300 animate-pulse">Loading channels…</p>;

  // ----------------------------
  // COMPONENT START
  ------------------------------
  return (
    <div className="space-y-8">

      {/* =====================================================
         HEADER
      ===================================================== */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Audit Logging</h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose what events ServerMate should log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">Enabled</span>
          <Toggle value={loggingEnabled} onChange={setLoggingEnabled} />
        </div>
      </div>

      {/* =====================================================
         LOGGING CHANNEL
      ===================================================== */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
        <h3 className="font-semibold text-slate-200 text-lg">
          Logging Destination
        </h3>

        <p className="text-sm text-slate-400 max-w-xl">
          Choose the channel where logs will be sent.
        </p>

        <ChannelDropdown
          channels={channels}
          value={selectedChannel}
          onChange={setSelectedChannel}
        />
      </section>

      {/* =====================================================
         EVENT GROUPS
      ===================================================== */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="grid gap-12 md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            {/* Moderation */}
            <EventGroup title="Moderation Events">
              <ToggleRow label="Member muted" value={eventMute} onChange={setEventMute} />
              <ToggleRow label="Member unmuted" value={eventUnmute} onChange={setEventUnmute} />
              <ToggleRow label="Moderation ban" value={eventBan} onChange={setEventBan} />
              <ToggleRow label="Moderation unban" value={eventUnban} onChange={setEventUnban} />
            </EventGroup>

            {/* Messages */}
            <EventGroup title="Message Events">
              <ToggleRow label="Message updated" value={eventMsgUpdate} onChange={setEventMsgUpdate} />
              <ToggleRow label="Message deleted" value={eventMsgDelete} onChange={setEventMsgDelete} />
              <ToggleRow label="Invite posted" value={eventInvite} onChange={setEventInvite} />
            </EventGroup>

            {/* Channels */}
            <EventGroup title="Channel Events">
              <ToggleRow label="Channel created" value={eventChannelCreate} onChange={setEventChannelCreate} />
              <ToggleRow label="Channel updated" value={eventChannelUpdate} onChange={setEventChannelUpdate} />
              <ToggleRow label="Channel deleted" value={eventChannelDelete} onChange={setEventChannelDelete} />
            </EventGroup>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">

            {/* Member */}
            <EventGroup title="Member Events">
              <ToggleRow label="Nickname changed" value={eventNick} onChange={setEventNick} />
              <ToggleRow label="Member banned" value={eventMemberBan} onChange={setEventMemberBan} />
              <ToggleRow label="Member joined server" value={eventJoin} onChange={setEventJoin} />
              <ToggleRow label="Member left server" value={eventLeave} onChange={setEventLeave} />
              <ToggleRow label="Member unbanned" value={eventMemberUnban} onChange={setEventMemberUnban} />
              <ToggleRow label="User updated" value={eventUserUpdate} onChange={setEventUserUpdate} />
            </EventGroup>

            {/* Roles */}
            <EventGroup title="Role Events">
              <ToggleRow label="Role created" value={eventRoleCreate} onChange={setEventRoleCreate} />
              <ToggleRow label="Role updated" value={eventRoleUpdate} onChange={setEventRoleUpdate} />
              <ToggleRow label="Role deleted" value={eventRoleDelete} onChange={setEventRoleDelete} />
              <ToggleRow label="Member roles changed" value={eventRoleMemberChange} onChange={setEventRoleMemberChange} />
            </EventGroup>

            {/* Voice */}
            <EventGroup title="Voice Events">
              <ToggleRow label="Joined voice channel" value={eventVoiceJoin} onChange={setEventVoiceJoin} />
              <ToggleRow label="Left voice channel" value={eventVoiceLeave} onChange={setEventVoiceLeave} />
            </EventGroup>

            {/* Server */}
            <EventGroup title="Server Events">
              <ToggleRow label="Server updated" value={eventServerEdit} onChange={setEventServerEdit} />
              <ToggleRow label="Emoji updated" value={eventEmojiUpdate} onChange={setEventEmojiUpdate} />
            </EventGroup>

          </div>

        </div>
      </section>

      {/* =====================================================
         IGNORED CHANNELS
      ===================================================== */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
        <div>
          <h3 className="font-semibold text-slate-200 text-lg">
            Ignored Channels
          </h3>
          <p className="text-sm text-slate-400 max-w-xl">
            Messages deleted/edited in these channels will not be logged.
          </p>
        </div>

        <ChannelMultiSelect
          channels={channels}
          values={ignoredChannels}
          onChange={setIgnoredChannels}
        />

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Additional Settings</p>

          <ToggleRow label="Ignore bot actions" value={ignoreBots} onChange={setIgnoreBots} />
          <ToggleRow label="Disable user thumbnails" value={noThumbnails} onChange={setNoThumbnails} />
        </div>
      </section>

    </div>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function EventGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-4 group">
      <Toggle value={value} onChange={onChange} />
      <span className="text-sm text-slate-200 group-hover:text-white transition">
        {label}
      </span>
    </div>
  );
}
