"use client";

import { useState } from "react";
import useSWR from "swr";

import Toggle from "@/components/ui/Toggle";
import ChannelDropdown from "@/components/inputs/ChannelDropdown";
import ChannelMultiSelect from "@/components/inputs/ChannelMultiSelect";

export default function AuditLoggingTab({ guildId }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data, isLoading } = useSWR(
    `/api/discord/guild/${guildId}/channels`,
    fetcher
  );

  const channels = data?.channels || [];

  // MAIN STATES
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [ignoredChannels, setIgnoredChannels] = useState([]);

  // Event groups
  const [modEvents, setModEvents] = useState({
    mute: true,
    unmute: true,
    ban: true,
    unban: true,
  });

  const [msgEvents, setMsgEvents] = useState({
    update: false,
    delete: false,
    invite: false,
  });

  const [memberEvents, setMemberEvents] = useState({
    nick: false,
    ban: false,
    join: false,
    leave: false,
    unban: false,
    userUpdate: false,
  });

  const [roleEvents, setRoleEvents] = useState({
    create: false,
    update: false,
    delete: false,
    memberChange: false,
  });

  const [voiceEvents, setVoiceEvents] = useState({
    join: false,
    leave: false,
  });

  const [serverEvents, setServerEvents] = useState({
    edit: false,
    emojiUpdate: false,
  });

  const [settings, setSettings] = useState({
    ignoreBots: true,
    noThumbnails: false,
  });

  if (isLoading)
    return (
      <p className="text-slate-300 text-sm animate-pulse">
        Loading channels…
      </p>
    );

  return (
    <div className="space-y-8">

      {/* HEADER */}
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

      {/* MAIN SETTINGS CARD */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="px-6 py-6 space-y-10">

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

          {/* EVENT GROUPS GRID */}
          <div className="grid gap-10 md:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="space-y-8">
              <EventGroup title="Moderation Events">
                <ToggleRow label="Member muted" state={modEvents} keyName="mute" setState={setModEvents} />
                <ToggleRow label="Member unmuted" state={modEvents} keyName="unmute" setState={setModEvents} />
                <ToggleRow label="Moderation ban" state={modEvents} keyName="ban" setState={setModEvents} />
                <ToggleRow label="Moderation unban" state={modEvents} keyName="unban" setState={setModEvents} />
              </EventGroup>

              <EventGroup title="Message Events">
                <ToggleRow label="Message updated" state={msgEvents} keyName="update" setState={setMsgEvents} />
                <ToggleRow label="Message deleted" state={msgEvents} keyName="delete" setState={setMsgEvents} />
                <ToggleRow label="Invite posted" state={msgEvents} keyName="invite" setState={setMsgEvents} />
              </EventGroup>

              <EventGroup title="Channel Events">
                <ToggleRow label="Channel created" state={roleEvents} keyName="create" setState={setRoleEvents} />
                <ToggleRow label="Channel updated" state={roleEvents} keyName="update" setState={setRoleEvents} />
                <ToggleRow label="Channel deleted" state={roleEvents} keyName="delete" setState={setRoleEvents} />
              </EventGroup>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-8">
              <EventGroup title="Member Events">
                <ToggleRow label="Nickname changed" state={memberEvents} keyName="nick" setState={setMemberEvents} />
                <ToggleRow label="Member banned" state={memberEvents} keyName="ban" setState={setMemberEvents} />
                <ToggleRow label="Member joined" state={memberEvents} keyName="join" setState={setMemberEvents} />
                <ToggleRow label="Member left" state={memberEvents} keyName="leave" setState={setMemberEvents} />
                <ToggleRow label="Member unbanned" state={memberEvents} keyName="unban" setState={setMemberEvents} />
                <ToggleRow label="User updated" state={memberEvents} keyName="userUpdate" setState={setMemberEvents} />
              </EventGroup>

              <EventGroup title="Role Events">
                <ToggleRow label="Role created" state={roleEvents} keyName="create" setState={setRoleEvents} />
                <ToggleRow label="Role updated" state={roleEvents} keyName="update" setState={setRoleEvents} />
                <ToggleRow label="Role deleted" state={roleEvents} keyName="delete" setState={setRoleEvents} />
                <ToggleRow label="Member roles changed" state={roleEvents} keyName="memberChange" setState={setRoleEvents} />
              </EventGroup>

              <EventGroup title="Voice Events">
                <ToggleRow label="Joined voice channel" state={voiceEvents} keyName="join" setState={setVoiceEvents} />
                <ToggleRow label="Left voice channel" state={voiceEvents} keyName="leave" setState={setVoiceEvents} />
              </EventGroup>

              <EventGroup title="Server Events">
                <ToggleRow label="Server edited" state={serverEvents} keyName="edit" setState={setServerEvents} />
                <ToggleRow label="Emojis updated" state={serverEvents} keyName="emojiUpdate" setState={setServerEvents} />
              </EventGroup>
            </div>
          </div>
        </div>
      </section>

      {/* IGNORED CHANNELS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="px-6 py-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-50">Ignored Channels</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Messages updated or deleted in these channels will be ignored by the logger.
            </p>
          </div>

          <ChannelMultiSelect
            channels={channels}
            values={ignoredChannels}
            onChange={setIgnoredChannels}
          />

          <div className="space-y-3 pt-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Additional settings
            </p>

            <ToggleRow label="Ignore actions made by bots" state={settings} keyName="ignoreBots" setState={setSettings} />
            <ToggleRow label="Hide user thumbnails" state={settings} keyName="noThumbnails" setState={setSettings} />
          </div>
        </div>
      </section>

    </div>
  );
}

/* ----------------------------------------- */
/* SHARED COMPONENTS                         */
/* ----------------------------------------- */

function EventGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-300 uppercase tracking-wide font-semibold">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, state, keyName, setState }) {
  return (
    <div className="flex items-center gap-4">
      <Toggle
        value={state[keyName]}
        onChange={(v) => setState({ ...state, [keyName]: v })}
      />
      <span classname="text-sm text-slate-200">{label}</span>
    </div>
  );
}
