"use client";

import RuleEditLayout from "@/components/moderation/RuleEditLayout";

function getRuleConfig(ruleId) {
  switch (ruleId) {
    case "profanity":
      return {
        id: "profanity",
        title: "Profanity & slurs filter",
        description:
          "Block messages containing specific words or phrases you define.",
        extraFields: (
          <>
            <p className="text-xs text-slate-400">
              Hit enter or type a comma (“,") after each word.
            </p>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Bad words list (exact match)
              </span>
              <input
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                placeholder="Add a word..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Bad words list (match any part)
              </span>
              <input
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                placeholder="Add a word..."
              />
            </div>
          </>
        ),
        demoTitle: `Let's see a demo with bad word "how".`,
        demoExactLabel: (
          <>
            Hello world,{" "}
            <mark className="bg-red-500/40 px-1 rounded">how</mark> can I show
            my skill ?
          </>
        ),
        demoAnyLabel: (
          <>
            Hello world,{" "}
            <mark className="bg-red-500/40 px-1 rounded">how</mark> can I{" "}
            <mark className="bg-red-500/40 px-1 rounded">show</mark> my skill ?
          </>
        ),
      };

    case "links":
      return {
        id: "links",
        title: "Invite & link blocker",
        description:
          "Block unwanted invites and suspicious links, while allowing trusted domains.",
        extraFields: (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Blocked domains / patterns
              </span>
              <textarea
                rows={3}
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                placeholder="discord.gg/, bit.ly, suspicious-site.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">Allowed domains</span>
              <textarea
                rows={2}
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                placeholder="yourserver.com, roblox.com"
              />
            </div>
          </>
        ),
        demoTitle:
          'Messages containing blocked invites or domains will be deleted automatically.',
        demoExactLabel: (
          <>Join my server: discord.gg/abc123</>
        ),
        demoAnyLabel: (
          <>Check this out: http://bit.ly/suspicious</>
        ),
      };

    case "spam":
      return {
        id: "spam",
        title: "Spam detector",
        description:
          "Rate limit users who send too many messages in a short time.",
        extraFields: (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-slate-300">
                  Messages allowed per 5 seconds
                </span>
                <input
                  type="number"
                  className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                  defaultValue={5}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-slate-300">
                  Timeout duration (seconds)
                </span>
                <input
                  type="number"
                  className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                  defaultValue={60}
                />
              </div>
            </div>
          </>
        ),
        demoTitle:
          "If a user sends more messages than allowed, they will be rate-limited.",
        demoExactLabel: (
          <>User spams the same message 10 times in 3 seconds.</>
        ),
        demoAnyLabel: (
          <>User sends random spam messages extremely fast.</>
        ),
      };

    case "mentions":
      return {
        id: "mentions",
        title: "Mass mentions limiter",
        description:
          "Prevent spammy @everyone, @here and mass role mentions.",
        extraFields: (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Maximum mentions per message
              </span>
              <input
                type="number"
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                defaultValue={5}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" defaultChecked />
              Block @everyone and @here
            </label>
          </>
        ),
        demoTitle:
          "Messages that ping too many users or roles will be blocked.",
        demoExactLabel: (
          <>@everyone come play right now!!!</>
        ),
        demoAnyLabel: (
          <>Ping ping ping @Staff @Admin @Events @Owner</>
        ),
      };

    case "nsfw":
      return {
        id: "nsfw",
        title: "NSFW / sensitive phrases",
        description:
          "Flag or delete messages containing explicit or sensitive content.",
        extraFields: (
          <>
            <p className="text-xs text-slate-400 mb-2">
              Add phrases that should never appear in your server.
            </p>
            <textarea
              rows={3}
              className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
              placeholder="Explicit phrases, slurs, etc."
            />
          </>
        ),
        demoTitle:
          "Messages containing configured NSFW phrases will be blocked or flagged.",
        demoExactLabel: <>NSFW phrase in message.</>,
        demoAnyLabel: <>Longer message including part of a banned NSFW phrase.</>,
      };

    case "languages":
      return {
        id: "languages",
        title: "Foreign language / unknown scripts",
        description:
          "Flag messages that do not match your server's primary languages.",
        extraFields: (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">Allowed languages</span>
              <input
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                placeholder="English, Spanish"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" defaultChecked />
              Flag messages with unknown or mixed scripts
            </label>
          </>
        ),
        demoTitle:
          "Messages not matching allowed languages can be logged for review.",
        demoExactLabel: <>Message entirely in a disallowed language.</>,
        demoAnyLabel: <>Mixed language / unusual script message.</>,
      };

    case "caps":
      return {
        id: "caps",
        title: "ALL CAPS messages",
        description:
          "Detect messages written mostly in capital letters and treat as shouting.",
        extraFields: (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Maximum caps percentage
              </span>
              <input
                type="number"
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                defaultValue={70}
              />
            </div>
          </>
        ),
        demoTitle:
          "Messages with too many capital letters will be blocked or warned.",
        demoExactLabel: <>THIS IS AN EXAMPLE MESSAGE !!!</>,
        demoAnyLabel: <>Okay BUT WHY IS THIS LIKE THIS</>,
      };

    case "emoji":
      return {
        id: "emoji",
        title: "Emoji spam / Zalgo",
        description:
          "Limit messages overloaded with emojis or glitched Zalgo text.",
        extraFields: (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Max emojis per message
              </span>
              <input
                type="number"
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                defaultValue={15}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" defaultChecked />
              Block Zalgo / distorted text
            </label>
          </>
        ),
        demoTitle:
          "Messages flooded with emojis or Zalgo characters will be blocked.",
        demoExactLabel: <>😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀</>,
        demoAnyLabel: <>H̶͓͓͕̳͔͒͛̈́ȇ̴̗̠͂̇̋l̷͉͚͔͐͒̊͝p̷̳̤͇͋</>,
      };

    case "files":
      return {
        id: "files",
        title: "File & media filter",
        description:
          "Control which channels and users can send files, images, or media.",
        extraFields: (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">
                Blocked file extensions
              </span>
              <input
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm text-slate-200"
                placeholder=".exe, .bat, .jar"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" defaultChecked />
              Only allow media in specific channels
            </label>
          </>
        ),
        demoTitle:
          "Files with blocked extensions or in disallowed channels will be prevented.",
        demoExactLabel: <>User uploads file: virus.exe</>,
        demoAnyLabel: <>User sends large media in a restricted channel.</>,
      };

    default:
      return {
        id: "unknown",
        title: "Unknown rule",
        description: "This rule id does not have a UI yet.",
        extraFields: (
          <p className="text-sm text-slate-400">
            No additional settings are available for this rule.
          </p>
        ),
        demoTitle: "No demo available for this rule.",
        demoExactLabel: <>Example message.</>,
        demoAnyLabel: <>Example message with highlighted parts.</>,
      };
  }
}

export default function RuleEditPage({ params }) {
  const { guildId, ruleId } = params;

  const config = getRuleConfig(ruleId);

  return <RuleEditLayout guildId={guildId} ruleConfig={config} />;
}
