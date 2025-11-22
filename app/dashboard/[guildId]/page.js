import ServerTopbar from "@/components/server/ServerTopbar";

export default function OverviewPage({ params }) {
  const { guildId } = params;

  const essentials = [
    {
      label: "Welcome & Goodbye",
      description: "Automatically send messages and give roles when members join or leave.",
      icon: "🖐️",
      href: `/dashboard/${guildId}/welcome-messages`,
    },
    {
      label: "Welcome Channel",
      description: "A dedicated channel to welcome and guide new members.",
      icon: "🖼️",
      href: `/dashboard/${guildId}/welcome-messages`,
    },
    {
      label: "Reaction Roles",
      description: "Let members get roles by reacting to a message.",
      icon: "🏅",
      href: `/dashboard/${guildId}/reaction-roles`,
    },
    {
      label: "Moderator",
      description: "Keep your server safe with powerful moderation tools.",
      icon: "🔨",
      href: `/dashboard/${guildId}/moderation`,
    },
    {
      label: "Levels",
      description: "Give members XP & levels when they send messages.",
      icon: "🎮",
      href: `/dashboard/${guildId}/levels`,
    },
    {
      label: "Achievements",
      description: "Let your members unlock achievements for rewards.",
      icon: "🏆",
      href: `/dashboard/${guildId}/achievements`,
    },
  ];

  const utilities = [
    {
      label: "Ticket Embeds",
      description: "Create ticket panels for support and applications.",
      icon: "🎫",
      href: `/dashboard/${guildId}/ticket-embeds`,
    },
    {
      label: "Temp Channels",
      description: "Automatic temporary voice channels for members.",
      icon: "📢",
      href: `/dashboard/${guildId}/temp-channels`,
    },
    {
      label: "Embed Messages",
      description: "Create and publish rich embed messages.",
      icon: "📝",
      href: `/dashboard/${guildId}/embed-messages`,
    },
    {
      label: "Polls",
      description: "Create reaction-based polls for members.",
      icon: "📊",
      href: `/dashboard/${guildId}/polls`,
    },
    {
      label: "Reminders",
      description: "Set automated reminders and tasks.",
      icon: "⏰",
      href: `/dashboard/${guildId}/reminders`,
    },
    {
      label: "Statistics Channels",
      description: "Create channels that track server statistics.",
      icon: "📈",
      href: `/dashboard/${guildId}/statistics`,
    },
    {
      label: "Giveaways",
      description: "Host giveaways for your community.",
      icon: "🎉",
      href: `/dashboard/${guildId}/giveaways`,
    },
  ];

  const management = [
    {
      label: "Auto Roles",
      description: "Automatically assign roles to new members.",
      icon: "🎯",
      href: `/dashboard/${guildId}/auto-roles`,
    },
    {
      label: "Automations",
      description: "Automate tasks and server workflows.",
      icon: "⚙️",
      href: `/dashboard/${guildId}/automations`,
    },
    {
      label: "Custom Commands",
      description: "Create interactive custom bot commands.",
      icon: "💬",
      href: `/dashboard/${guildId}/custom-commands`,
    },
    {
      label: "Logging",
      description: "Track server events such as edits, bans, joins, etc.",
      icon: "📜",
      href: `/dashboard/${guildId}/logging`,
    },
    {
      label: "Bot Settings",
      description: "Edit bot configuration, permissions, and behavior.",
      icon: "⚡",
      href: `/dashboard/${guildId}/bot-settings`,
    },
  ];

  const renderCard = (item, index) => (
    <a
      key={item.label}
      href={item.href}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_0_0_rgba(0,0,0,0)] outline-none transition duration-200 hover:-translate-y-0.5 hover:border-indigo-500/70 hover:shadow-[0_0_30px_rgba(79,70,229,0.45)] focus-visible:ring-2 focus-visible:ring-indigo-500/70"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-2xl">
          {item.icon}
        </div>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-100 group-hover:text-white">
        {item.label}
      </h3>
      <p className="mb-4 text-sm text-slate-400">{item.description}</p>

      <button className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 group-hover:bg-indigo-600 group-hover:text-white">
        Enable
      </button>
    </a>
  );

  return (
    <div className="space-y-10">
      <ServerTopbar
        guildId={guildId}
        title="Overview"
        description="All modules available for this Discord server"
      />

      {/* Simple metrics row (static for now, can wire later) */}
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Modules Available", value: essentials.length + utilities.length + management.length },
          { label: "Essentials", value: essentials.length },
          { label: "Utilities", value: utilities.length },
          { label: "Server Management", value: management.length },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-400"
          >
            <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {metric.label}
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {metric.value}
            </div>
          </div>
        ))}
      </section>

      {/* ESSENTIALS */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Essentials</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {essentials.map((item, i) => renderCard(item, i))}
        </div>
      </section>

      {/* UTILITIES */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Utilities</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {utilities.map((item, i) => renderCard(item, i))}
        </div>
      </section>

      {/* SERVER MANAGEMENT */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Server Management</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {management.map((item, i) => renderCard(item, i))}
        </div>
      </section>
    </div>
  );
}
