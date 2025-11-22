"use client";

import ModerationTabs from "@/components/moderation/ModerationTabs";
import AutomodToggleCard from "@/components/moderation/AutomodToggleCard";

const coreRules = [
  {
    id: "profanity",
    icon: "🧼",
    title: "Profanity & slurs filter",
    description:
      "Detect and block messages containing heavy profanity, hate speech, or slurs.",
    severity: "High",
    badge: "Recommended",
    enabled: true,
  },
  {
    id: "links",
    icon: "🔗",
    title: "Invite & link blocker",
    description:
      "Block unauthorized invite links, phishing links, and suspicious domains.",
    severity: "Medium",
    enabled: true,
  },
  {
    id: "spam",
    icon: "⚡",
    title: "Spam detector",
    description:
      "Rate-limit users sending the same message, emote spam, or ultra-fast messages.",
    severity: "Medium",
    enabled: true,
  },
  {
    id: "mentions",
    icon: "📢",
    title: "Mass mentions limiter",
    description:
      "Prevent users from pinging @everyone, @here or mass-mentioning roles/users.",
    severity: "High",
    enabled: true,
  },
  {
    id: "nsfw",
    icon: "🔞",
    title: "NSFW / sensitive phrases",
    description:
      "Flag messages containing sexual content or other sensitive topics.",
    severity: "High",
    enabled: false,
  },
  {
    id: "languages",
    icon: "🌐",
    title: "Foreign language / unknown scripts",
    description:
      "Optionally flag messages using non-allowed languages or unusual scripts.",
    severity: "Low",
    enabled: false,
  },
];

const advancedRules = [
  {
    id: "caps",
    icon: "🔠",
    title: "ALL CAPS messages",
    description: "Detect excessive caps usage and automatically warn or mute users.",
    severity: "Low",
    enabled: false,
  },
  {
    id: "emoji",
    icon: "🎨",
    title: "Emoji spam / Zalgo",
    description:
      "Catch messages flooded with emojis, zalgo text or other visual spam.",
    severity: "Medium",
    enabled: false,
  },
  {
    id: "files",
    icon: "📎",
    title: "File & media filter",
    description:
      "Restrict attachments in specific channels or for new members only.",
    severity: "Medium",
    enabled: false,
  },
];

export default function AutomodPage({ params }) {
  const guildId = params.guildId;

  return (
    <div className="flex flex-col gap-6 overflow-visible relative">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-50">Moderator Panel</h1>
        <p className="text-sm text-slate-400">
          Configure automated protection rules to keep your server clean and safe.
        </p>
      </div>

      <ModerationTabs guildId={guildId} activeTab="automod" />

      <section className="grid gap-4 md:grid-cols-3 overflow-visible relative">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Messages scanned (last 24h)
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">128,493</p>
          <p className="mt-1 text-xs text-emerald-400">+14% vs previous day</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Filters active
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">6 / 9</p>
          <p className="mt-1 text-xs text-slate-400">You can fine-tune each rule below.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Last updated
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-50">Just now</p>
          <p className="mt-1 text-xs text-slate-400">UI only for now — no changes are sent to the bot yet.</p>
        </div>
      </section>

      <section className="flex flex-col gap-3 overflow-visible relative">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Core filters</h2>
          <p className="text-xs text-slate-400">
            Essential rules that catch the most common bad behaviour in your server.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 overflow-visible relative z-20">
          {coreRules.map((rule) => (
            <AutomodToggleCard
              key={rule.id}
              icon={rule.icon}
              title={rule.title}
              description={rule.description}
              severity={rule.severity}
              defaultEnabled={rule.enabled}
              badge={rule.badge}
              ruleId={rule.id}
              guildId={guildId}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 overflow-visible relative">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Advanced rules</h2>
          <p className="text-xs text-slate-400">
            Fine-tune stricter filters to keep high-risk channels under control.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 overflow-visible relative z-20">
          {advancedRules.map((rule) => (
            <AutomodToggleCard
              key={rule.id}
              icon={rule.icon}
              title={rule.title}
              description={rule.description}
              severity={rule.severity}
              defaultEnabled={rule.enabled}
              ruleId={rule.id}
              guildId={guildId}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
