"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";

export default function AutomodToggleCard({
  icon,
  title,
  description,
  severity = "Medium",
  defaultEnabled = false,
  badge,
  ruleId,
  guildId,
}) {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState(
    defaultEnabled ? "Enabled" : "Disabled"
  );

  const severityStyles = {
    Low: "bg-emerald-900/40 text-emerald-300 border-emerald-500/40",
    Medium: "bg-amber-900/40 text-amber-300 border-amber-500/40",
    High: "bg-rose-900/40 text-rose-300 border-rose-500/40",
  };

  const severityClass = severityStyles[severity] || severityStyles.Medium;

  const actions = [
    "Disabled",
    "Delete Message",
    "Warn Member",
    "Delete Message & Warn Member",
    "Timeout User 10m",
    "Timeout User 1h",
    "Timeout User 24h",
    "Ban User",
  ];

  return (
    <div
      className="
        rounded-2xl border border-slate-800 
        bg-[#0b1224]/80 shadow-sm p-5 
        hover:border-slate-700 hover:bg-[#0d152c]/80 
        transition-all overflow-visible
      "
    >
      {/* MAIN ROW */}
      <div className="flex justify-between items-start gap-3">

        {/* LEFT SECTION */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-12 w-12 flex items-center justify-center text-2xl rounded-xl bg-slate-900 border border-slate-700">
            {icon}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100 leading-none">
                {title}
              </h3>

              {badge && (
                <span className="rounded-full bg-indigo-900/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-300 border border-indigo-500/40">
                  {badge}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 leading-snug">
              {description}
            </p>
          </div>
        </div>

        {/* DROPDOWN MENU */}
        <div className="relative">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="
              bg-slate-800 border border-slate-700 text-slate-200 
              text-xs rounded-lg px-3 py-1.5 pr-7 
              appearance-none cursor-pointer
              focus:outline-none focus:ring-1 focus:ring-indigo-500
            "
          >
            {actions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2 top-2.5 text-slate-400"
          />
        </div>
      </div>

      {/* FOOTER ROW */}
      <div className="flex justify-between items-center mt-4 text-[11px]">

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${severityClass}`}
        >
          <span className="h-1.5 w-1.5 bg-current rounded-full" />
          <span className="uppercase font-semibold tracking-wide">
            {severity} action
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              router.push(`/dashboard/${guildId}/moderation/automod/${ruleId}`)
            }
            className="rounded-full border border-slate-700/80 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800/70 transition"
          >
            Edit rule
          </button>

          <button
            className="rounded-full border border-slate-800 px-3 py-1 text-[11px] text-slate-400 hover:bg-slate-900/70 transition"
          >
            View logs
          </button>

          <button className="p-1.5 hover:bg-slate-800 rounded-full border border-slate-700/70 transition">
            <Settings size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
