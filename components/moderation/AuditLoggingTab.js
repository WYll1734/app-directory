"use client";

import { useState } from "react";
import useSWR from "swr";

// Inputs
import Toggle from "@/components/ui/Toggle";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function AuditLoggingTab({ guildId }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());

  // Fetch channels
  const { data, isLoading } = useSWR(
    `/api/discord/guild/${guildId}/channels`,
    fetcher
  );

  const channels = data?.channels || [];

  // ============================
  // STATE
  // ============================
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [logChannel, setLogChannel] = useState(null);
  const [ignoredChannels, setIgnoredChannels] = useState([]);

  // Moderation Events
  const [mute, setMute] = useState(true);
  const [unmute, setUnmute] = useState(true);
  const [ban, setBan] = useState(true);
  const [unban, setUnban] = useState(true);

  // Message Events
  const [msgUpdate, setMsgUpdate] = useState(false);
  const [msgDelete, setMsgDelete] = useState(false);
  const [invite, setInvite] = useState(false);

  // Member Events
  const [nick, setNick] = useState(false);
  const [memberBan, setMemberBan] = useState(false);
  const [join, setJoin] = useState(false);
  const [leave, setLeave] = useState(false);
  const [memberUnban, setMemberUnban] = useState(false);
  const [userUpdate, setUserUpdate] = useState(false);

  // Role Events
  const [roleCreate, setRoleCreate] = useState(false);
  const [roleUpdate, setRoleUpdate] = useState(false);
  const [roleDelete, setRoleDelete] = useState(false);
  const [roleMemberChange, setRoleMemberChange] = useState(false);

  // Voice Events
  const [voiceJoin, setVoiceJoin] = useState(false);
  const [voiceLeave, setVoiceLeave] = useState(false);

  // Server Events
  const [serverEdit, setServerEdit] = useState(false);
  const [emojiUpdate, setEmojiUpdate] = useState(false);

  // Additional
  const [ignoreBots, setIgnoreBots] = useState(true);
  const [noThumb, setNoThumb] = useState(false);

  if (isLoading) return <p className="text-slate-300">Loading channels…</p>;

  return (
    <div className="space-y-8">

      {/* Header */}
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
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-10">

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

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            <EventGroup title="Moderation Events">
              <ToggleRow label="Member muted" value={mute} onChange={setMute} />
              <ToggleRow label="Member unmuted" value={unmute} onChange={setUnmute} />
              <ToggleRow label="Moderation ban" value={ban} onChange={setBan} />
              <ToggleRow label="Moderation unban" value={unban} onChange={setUnban} />
            </EventGroup>

            <EventGroup title="Message Events">
              <ToggleRow label="Message updated" value={msgUpdate} onChange={setMsgUpdate} />
              <ToggleRow label="Message deleted" value={msgDelete} onChange={setMsgDelete} />
              <ToggleRow label="Invite posted" value={invite} onChange={setInvite} />
            </EventGroup>

            <EventGroup title="Channel Events">
              <ToggleRow label="Channel created" value={roleCreate} onChange={setRoleCreate} />
              <ToggleRow label="Channel updated" value={roleUpdate} onChange={setRoleUpdate} />
              <ToggleRow label="Channel deleted" value={roleDelete} onChange={setRoleDelete} />
            </EventGroup>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">

            <EventGroup title="Member Events">
              <ToggleRow label="Nickname changed" value={nick} onChange={setNick} />
              <ToggleRow label="Member banned" value={memberBan} onChange={setMemberBan} />
              <ToggleRow label="Member joined server" value={join} onChange={setJoin} />
              <ToggleRow label="Member left server" value={leave} onChange={setLeave} />
              <ToggleRow label="Member unbanned" value={memberUnban} onChange={setMemberUnban} />
              <ToggleRow label="User updated" value={userUpdate} onChange={setUserUpdate} />
            </EventGroup>

            <EventGroup title="Role Events">
              <ToggleRow label="Role created" value={roleCreate} onChange={setRoleCreate} />
              <ToggleRow label="Role updated" value={roleUpdate} onChange={setRoleUpdate} />
              <ToggleRow label="Role deleted" value={roleDelete} onChange={setRoleDelete} />
              <ToggleRow
                label="Member roles changed"
                value={roleMemberChange}
                onChange={setRoleMemberChange}
              />
            </EventGroup>

            <EventGroup title="Voice Events">
              <ToggleRow label="Joined voice channel" value={voiceJoin} onChange={setVoiceJoin} />
              <ToggleRow label="Left voice channel" value={voiceLeave} onChange={setVoiceLeave} />
            </EventGroup>

            <EventGroup title="Server Events">
              <ToggleRow label="Server edited" value={serverEdit} onChange={setServerEdit} />
              <ToggleRow label="Emojis updated" value={emojiUpdate} onChange={setEmojiUpdate} />
            </EventGroup>

          </div>

        </div>
      </section>

      {/* IGNORED CHANNELS */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">

        <div>
          <h3 className="text-base font-semibold text-slate-50">Ignored Channels</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Messages updated/deleted in these channels will not be logged.
          </p>
        </div>

        <ChannelMultiSelect
          channels={channels}
          values={ignoredChannels}
          onChange={setIgnoredChannels}
        />

        {/* ADDITIONAL SETTINGS */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Additional settings</p>

          <ToggleRow
            label="Don't log actions made by bots"
            value={ignoreBots}
            onChange={setIgnoreBots}
          />

          <ToggleRow
            label="Don't display user thumbnails"
            value={noThumb}
            onChange={setNoThumb}
          />
        </div>
      </section>

    </div>
  );
}

/* =============================
   SMALL COMPONENTS
============================= */

function EventGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">{title}</p>
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
