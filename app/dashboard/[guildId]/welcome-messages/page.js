"use client";

import { useState } from "react";
import ServerTopbar from "@/components/server/ServerTopbar";

// Simple toggle switch
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
        checked
          ? "border-indigo-500 bg-indigo-500"
          : "border-slate-600 bg-slate-800"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// Generic section card
function SectionCard({ title, description, toggle, children }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        {toggle}
      </div>
      {children}
    </section>
  );
}

export default function WelcomeMessagesPage({ params }) {
  const { guildId } = params;

  const [active, setActive] = useState(true);
  const [joinMessageEnabled, setJoinMessageEnabled] = useState(true);
  const [welcomeCardEnabled, setWelcomeCardEnabled] = useState(true);
  const [pmEnabled, setPmEnabled] = useState(false);
  const [roleEnabled, setRoleEnabled] = useState(false);
  const [leaveEnabled, setLeaveEnabled] = useState(false);
  const [messageMode, setMessageMode] = useState("text");

  return (
    <div className="space-y-6">
      <ServerTopbar
        guildId={guildId}
        title="Welcome & Goodbye"
        description="Automatically send messages and give roles to your new members and send a message when a member leaves your server."
      />

      {/* Header bar: Active toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Module status
          </p>
          <p className="text-sm text-slate-200">
            Control whether welcome & goodbye messages are currently active.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Active</span>
          <Toggle checked={active} onChange={() => setActive(v => !v)} />
        </div>
      </div>

      {/* JOIN MESSAGE SECTION */}
      <SectionCard
        title="Send a message when a user joins the server"
        toggle={
          <Toggle
            checked={joinMessageEnabled}
            onChange={() => setJoinMessageEnabled(v => !v)}
          />
        }
      >
        {/* Channel select */}
        <div className="mb-4 space-y-1 text-xs">
          <label className="font-medium text-slate-300">
            Welcome Message Channel <span className="text-rose-400">*</span>
          </label>
          <button className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-left text-xs text-slate-200">
            <span># joined</span>
            <span className="text-slate-500">▾</span>
          </button>
        </div>

        {/* Tabs: Text / Embed */}
        <div className="mb-3 inline-flex rounded-lg border border-slate-700 bg-slate-900/80 text-xs">
          <button
            type="button"
            className={`rounded-l-lg px-3 py-1.5 ${
              messageMode === "text"
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400"
            }`}
            onClick={() => setMessageMode("text")}
          >
            Text message
          </button>
          <button
            type="button"
            className={`rounded-r-lg px-3 py-1.5 ${
              messageMode === "embed"
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400"
            }`}
            onClick={() => setMessageMode("embed")}
          >
            Embed message
          </button>
        </div>

        {/* Message editor + floating counter */}
        <div className="mb-5">
          <div className="relative">
            <textarea
              className="h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 pr-20 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500"
              defaultValue={`Hey {user}, welcome to **{server}**!`}
            />
            <div className="pointer-events-none absolute bottom-2 right-3 rounded-md border border-slate-700/70 bg-slate-900/90 px-2 py-0.5 text-[10px] text-slate-400">
              36 / 2000
            </div>
          </div>
        </div>

        {/* Welcome card toggle */}
        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-900/80 px-4 py-3 text-xs text-slate-200">
          <span>Send a welcome card when a user joins the server</span>
          <Toggle
            checked={welcomeCardEnabled}
            onChange={() => setWelcomeCardEnabled(v => !v)}
          />
        </div>

        {/* Welcome card editor – visual only */}
        {welcomeCardEnabled && (
  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 overflow-hidden">
            {/* Preview */}
            <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800">
              <div className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 rounded-full bg-slate-900/90" />
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    ace537#0 just joined the server
                  </p>
                  <p className="text-xs text-slate-300">Member #5237</p>
                </div>
              </div>
            </div>

            <p className="mb-3 text-xs font-semibold text-slate-300">
              Customize your welcome card
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Font & text color */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block text-slate-300">Font</label>
                  <button className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-left text-slate-200">
                    <span>Search for a font…</span>
                    <span className="text-slate-500">▾</span>
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-slate-300">
                    Text color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "#f97373",
                      "#fb923c",
                      "#facc15",
                      "#4ade80",
                      "#22d3ee",
                      "#38bdf8",
                      "#6366f1",
                      "#a855f7",
                    ].map(c => (
                      <button
                        key={c}
                        className="h-5 w-5 rounded-full border border-slate-700"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Background & overlay */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block text-slate-300">
                    Background color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "#020617",
                      "#0f172a",
                      "#1e293b",
                      "#334155",
                      "#0369a1",
                      "#4c1d95",
                    ].map(c => (
                      <button
                        key={c}
                        className="h-5 w-5 rounded-full border border-slate-700"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-slate-300">
                    Overlay opacity
                  </label>
                  <div className="flex items-center gap-3">
                    {/* Not full-width, no random line */}
                    <div className="relative flex items-center">
                      <div className="h-3 w-3 rounded-full bg-slate-200" />
                    </div>

                    <span className="text-[11px] text-slate-400">50%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background upload */}
            <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)] text-xs">
              <div>
                <label className="mb-1 block text-slate-300">Background</label>
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/80 text-slate-500">
                  Upload an image…
                </div>
                <button className="mt-2 rounded-lg border border-rose-500/70 bg-rose-600/80 px-3 py-1.5 text-[11px] font-semibold text-white">
                  Delete card&apos;s background
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-slate-300">Title</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    defaultValue="{user.display_name} just joined the server"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-slate-300">Subtitle</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    defaultValue="Member # {server.member_count}"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* SIMPLE ROW CARDS */}
      <SectionCard
        title="Send a private message to new users"
        toggle={
          <Toggle
            checked={pmEnabled}
            onChange={() => setPmEnabled(v => !v)}
          />
        }
      >
        <p className="text-xs text-slate-400">
          Greet new members with a DM when they join your server. (UI only,
          behaviour not wired yet.)
        </p>
      </SectionCard>

      <SectionCard
        title="Give a role to new users"
        toggle={
          <Toggle
            checked={roleEnabled}
            onChange={() => setRoleEnabled(v => !v)}
          />
        }
      >
        <p className="text-xs text-slate-400">
          Automatically assign a default role to new members when they join.
        </p>
      </SectionCard>

      <SectionCard
        title="Send a message when a user leaves the server"
        toggle={
          <Toggle
            checked={leaveEnabled}
            onChange={() => setLeaveEnabled(v => !v)}
          />
        }
      >
        <p className="text-xs text-slate-400">
          Log goodbye messages in a channel when members leave.
        </p>
      </SectionCard>
    </div>
  );
}
