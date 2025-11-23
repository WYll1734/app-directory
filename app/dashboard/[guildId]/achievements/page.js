"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Icon files (cropped)
const tierIcons = {
  bronze: "/mnt/data/icon_bronze.png",
  silver: "/mnt/data/icon_silver.png",
  gold: "/mnt/data/icon_gold.png",
  diamond: "/mnt/data/icon_diamond.png",
};

export default function AchievementsPage({ params }) {
  const guildId = params.guildId;

  // Placeholder achievements data (replace with DB later)
  const achievements = [
    {
      id: "king_of_spam",
      title: "King of Spam",
      desc: "Send messages",
      tiers: { bronze: 20, silver: 100, gold: 500, diamond: 1000 },
      enabled: true,
    },
    {
      id: "reaction_master",
      title: "Reaction Master",
      desc: "Add reactions to messages",
      tiers: { bronze: 50, silver: 250, gold: 1000, diamond: 2000 },
      enabled: true,
    },
    {
      id: "voice_master",
      title: "Stay Awhile and Listen",
      desc: "Spend minutes in voice channels",
      tiers: { bronze: 10, silver: 60, gold: 300, diamond: 600 },
      enabled: true,
    },
    {
      id: "thread_creator",
      title: "Thread Creator",
      desc: "Create threads",
      tiers: { bronze: 5, silver: 25, gold: 100, diamond: 200 },
      enabled: true,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-white">Achievements</h1>
      <p className="text-slate-400">Let your members hunt achievements for rewards.</p>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <Link
            key={ach.id}
            href={`/dashboard/${guildId}/achievements/${ach.id}`}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800/50 transition relative"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{ach.title}</h2>
                <p className="text-sm text-slate-400">{ach.desc}</p>
              </div>

              {/* ON/OFF toggle placeholder */}
              <div
                className={`h-5 w-10 rounded-full transition ${
                  ach.enabled ? "bg-blue-500" : "bg-slate-600"
                }`}
              ></div>
            </div>

            {/* Tiers — with ICONS */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Image
                  src={tierIcons.bronze}
                  width={22}
                  height={22}
                  alt="Bronze"
                  className="rounded"
                />
                <span>Bronze — {ach.tiers.bronze}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Image
                  src={tierIcons.silver}
                  width={22}
                  height={22}
                  alt="Silver"
                  className="rounded"
                />
                <span>Silver — {ach.tiers.silver}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Image
                  src={tierIcons.gold}
                  width={22}
                  height={22}
                  alt="Gold"
                  className="rounded"
                />
                <span>Gold — {ach.tiers.gold}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Image
                  src={tierIcons.diamond}
                  width={22}
                  height={22}
                  alt="Diamond"
                  className="rounded"
                />
                <span>Diamond — {ach.tiers.diamond}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <p className="text-xs text-slate-500">Server progress</p>
              <div className="w-full h-2 mt-1 rounded bg-slate-800">
                <div className="h-full bg-indigo-500 rounded" style={{ width: "0%" }}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
