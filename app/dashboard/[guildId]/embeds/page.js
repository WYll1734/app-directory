"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const MOCK_EMBEDS = [
  {
    id: "1",
    name: "Support Tickets",
    channel: "#tickets",
    buttonLabel: "Open Ticket",
    createdAt: "2025-11-01",
  },
  {
    id: "2",
    name: "Staff Applications",
    channel: "#applications",
    buttonLabel: "Apply",
    createdAt: "2025-11-05",
  },
];

export default function EmbedsPage({ params }) {
  const { guildId } = params;
  const [embeds] = useState(MOCK_EMBEDS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-50">
            Ticket Embeds
          </h3>
          <p className="text-xs text-slate-400">
            This page only shows made embeds with a create new embed button.
          </p>
        </div>
        <Link href={`/dashboard/${guildId}/embeds/new`}>
          <Button>New embed message</Button>
        </Link>
      </div>

      <Card className="p-4">
        {embeds.length === 0 ? (
          <div className="text-xs text-slate-400">
            No embeds yet. Click &quot;New embed message&quot; to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {embeds.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs"
              >
                <div>
                  <div className="font-medium text-slate-50">{e.name}</div>
                  <div className="text-slate-400">
                    Channel: <span className="text-slate-200">{e.channel}</span>
                    {" · "}
                    Button:{" "}
                    <span className="text-slate-200">{e.buttonLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800">
                    Edit
                  </button>
                  <button className="rounded-lg border border-red-500/50 px-2 py-1 text-[11px] text-red-300 hover:bg-red-500/20">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
