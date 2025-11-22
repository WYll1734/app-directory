"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const MOCK_HUBS = [
  {
    id: "hub-1",
    name: "Temp Voice Hub",
    category: "Temp Channels",
    userLimit: 5,
    autoDelete: "After empty for 5 min",
    status: "Active",
  },
  {
    id: "hub-2",
    name: "Duo Queue",
    category: "Ranked",
    userLimit: 2,
    autoDelete: "After empty for 10 min",
    status: "Active",
  },
];

export default function TempChannelsPage({ params }) {
  const { guildId } = params;
  const [hubs] = useState(MOCK_HUBS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-50">
            Temp Channel Hubs
          </h3>
          <p className="text-xs text-slate-400">
            Layout matches the cards you showed: each hub with category, limit, and controls.
          </p>
        </div>
        <Link href={`/dashboard/${guildId}/temp-channels/new`}>
          <Button>New Hub</Button>
        </Link>
      </div>

      <Card className="p-4">
        {hubs.length === 0 ? (
          <div className="text-xs text-slate-400">
            No temp hubs yet. Click &quot;New Hub&quot; to create one.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {hubs.map((hub) => (
              <div
                key={hub.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-slate-50 font-medium">{hub.name}</div>
                    <div className="text-slate-400 text-[11px]">
                      Category: <span className="text-slate-200">{hub.category}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300 border border-emerald-500/40">
                    {hub.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <div>
                    User limit:{" "}
                    <span className="text-slate-200">{hub.userLimit}</span>
                  </div>
                  <div>
                    Auto-delete:{" "}
                    <span className="text-slate-200">{hub.autoDelete}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
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
