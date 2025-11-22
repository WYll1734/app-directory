"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Sidebar Sections (clean structure)
const sidebarSections = [
  {
    title: "Essentials",
    items: [
      { label: "Welcome & Goodbye", icon: "🖐️", id: "welcome-messages" },
      { label: "Welcome Channel", icon: "🖼️", id: "welcome-channel" },
      { label: "Reaction Roles", icon: "🏅", id: "reaction-roles" },
      { label: "Moderator", icon: "🔨", id: "moderation" },
      { label: "Levels", icon: "🎮", id: "levels" },
      { label: "Achievements", icon: "🏆", id: "achievements" },
    ],
  },

  {
    title: "Utilities",
    items: [
      { label: "Ticket Embeds", icon: "🎫", id: "ticket-embeds" },
      { label: "Temp Channels", icon: "📢", id: "temp-channels" },
      { label: "Embed Messages", icon: "📝", id: "embed-messages" },
      { label: "Polls", icon: "📊", id: "polls" },
      { label: "Reminders", icon: "⏰", id: "reminders" },
      { label: "Statistics Channels", icon: "📈", id: "statistics" },
      { label: "Giveaways", icon: "🎉", id: "giveaways" },
    ],
  },

  {
    title: "Server Management",
    items: [
      { label: "Auto Roles", icon: "🎯", id: "auto-roles" },
      { label: "Automations", icon: "⚙️", id: "automations" },
      { label: "Custom Commands", icon: "💬", id: "custom-commands" },
      { label: "Logging", icon: "📜", id: "logging" },
      { label: "Bot Settings", icon: "⚡", id: "bot-settings" },
    ],
  },
];

export default function ServerSidebar({ guildId }) {
  const pathname = usePathname();

  // Which sections are expanded
  const [openSections, setOpenSections] = useState({
    Essentials: true,
    Utilities: true,
    "Server Management": true,
  });

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/95 px-4 py-6 text-sm overflow-y-auto">
      <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Server Config
      </div>

      <nav className="space-y-5">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            
            {/* SECTION HEADER */}
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] 
                         text-slate-500 hover:text-slate-300 transition"
            >
              {section.title}
              <span className="text-xs">
                {openSections[section.title] ? "▾" : "▸"}
              </span>
            </button>

            {/* COLLAPSIBLE CONTENT */}
            {openSections[section.title] && (
              <div className="space-y-1 animate-fadeIn">
                {section.items.map((item) => {
                  const href = `/dashboard/${guildId}/${item.id}`;
                  const active = pathname.startsWith(href);

                  return (
                    <Link
                      key={item.label}
                      href={href}
                      className={[
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all duration-200",
                        active
                          ? "bg-indigo-600/95 text-white shadow-[0_0_16px_rgba(79,70,229,0.55)]"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white hover:shadow-[0_0_12px_rgba(15,23,42,0.4)]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-lg text-base",
                          active
                            ? "bg-indigo-700/80"
                            : "bg-slate-900/80 group-hover:bg-slate-800/80",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>

                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Small fade at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-slate-950 to-transparent" />
    </aside>
  );
}
