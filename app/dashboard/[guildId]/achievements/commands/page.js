"use client";

import AchievementsTabs from "@/components/achievements/AchievementsTabs";

const COMMANDS = [
  {
    name: "/achievement",
    desc: "View your unlocked achievements.",
  },
  {
    name: "/achievement list",
    desc: "List all available achievements.",
  },
  {
    name: "/achievement top",
    desc: "Show the top members by achievements.",
  },
  {
    name: "/achievement debug",
    desc: "Check a member’s progress for an achievement.",
  },
];

export default function AchievementsCommandsPage({ params }) {
  const { guildId } = params;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Achievements</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of commands your members can use.
        </p>
      </div>

      <AchievementsTabs guildId={guildId} activeTab="commands" />

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">
          Achievement commands
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          {COMMANDS.map((cmd) => (
            <div
              key={cmd.name}
              className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {cmd.name}
                </p>
                <p className="text-xs text-slate-400">{cmd.desc}</p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center ml-4 shrink-0">
                <input
                  type="checkbox"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-indigo-500 transition-all" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-all shadow" />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
