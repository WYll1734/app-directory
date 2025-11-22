"use client";

import ServerSidebar from "@/components/server/ServerSidebar";

export default function DashboardLayout({ children, params }) {
  const guildId = params.guildid; // 🔥 EXACT MATCH

  return (
    <div className="flex">
      <ServerSidebar guildId={guildId} />

      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
